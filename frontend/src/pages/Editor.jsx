import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Editor2 from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper.js";
import { toast } from "react-toastify";
import * as monaco from "monaco-editor";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

/**
 * Ultra-modern Gradient + Glass Hybrid Editor page
 * - Improved keyboard shortcut handling (Ctrl/Cmd+S)
 * - Fixed comment toggle (Ctrl/Cmd+/) using Monaco editor API
 * - Safer run filename construction
 * - Glass panels, subtle gradients, neat toolbar
 *
 * Note: relies on Tailwind classes available in your project.
 */

const Editor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState("vs-dark");

  const { id } = useParams();
  const { getToken } = useAuth();

  // keep refs for monaco editor instance + monaco namespace
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

  // ---------- Editor mount (store refs + define themes) ----------
  const handleEditorMount = (editor, monacoNS) => {
    editorRef.current = editor;
    monacoRef.current = monacoNS;

    // define a small Dracula-like theme only once
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

    // apply theme immediately
    try {
      monacoNS.editor.setTheme(theme);
    } catch (err) {
      console.error("Error applying theme on mount:", err);
    }
  };

  // reapply theme when changed
  useEffect(() => {
    // prefer monaco instance if available
    try {
      if (monacoRef.current) monacoRef.current.editor.setTheme(theme);
      else if (window.monaco?.editor) window.monaco.editor.setTheme(theme);
    } catch (err) {
      console.error("Error applying theme change:", err);
    }
  }, [theme]);

  // ---------- Keyboard shortcuts (attach once) ----------
  useEffect(() => {
    const onKeyDown = (e) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        saveProject();
        return;
      }

      // Toggle comment: Ctrl/Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        toggleComment();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // attach once — no deps so it's stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Toggle comment using Monaco API ----------
  const toggleComment = () => {
    const editor = editorRef.current;
    const monacoNS = monacoRef.current || monaco;
    if (!editor || !monacoNS) {
      return;
    }

    const model = editor.getModel();
    const selection = editor.getSelection();

    if (!model || !selection) return;

    const startLine = selection.startLineNumber;
    const endLine = selection.endLineNumber;

    // Determine whether all selected lines are commented
    let allCommented = true;
    for (let line = startLine; line <= endLine; line++) {
      const txt = model.getLineContent(line).trim();
      if (!txt.startsWith("//")) {
        allCommented = false;
        break;
      }
    }

    // Build edits
    const edits = [];
    for (let line = startLine; line <= endLine; line++) {
      const lineNumber = line;
      const lineContent = model.getLineContent(lineNumber);

      if (allCommented) {
        // remove first occurrence of // with optional space
        const match = lineContent.match(/^(\s*)\/\/\s?(.*)$/);
        if (match) {
          const leading = match[1];
          const after = match[2] ?? "";
          const range = new monacoNS.Range(
            lineNumber,
            1,
            lineNumber,
            lineContent.length + 1
          );
          edits.push({
            range,
            text: leading + after,
            forceMoveMarkers: true,
          });
        }
      } else {
        // add // after leading whitespace
        const match = lineContent.match(/^(\s*)(.*)$/);
        const leading = match ? match[1] : "";
        const rest = match ? match[2] : lineContent;
        const range = new monacoNS.Range(
          lineNumber,
          1,
          lineNumber,
          lineContent.length + 1
        );
        edits.push({
          range,
          text: `${leading}//${rest}`,
          forceMoveMarkers: true,
        });
      }
    }

    if (edits.length > 0) {
      editor.pushUndoStop();
      editor.executeEdits("toggle-comment", edits);
      editor.pushUndoStop();

      // update React state from model after edits
      const newCode = model.getValue();
      setCode(newCode);
    }
  };

  // ---------- Run project (Piston) ----------
  const runProject = async () => {
    if (!data) {
      toast.error("Project metadata not loaded yet.");
      return;
    }

    // Build filename safely
    const ext =
      data.projLanguage === "python"
        ? ".py"
        : data.projLanguage === "java"
        ? ".java"
        : data.projLanguage === "javascript"
        ? ".js"
        : data.projLanguage === "c"
        ? ".c"
        : data.projLanguage === "cpp"
        ? ".cpp"
        : data.projLanguage === "bash"
        ? ".sh"
        : ".txt";

    const filename = (data.name ?? "Main") + ext;

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: data.projLanguage,
          version: data.version,
          files: [
            {
              filename,
              content: code,
            },
          ],
        }),
      });

      const json = await res.json();
      setOutput(json?.run?.output ?? JSON.stringify(json));
      setError(Boolean(json?.run?.code && json.run.code !== 0));
    } catch (err) {
      console.error("Run error:", err);
      toast.error("Failed to run code.");
    }
  };

  // ---------- small UI helpers ----------
  const themeOptions = [
    { value: "vs-dark", label: "VS Dark" },
    { value: "vs-light", label: "VS Light" },
    { value: "hc-black", label: "High Contrast" },
    { value: "dracula-custom", label: "Dracula" },
    { value: "monokai", label: "Monokai" },
    { value: "github-dark", label: "GitHub Dark" },
  ];

  // ---------- JSX (Glass + Gradient Hybrid) ----------
  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[calc(100vh-70px)] w-full"
        style={{
          // // gradient background
          // background:
          //   "linear-gradient(135deg, rgba(58,50,160,0.85) 0%, rgba(30,58,138,0.9) 45%, rgba(11,20,60,1) 100%)",

          // black theme subtle gradient background
              background: "linear-gradient(135deg, #1a1a1a 0%, #111111 50%, #0d0d0d 100%)"
        }}
      >
        {/* A centered content container with padding */}
        <div className="max-w-[1400px] mx-auto p-6">

          {/* Top toolbar (glass) */}
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
              <label className="text-sm text-white/80 mr-2 hidden md:inline">
                Theme
              </label>
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
                className="px-4 py-2 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md hover:brightness-105 transition"
                title="Run"
              >
                Run
              </button>
            </div>
          </div>

          {/* Main panels */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Editor (glass card) */}
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
                  language={data?.projLanguage || "javascript"}
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

            {/* Output panel (glass card) */}
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
                  <span className="text-xs text-white/50">{error ? "Error" : "Run result"}</span>
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
                <pre
                  className={`whitespace-pre-wrap text-sm font-mono ${
                    error ? "text-rose-300" : "text-green-200"
                  }`}
                >
                  {output ? output : "Run your code to see the result here..."}
                </pre>
              </div>

              {/* metadata */}
              <div className="mt-4 text-xs text-white/60">
                <div>
                  Project: <span className="text-white/90">{data?.name ?? "—"}</span>
                </div>
                <div>
                  Language: <span className="text-white/90">{data?.projLanguage ?? "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* small footer note */}
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


