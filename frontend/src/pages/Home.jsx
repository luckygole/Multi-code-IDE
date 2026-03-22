// /* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser, useAuth } from "@clerk/clerk-react";

import cppImg from "../images/c++.jpeg";
import cImg from "../images/c.jpeg";
import jsImg from "../images/javascript.jpeg";
import javaImg from "../images/java.jpeg";
import pythonImg from "../images/python.jpeg";
import bashImg from "../images/bash.jpeg";
import Footer from "../components/Footer";

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [isEditModelShow, setIsEditModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [editProjId, setEditProjId] = useState("");

  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  /* ---------------- SELECT STYLE ---------------- */
  const customStyles = {
    control: (p) => ({
      ...p,
      backgroundColor: "#0f0f0f",
      borderColor: "#222",
      color: "#fff",
      borderRadius: "10px",
      padding: "4px",
    }),
    menu: (p) => ({ ...p, backgroundColor: "#0f0f0f" }),
    option: (p, s) => ({
      ...p,
      backgroundColor: s.isFocused ? "#1e1e1e" : "#0f0f0f",
      color: "#fff",
    }),
    singleValue: (p) => ({ ...p, color: "#fff" }),
  };

  /* ---------------- LANGUAGE LIST (Glot.io) ---------------- */
  const getRunTimes = () => {
    const options = [
      { label: "Python (3.12.0)",        value: "python",     version: "3.12.0"  },
      { label: "JavaScript (Node 20.8.0)", value: "javascript", version: "20.8.0" },
      { label: "C (GCC 12.2.0)",          value: "c",          version: "12.2.0"  },
      { label: "C++ (GCC 12.2.0)",        value: "cpp",        version: "12.2.0"  },
      { label: "Java (OpenJDK 21)",        value: "java",       version: "21"      },
      { label: "Bash (5.2.15)",            value: "bash",       version: "5.2.15"  },
    ];
    setLanguageOptions(options);
  };

  /* ---------------- PROJECT FETCH ---------------- */
  const getProjects = async () => {
    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(api_base_url + "/getProjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects.");
    }
  };

  /* ---------------- CREATE ---------------- */
  const createProj = async () => {
    if (!name || !selectedLanguage) return toast.error("Enter details");

    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(api_base_url + "/createProj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          projLanguage: selectedLanguage.value,
          version: selectedLanguage.version,
          createdBy: user?.id,
        }),
      });

      const data = await res.json();
      if (data.success) navigate("/editor/" + data.projectId);
      else toast.error(data.msg || "Failed to create project.");
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error("Something went wrong.");
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteProject = async (id) => {
    try {
      const token = await getToken({ template: "default" });

      await fetch(api_base_url + "/deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId: id }),
      });

      getProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project.");
    }
  };

  /* ---------------- UPDATE ---------------- */
  const updateProj = async () => {
    try {
      const token = await getToken({ template: "default" });

      await fetch(api_base_url + "/editProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId: editProjId, name }),
      });

      setIsEditModelShow(false);
      getProjects();
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error("Failed to update project.");
    }
  };

  useEffect(() => {
    if (!isLoaded || !user) return;
    getProjects();
    getRunTimes();
  }, [isLoaded, user]);

  /* ---------------- IMAGE HELPER ---------------- */
  const getImage = (lang) => {
    const map = {
      python: pythonImg,
      javascript: jsImg,
      cpp: cppImg,
      c: cImg,
      java: javaImg,
      bash: bashImg,
    };
    return map[lang];
  };

  /* =================================================== */
  return (
    <>
      <Navbar />

      {/* HEADER */}
      <div className="px-5 md:px-14 lg:px-24 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-wide">
          👋 Hi {isSignedIn ? user?.firstName : "Guest"}
        </h2>

        <button
          onClick={() => {
            setName("");
            setSelectedLanguage(null);
            setIsCreateModelShow(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl shadow-md transition"
        >
          + New Project
        </button>
      </div>

      {/* PROJECT GRID */}
      <div className="px-5 md:px-14 lg:px-24 mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-2 pb-20">
        {projects?.length === 0 && (
          <p className="text-gray-500 text-sm col-span-2 text-center mt-10">
            No projects yet. Create your first one!
          </p>
        )}

        {projects?.map((project) => (
          <div
            key={project._id}
            className="
              bg-[#121212]
              border border-[#222]
              rounded-2xl
              p-6
              flex
              justify-between
              items-center
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            {/* LEFT */}
            <div
              onClick={() => navigate("/editor/" + project._id)}
              className="flex items-center gap-5 cursor-pointer flex-1"
            >
              <img
                src={getImage(project.projLanguage)}
                alt={project.projLanguage}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(project.date).toDateString()}
                </p>
              </div>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditProjId(project._id);
                  setName(project.name);
                  setIsEditModelShow(true);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setDeleteId(project._id);
                  setShowDeleteModal(true);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreateModelShow || isEditModelShow) && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center px-4 z-50"
          onClick={(e) =>
            e.target === e.currentTarget &&
            (setIsCreateModelShow(false), setIsEditModelShow(false))
          }
        >
          <div className="bg-[#121212] rounded-2xl w-full max-w-md p-7 space-y-5 shadow-xl">
            <h3 className="text-xl font-semibold">
              {isCreateModelShow ? "Create Project" : "Update Project"}
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full p-3 rounded-lg bg-black border border-[#333] text-white outline-none focus:border-blue-500 transition"
            />

            {isCreateModelShow && (
              <Select
                styles={customStyles}
                options={languageOptions}
                onChange={setSelectedLanguage}
                placeholder="Select language..."
              />
            )}

            <button
              onClick={isCreateModelShow ? createProj : updateProj}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              {isCreateModelShow ? "Create Project" : "Update Project"}
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDeleteModal(false)
          }
        >
          <div className="bg-[#121212] border border-[#222] rounded-2xl p-7 w-full max-w-sm text-center shadow-2xl">
            <div className="text-4xl mb-3">⚠️</div>

            <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>

            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-lg bg-[#222] hover:bg-[#333] transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteProject(deleteId);
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Home;
