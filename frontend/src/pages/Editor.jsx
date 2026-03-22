import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Editor2 from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper.js";
import { toast } from "react-toastify";
import * as monaco from "monaco-editor";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const Editor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState("vs-dark");
  const [isRunning, setIsRunning] = useState(false);

  const { id } = useParams();
  const { getToken } = useAuth();

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // ---------- Fetch project on mount ----------
  useEffect(() => {
    let cancelled = false;

    const fetchProject = async () => {
      try {
        const token = await getToken({ template: "default" });

        const res = await fetch(`${api_base_url}/getProject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectId: id }),
        });

        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          console.error("Backend returned invalid JSON:", err);
          toast.error("Invalid response from server.");
          return;
        }

        if (cancelled) return;

        if (json?.success) {
          setCode(json.project.code ?? "");
          setData(json.project);
        } else {
          toast.error(json?.msg || "Failed to fetch project.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        toast.error("Failed to load project.");
      }
    };

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [id, getToken]);

  // ---------- Save project ----------
  const saveProject = async () => {
    try {
      const token = await getToken({ template: "default" });

      const response = await fetch(`${api_base_url}/saveProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: id,
          code: String(code ?? "").trim(),
        }),
      });

      const json = await response.json();

      if (json?.success) {
        toast.success(json.msg || "Project saved successfully!");
      } else {
        toast.error(json?.msg || "Failed to save project.");
      }
    } catch (err) {
      console.error("Error saving project:", err);
      toast.error("Something went wrong while saving the project.");
    }
  };

  // ---------- Editor mount ----------
  const handleEditorMount = (editor, monacoNS) => {
    editorRef.current = editor;
    monacoRef.current = monacoNS;

    try {
      monacoNS.editor.defineTheme("dracula-custom", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", background: "282a36" },
          { token: "comment", foreground: "6272a4" },
          { token: "string", foreground: "f1fa8c" },
          { token: "keyword", foreground: "ff79c6" },
          { token: "number", foreground: "bd93f9" },
        ],
        colors: {
          "editor.background": "#282a36",
          "editor.foreground": "#f8f8f2",
          "editorCursor.foreground": "#f8f8f0",
          "editor.selectionBackground": "#44475a",
        },
      });
    } catch (err) {
      console.error("Error defining custom theme:", err);
    }

    try {
      monacoNS.editor.setTheme(theme);
    } catch (err) {
      console.error("Error applying theme on mount:", err);
    }
  };

  // reapply theme when changed
  useEffect(() => {
    try {
      if (monacoRef.current) monacoRef.current.editor.setTheme(theme);
      else if (window.monaco?.editor) window.monaco.editor.setTheme(theme);
    } catch (err) {
      console.error("Error applying theme change:", err);
    }
  }, [theme]);

  // ---------- Keyboard shortcuts ----------
  const saveProjectRef = useRef(null);
  useEffect(() => {
    saveProjectRef.current = saveProject;
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        saveProjectRef.current && saveProjectRef.current();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        toggleComment();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ---------- Toggle comment ----------
  const toggleComment = () => {
    const editor = editorRef.current;
    const monacoNS = monacoRef.current || monaco;
    if (!editor || !monacoNS) return;

    const model = editor.getModel();
    const selection = editor.getSelection();
    if (!model || !selection) return;

    const startLine = selection.startLineNumber;
    const endLine = selection.endLineNumber;

    let allCommented = true;
    for (let line = startLine; line <= endLine; line++) {
      const txt = model.getLineContent(line).trim();
      if (!txt.startsWith("//")) {
        allCommented = false;
        break;
      }
    }

    const edits = [];
    for (let line = startLine; line <= endLine; line++) {
      const lineContent = model.getLineContent(line);

      if (allCommented) {
        const match = lineContent.match(/^(\s*)\/\/\s?(.*)$/);
        if (match) {
          const range = new monacoNS.Range(line, 1, line, lineContent.length + 1);
          edits.push({ range, text: match[1] + (match[2] ?? ""), forceMoveMarkers: true });
        }
      } else {
        const match = lineContent.match(/^(\s*)(.*)$/);
        const leading = match ? match[1] : "";
        const rest = match ? match[2] : lineContent;
        const range = new monacoNS.Range(line, 1, line, lineContent.length + 1);
        edits.push({ range, text: `${leading}//${rest}`, forceMoveMarkers: true });
      }
    }

    if (edits.length > 0) {
      editor.pushUndoStop();
      editor.executeEdits("toggle-comment", edits);
      editor.pushUndoStop();
      setCode(model.getValue());
    }
  };

  // ---------- Run project (Backend -> Glot.io, no CORS) ----------
  const runProject = async () => {
    if (!data) {
      toast.error("Project metadata not loaded yet.");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setError(false);

    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(`${api_base_url}/runCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language: data.projLanguage,
          code,
        }),
      });

      const text = await res.text();
      if (!text || text.trim() === "") {
        setOutput("Error: Server returned empty response. Please try again.");
        setError(true);
        return;
      }

      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        setOutput("Error: Could not parse server response.\n\n" + text);
        setError(true);
        return;
      }

      if (!json?.success) {
        setOutput("Error: " + (json?.msg || "Failed to run code."));
        setError(true);
        return;
      }

      // Glot.io returns stdout, stderr, error fields inside json.data
      const glot     = json.data;
      const stdout   = glot?.stdout  ?? "";
      const stderr   = glot?.stderr  ?? "";
      const runError = glot?.error   ?? "";

      const isError  = Boolean(stderr || runError);
      const finalOut = isError
        ? (stderr || runError)
        : (stdout || "Program finished with no output.");

      setOutput(finalOut);
      setError(isError);
    } catch (err) {
      console.error("Run error:", err);
      toast.error("Failed to run code. Check your internet connection.");
      setOutput("Error: Could not connect to execution server.");
      setError(true);
    } finally {
      setIsRunning(false);
    }
  };

  // ---------- Theme options ----------
  const themeOptions = [
    { value: "vs-dark",        label: "VS Dark"       },
    { value: "vs-light",       label: "VS Light"      },
    { value: "hc-black",       label: "High Contrast" },
    { value: "dracula-custom", label: "Dracula"       },
  ];

  // ---------- JSX ----------
  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[calc(100vh-70px)] w-full"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #111111 50%, #0d0d0d 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto p-6">

          {/* Top toolbar */}
          <div
            className="backdrop-blur-sm bg-white/6 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{ boxShadow: "0 6px 30px rgba(2,6,23,0.6)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-white/90 font-semibold">
                  {data?.name ?? "Loading project..."}
                </span>
                <span className="text-xs text-white/60">
                  {data?.projLanguage
                    ? `${data.projLanguage} • ${data.version ?? "latest"}`
                    : "Language not set"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-white/80 mr-2 hidden md:inline">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="text-sm px-3 py-2 rounded-md bg-black/30 border border-white/8 text-white outline-none"
              >
                {themeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <button
                onClick={saveProject}
                className="px-4 py-2 rounded-md bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md hover:brightness-105 transition"
                title="Save (Ctrl/Cmd + S)"
              >
                Save
              </button>

              <button
                onClick={runProject}
                disabled={isRunning}
                className="px-4 py-2 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                title="Run"
              >
                {isRunning ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Running...
                  </>
                ) : (
                  "Run"
                )}
              </button>
            </div>
          </div>

          {/* Main panels */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Editor panel */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 8px 30px rgba(4,10,30,0.6)",
                minHeight: "70vh",
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-white/80 ml-3">Editor</span>
                </div>
                <div className="text-xs text-white/60">Ctrl/Cmd + / to toggle comments</div>
              </div>

              <div style={{ height: "calc(70vh - 48px)" }}>
                <Editor2
                  onMount={handleEditorMount}
                  theme={theme}
                  height="100%"
                  language={
                    data?.projLanguage === "cpp"
                      ? "cpp"
                      : data?.projLanguage || "javascript"
                  }
                  value={code}
                  onChange={(newCode) => setCode(newCode ?? "")}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    automaticLayout: true,
                    smoothScrolling: true,
                  }}
                />
              </div>
            </div>

            {/* Output panel */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 8px 30px rgba(4,10,30,0.6)",
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/6 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/80 font-medium">Output</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      error
                        ? "bg-red-500/20 text-red-300"
                        : output
                        ? "bg-green-500/20 text-green-300"
                        : "text-white/50"
                    }`}
                  >
                    {isRunning ? "Running..." : error ? "Error" : output ? "Success" : "Idle"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(output ?? "");
                      toast.success("Output copied to clipboard");
                    }}
                    className="px-3 py-1 rounded-md bg-white/6 border border-white/8 text-white text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      setOutput("");
                      setError(false);
                    }}
                    className="px-3 py-1 rounded-md bg-white/6 border border-white/8 text-white text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div
                className="flex-1 overflow-auto rounded-md p-4"
                style={{
                  background: "rgba(4,6,22,0.6)",
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {isRunning ? (
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Running code...
                  </div>
                ) : (
                  <pre
                    className={`whitespace-pre-wrap text-sm font-mono ${
                      error ? "text-rose-300" : "text-green-200"
                    }`}
                  >
                    {output ? output : "Run your code to see the result here..."}
                  </pre>
                )}
              </div>

              {/* Metadata */}
              <div className="mt-4 text-xs text-white/60 space-y-1">
                <div>
                  Project: <span className="text-white/90">{data?.name ?? "—"}</span>
                </div>
                <div>
                  Language: <span className="text-white/90">{data?.projLanguage ?? "—"}</span>
                </div>
                <div>
                  Powered by:{" "}
                  <a
                    href="https://glot.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Glot.io
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer tip */}
          <div className="mt-6 text-xs text-white/50 text-center">
            Tip: Use <span className="text-white/80">Ctrl/Cmd + S</span> to save,{" "}
            <span className="text-white/80">Ctrl/Cmd + /</span> to toggle comments.
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Editor;
