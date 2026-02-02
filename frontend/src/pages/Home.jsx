// // /* eslint-disable no-unused-vars */
// // import React, { useState, useEffect} from "react";
// // import Navbar from "../components/Navbar";
// // import Select from "react-select";
// // import { api_base_url } from "../helper";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import { useUser, useAuth } from "@clerk/clerk-react"; // ✅ Clerk hooks
// // import cppImg from "../images/c++.jpeg";
// // import cImg from "../images/c.jpeg";
// // import jsImg from "../images/javascript.jpeg";
// // import javaImg from "../images/java.jpeg";
// // import pythonImg from "../images/python.jpeg";
// // import bashImg from "../images/bash.jpeg";
// // import Footer from "../components/Footer";

// // const Home = () => {
// //   const [isCreateModelShow, setIsCreateModelShow] = useState(false);
// //   const [languageOptions, setLanguageOptions] = useState([]);
// //   const [selectedLanguage, setSelectedLanguage] = useState(null); //state to store selected language

// //   const [projects, setProjects] = useState(null);
// //   const [name, setName] = useState("");
// //   const [isEditModelShow, setIsEditModelShow] = useState(false);
// //   const [editProjId, setEditProjId] = useState("");

// //   const navigate = useNavigate();

// //   const { user, isLoaded, isSignedIn} = useUser();// ✅ Get user info from Clerk
// //   const { getToken } = useAuth(); // ✅ Get token for API auth

  

// //   const customStyles = {
// //     control: (provided) => ({
// //       ...provided,
// //       backgroundColor: "#000",
// //       borderColor: "#555",
// //       color: "#fff",
// //       padding: "5px",
// //     }),
// //     menu: (provided) => ({
// //       ...provided,
// //       backgroundColor: "#000",
// //       color: "#fff",
// //       width: "100%",
// //     }),
// //     option: (provided, state) => ({
// //       ...provided,
// //       backgroundColor: state.isFocused ? "#333" : "#000",
// //       color: "#fff",
// //       cursor: "pointer",
// //     }),
// //     singleValue: (provided) => ({
// //       ...provided,
// //       color: "#fff",
// //     }),
// //     placeholder: (provided) => ({
// //       ...provided,
// //       color: "#aaa",
// //     }),
// //   };

// //   const getRunTimes = async () => {
// //     let res = await fetch("https://emkc.org/api/v2/piston/runtimes"); // it gives runtime info(name,version) of programming language
// //     let data = await res.json();

// //     //filter only the required language
// //     const filteredLanguages = [
// //       "python",
// //       "javascript",
// //       "c",
// //       "c++",
// //       "java",
// //       "bash",
// //     ];

// //     const options = data
// //       .filter((runtime) => filteredLanguages.includes(runtime.language.toLowerCase()))
// //       .map((runtime) => ({
// //         label: `${runtime.language} (${runtime.version})`,
// //         value: runtime.language.toLowerCase() === "c++" ? "cpp" : runtime.language.toLowerCase(),
// //         version: runtime.version,
// //       }));

// //       // remove duplicate languages (keep first/ latest)
// //       const uniqueOptions = options.filter(
// //       (opt, index, self) => index === self.findIndex((t) => t.value === opt.value)
// //     );


// //     setLanguageOptions(uniqueOptions);
// //   };

// //   const handleLanguageChange = (selectedOption) => {
// //     setSelectedLanguage(selectedOption); //update selected langauge state
// //     console.log("Selected language:", selectedOption);
// //   };

// //   //for getting the project
// //   const getProjects = async () => {
// //     try {
// //       const token = await getToken({ template: "default" });
// // console.log("clerk JWT Token:", token);

// //       const response = await fetch(api_base_url + "/getProjects", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         // body: JSON.stringify({
// //         //   token: localStorage.getItem("token"),
// //         // }),
// //       });

// //       if (!response.ok) {
// //       const text = await response.text();
// //       console.error("Server returned:", text);
// //       throw new Error("Bad response");
// //     }

// //       //convert response to json
// //       const data = await response.json();
// //       console.log("projects data: ", data);

// //       //check if API call was successful
// //       if (data.success) {
// //         setProjects(data.projects);
// //         localStorage.setItem("projects", JSON.stringify(data.projects));
// //       } else {
// //         toast.error(data.msg);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching projects:", error);
// //       // toast.error("Something went wrong while fetching projects!");
// //     }
// //   };

// //   useEffect(() => {
// //   const saved = localStorage.getItem("projects");
// //   if (saved) setProjects(JSON.parse(saved));
// // }, []);

// //   // useEffect(() => {
// //   //   getProjects();
// //   //   getRunTimes();
// //   // }, []);

// //   const createProj = async () => {
// //     if (!name || !selectedLanguage) {
// //       toast.error("Please enter project name and select language");
// //       return;
// //     }

// //     try {
// //       const token = await getToken({ template: "default" });
// //       // API call to create project
// //       const response = await fetch(api_base_url + "/createProj", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //            Authorization: `Bearer ${token}`, // ✅ Use Clerk token
// //         },
// //         body: JSON.stringify({
// //           name: name,
// //           projLanguage: selectedLanguage.value, // better to send value
// //           // token: localStorage.getItem("token"),
// //           version: selectedLanguage.version,
// //           createdBy: user?.id, 
// //         }),
// //       });

// //       const data = await response.json();
// //       console.log("Create Project Response:", data);

// //       if (data.success) {
// //         setName(""); //clear input
// //         setIsCreateModelShow(false);
// //         navigate("/editor/" + data.projectId); //go to editor
// //       } else {
// //         toast.error(data.msg); // show backend error
// //       }
// //     } catch (error) {
// //       console.error("Error creating project:", error);
// //       toast.error("Something went wrong!"); // show generic error
// //     }
// //   };

// //   //delete project
// //   const deleteProject = async (id) => {
// //     // 1) Ask user
// //     const conf = window.confirm(
// //       "Are you sure you want to delete this project?"
// //     );
// //     if (!conf) return; // user cancelled

// //     try {
// //       const token = await getToken({ template: "default" });
// //       // 2) Send request to server
// //       const response = await fetch(api_base_url + "/deleteProject", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" ,
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           projectId: id,
// //           // token: localStorage.getItem("token"),
// //         }),
// //       });

// //       // 3) Parse JSON
// //       const data = await response.json();

// //       // 4) Handle server response
// //       if (response.ok && data.success) {
// //         getProjects();
// //         toast.success(data.msg || "Project deleted");
// //       } else {
// //         toast.error(data.msg || "Could not delete project");
// //       }
// //     } catch (error) {
// //       console.error("Delete error:", error);
// //       toast.error("Something went wrong. Please try again.");
// //     }
// //   };



// //   const updateProj = async () => {
// //   // 1) Basic validation
// //   if (!editProjId) {
// //     toast.error("No project selected to update.");
// //     return;
// //   }
// //   if (!name || name.trim() === "") {
// //     toast.error("Project name cannot be empty.");
// //     return;
// //   }

// //   try {
// //     const token = await getToken({ template: "default" });
// //     const response = await fetch(api_base_url + "/editProject", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" ,
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         projectId: editProjId,
// //         // token: localStorage.getItem("token"),
// //         name: name.trim(),
// //       }),
// //     });

// //     // convert response to json
// //     const data = await response.json();

// //     if (response.ok && data.success) {
// //       // success -> close modal, clear states, refresh list
// //       setIsEditModelShow(false);
// //       setName("");
// //       setEditProjId("");
// //       toast.success(data.msg || "Project updated successfully.");
// //       await getProjects(); // refresh projects
// //     } else {
// //       // server returned an error (400/200-with-success:false)
// //       toast.error(data.msg || "Could not update project.");
// //       // keep modal open so user can fix and retry
// //     }
// //   } catch (error) {
// //     // network or unexpected error
// //     console.error("Update project failed:", error);
// //     toast.error("Something went wrong. Please try again.");
// //   } 
// // };

// // useEffect(() => {
// //   const init = async () => {
// //     if (!isLoaded) return; // wait until Clerk finishes loading
// //     if (!user) return; // no user yet

// //     await getProjects();
// //     await getRunTimes();
// //   };

// //   init();
// // }, [isLoaded, user]);



// //   return (
// //     <>
      
// //       <Navbar />
// //       <div className="flex items-center px-[100px] justify-between mt-5">
// //         <h3 className="text-2xl">👋 Hi {isLoaded && isSignedIn ? user.firstName || user.username : "Guest"}</h3>
// //         <div className="flex items-center">
// //           <button
// //             onClick={() => {
// //               setIsCreateModelShow(true);
// //             }}
// //             className="btnNormal bg-blue-500 transition-all hover:bg-blue-600"
// //           >
// //             Create Project
// //           </button>
// //         </div>
// //       </div>

// //       <div className="projects px-[100px] mt-5 pb-10">
// //         {projects && projects.length > 0
// //           ? projects.map((project, index) => {
// //               return (
// //                 <>
// //                   <div className="project w-full p-[15px] flex items-center justify-between bg-[#0f0e0e]">
// //                     <div
// //                       onClick={() => {
// //                         navigate("/editor/" + project._id);
// //                       }}
// //                       className="flex w-full items-center gap-[15px]"
// //                     >
// //                       {project.projLanguage === "python" ? (
// //                         <>
// //                           <img
// //                             className="w-[130px] h-[100px] object-contain"
// //                             src={pythonImg}
// //                             alt=""
// //                           />
// //                         </>
// //                       ) : project.projLanguage === "javascript" ? (
// //                         <>
// //                           <img
// //                             className="w-[130px] h-[100px] object-contain"
// //                             src={jsImg}
// //                             alt=""
// //                           />
// //                         </>
// //                       ) : project.projLanguage === "cpp" ? (
// //                         <>
// //                           <img
// //                             className="w-[130px] h-[100px] object-contain"
// //                             src={cppImg}
// //                             alt=""
// //                           />
// //                         </>
// //                       ) : project.projLanguage === "c" ? (
// //                         <>
// //                           <img
// //                             className="w-[130px] h-[100px] object-contain"
// //                             src={cImg}
// //                             alt=""
// //                           />
// //                         </>
// //                       ) : project.projLanguage === "java" ? (
// //                         <>
// //                           <img
// //                             className="w-[130px] h-[100px] object-contain"
// //                             src={javaImg}
// //                             alt=""
// //                           />
// //                         </>
// //                       ) : project.projLanguage === "bash" ? (
// //                         <>
// //                           <img
// //                             className="w-[130px] h-[100px] object-contain"
// //                             src={bashImg}
// //                             alt=""
// //                           />
// //                         </>
// //                       ) : (
// //                         ""
// //                       )}
// //                       <div>
// //                         <h3 className="text-xl">{project.name}</h3>
// //                         <p className="text-[14px] text-[gray]">{new Date(project.date).toDateString()}</p>
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center gap-[15px]">
// //                       <button className="btnNormal bg-blue-500 transition-all hover:bg-blue-600"
// //                         onClick = { () => {
// //                           setIsEditModelShow(true);
// //                           setEditProjId(project._id);
// //                           setName(project.name);
// //                         }}
// //                       >
// //                         Edit
// //                       </button>
// //                       <button
// //                         onClick={() => {
// //                           deleteProject(project._id);
// //                         }}
// //                         className="btnNormal bg-red-500 transition-all hover:bg-red-600"
// //                       >
// //                         Delete
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </>
// //               );
// //             })
// //           : "No Project Found!"}
// //       </div>

// //       {/* for create the project */}
// //       {isCreateModelShow && (
// //         <div
// //           onClick={(e) => {
// //             if (e.target.classList.contains("modelCon")) {
// //               setIsCreateModelShow(false);
// //               setName("");
// //             }
// //           }}
// //           className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
// //         >
// //           <div className="modelBox flex flex-col items-start rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0F0E0E]">
// //             <h3 className="text-xl font-bold text-center">Create Project</h3>
// //             <div className="inputBox">
// //               <input
// //                 onChange={(e) => {
// //                   setName(e.target.value);
// //                 }}
// //                 value={name}
// //                 type="text"
// //                 placeholder="Enter your project name"
// //                 className="text-black"
// //               />
// //             </div>
// //             <Select
// //               placeholder="Select a Language"
// //               styles={customStyles}
// //               options={languageOptions}
// //               onChange={handleLanguageChange} // handle language selections
// //             />
// //             {selectedLanguage && (
// //               <>
// //                 <p className="text-[14px] text-green-500 mt-2">
// //                   Selected Language: {selectedLanguage.label}
// //                 </p>
// //                 <button
// //                   onClick={createProj}
// //                   className="btnNormal ng-blue-500 transition-all hover:bg-blue-600 mt-2"
// //                 >
// //                   Create
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {isEditModelShow && (
// //         <div
// //           onClick={(e) => {
// //             if (e.target.classList.contains("modelCon")) {
// //               setIsEditModelShow(false);
// //               setName("");
// //             }
// //           }}
// //           className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
// //         >
// //           <div className="modelBox flex flex-col items-start rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0F0E0E]">
// //             <h3 className="text-xl font-bold text-center">Update Project</h3>
// //             <div className="inputBox">
// //               <input
// //                 onChange={(e) => {
// //                   setName(e.target.value);
// //                 }}
// //                 value={name}
// //                 type="text"
// //                 placeholder="Enter your project name"
// //                 className="text-black"
// //               />
// //             </div>
// //                 <button
// //                   onClick={updateProj}
// //                   className="btnNormal ng-blue-500 transition-all hover:bg-blue-600 mt-2"
// //                 >
// //                   Update
// //                 </button>
// //           </div>
// //         </div>
// //       )}

// //       <Footer />
// //     </>
// //   );
// // };

// // export default Home;


// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Select from "react-select";
// import { api_base_url } from "../helper";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useUser, useAuth } from "@clerk/clerk-react";

// import cppImg from "../images/c++.jpeg";
// import cImg from "../images/c.jpeg";
// import jsImg from "../images/javascript.jpeg";
// import javaImg from "../images/java.jpeg";
// import pythonImg from "../images/python.jpeg";
// import bashImg from "../images/bash.jpeg";
// import Footer from "../components/Footer";

// const Home = () => {
//   const [isCreateModelShow, setIsCreateModelShow] = useState(false);
//   const [languageOptions, setLanguageOptions] = useState([]);
//   const [selectedLanguage, setSelectedLanguage] = useState(null);
//   const [projects, setProjects] = useState(null);

//   const [name, setName] = useState("");
//   const [isEditModelShow, setIsEditModelShow] = useState(false);
//   const [editProjId, setEditProjId] = useState("");

//   const navigate = useNavigate();
//   const { user, isLoaded, isSignedIn } = useUser();
//   const { getToken } = useAuth();

//   /* ------------------- Select Styles ------------------- */
//   const customStyles = {
//     control: (p) => ({
//       ...p,
//       backgroundColor: "#000",
//       borderColor: "#555",
//       color: "#fff",
//       padding: "5px",
//     }),
//     menu: (p) => ({ ...p, backgroundColor: "#000", color: "#fff" }),
//     option: (p, s) => ({
//       ...p,
//       backgroundColor: s.isFocused ? "#333" : "#000",
//       color: "#fff",
//     }),
//     singleValue: (p) => ({ ...p, color: "#fff" }),
//     placeholder: (p) => ({ ...p, color: "#aaa" }),
//   };

//   /* ------------------- Runtime Fetch ------------------- */
//   const getRunTimes = async () => {
//     const res = await fetch("https://emkc.org/api/v2/piston/runtimes");
//     const data = await res.json();

//     const filtered = ["python", "javascript", "c", "c++", "java", "bash"];

//     const options = data
//       .filter((r) => filtered.includes(r.language.toLowerCase()))
//       .map((r) => ({
//         label: `${r.language} (${r.version})`,
//         value: r.language.toLowerCase() === "c++" ? "cpp" : r.language.toLowerCase(),
//         version: r.version,
//       }));

//     const unique = options.filter(
//       (o, i, self) => i === self.findIndex((t) => t.value === o.value)
//     );

//     setLanguageOptions(unique);
//   };

//   /* ------------------- Projects ------------------- */
//   const getProjects = async () => {
//     try {
//       const token = await getToken({ template: "default" });

//       const response = await fetch(api_base_url + "/getProjects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (data.success) {
//         setProjects(data.projects);
//         localStorage.setItem("projects", JSON.stringify(data.projects));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* ------------------- Create ------------------- */
//   const createProj = async () => {
//     if (!name || !selectedLanguage)
//       return toast.error("Enter name & language");

//     const token = await getToken({ template: "default" });

//     const res = await fetch(api_base_url + "/createProj", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         name,
//         projLanguage: selectedLanguage.value,
//         version: selectedLanguage.version,
//         createdBy: user?.id,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) navigate("/editor/" + data.projectId);
//   };

//   /* ------------------- Delete ------------------- */
//   const deleteProject = async (id) => {
//     if (!window.confirm("Delete this project?")) return;

//     const token = await getToken({ template: "default" });

//     await fetch(api_base_url + "/deleteProject", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ projectId: id }),
//     });

//     getProjects();
//   };

//   /* ------------------- Update ------------------- */
//   const updateProj = async () => {
//     const token = await getToken({ template: "default" });

//     await fetch(api_base_url + "/editProject", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ projectId: editProjId, name }),
//     });

//     setIsEditModelShow(false);
//     getProjects();
//   };

//   /* ------------------- Init ------------------- */
//   useEffect(() => {
//     if (!isLoaded || !user) return;
//     getProjects();
//     getRunTimes();
//   }, [isLoaded, user]);

//   const getImage = (lang) => {
//     switch (lang) {
//       case "python":
//         return pythonImg;
//       case "javascript":
//         return jsImg;
//       case "cpp":
//         return cppImg;
//       case "c":
//         return cImg;
//       case "java":
//         return javaImg;
//       case "bash":
//         return bashImg;
//       default:
//         return "";
//     }
//   };

//   /* ================================================= */
//   return (
//     <>
//       <Navbar />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 md:px-12 lg:px-20 mt-6 gap-4">
//         <h3 className="text-xl sm:text-2xl font-semibold">
//           👋 Hi {isSignedIn ? user?.firstName || user?.username : "Guest"}
//         </h3>

//         <button
//           onClick={() => setIsCreateModelShow(true)}
//           className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm"
//         >
//           Create Project
//         </button>
//       </div>

//       {/* Projects Grid */}
//       <div className="px-5 md:px-12 lg:px-20 mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pb-16">
//         {projects?.length ? (
//           projects.map((project) => (
//             <div
//               key={project._id}
//               className="bg-[#111] rounded-xl p-4 flex flex-col gap-3 hover:bg-[#171717] transition"
//             >
//               <div
//                 onClick={() => navigate("/editor/" + project._id)}
//                 className="flex gap-3 items-center cursor-pointer"
//               >
//                 <img
//                   src={getImage(project.projLanguage)}
//                   className="w-14 h-14 object-contain"
//                 />

//                 <div>
//                   <h4 className="font-semibold">{project.name}</h4>
//                   <p className="text-xs text-gray-400">
//                     {new Date(project.date).toDateString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => {
//                     setEditProjId(project._id);
//                     setName(project.name);
//                     setIsEditModelShow(true);
//                   }}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 rounded py-1"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => deleteProject(project._id)}
//                   className="flex-1 bg-red-600 hover:bg-red-700 rounded py-1"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No Projects Found</p>
//         )}
//       </div>

//       {/* ---------- Modal ---------- */}
//       {(isCreateModelShow || isEditModelShow) && (
//         <div
//           onClick={(e) =>
//             e.target.classList.contains("modelCon") &&
//             (setIsCreateModelShow(false), setIsEditModelShow(false))
//           }
//           className="modelCon fixed inset-0  flex justify-center items-center px-4"
//         >
//           <div className="bg-[#0F0E0E] w-full max-w-md rounded-xl p-6 space-y-4">
//             <h3 className="text-lg font-semibold">
//               {isCreateModelShow ? "Create Project" : "Update Project"}
//             </h3>

//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Project name"
//               className="w-full p-2 rounded text-white"
//             />

//             {isCreateModelShow && (
//               <Select
//                 styles={customStyles}
//                 options={languageOptions}
//                 onChange={setSelectedLanguage}
//               />
//             )}

//             <button
//               onClick={isCreateModelShow ? createProj : updateProj}
//               className="w-full bg-blue-600 hover:bg-blue-700 rounded py-2"
//             >
//               {isCreateModelShow ? "Create" : "Update"}
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Home;


/* eslint-disable no-unused-vars */
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

  /* ---------------- LANGUAGE FETCH ---------------- */
  const getRunTimes = async () => {
    const res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    const data = await res.json();

    const filtered = ["python", "javascript", "c", "c++", "java", "bash"];

    const options = data
      .filter((r) => filtered.includes(r.language.toLowerCase()))
      .map((r) => ({
        label: `${r.language} (${r.version})`,
        value: r.language.toLowerCase() === "c++" ? "cpp" : r.language.toLowerCase(),
        version: r.version,
      }));

    setLanguageOptions(options);
  };

  /* ---------------- PROJECT FETCH ---------------- */
  const getProjects = async () => {
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
  };

  /* ---------------- CREATE ---------------- */
  const createProj = async () => {
    if (!name || !selectedLanguage) return toast.error("Enter details");

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
  };

  /* ---------------- DELETE ---------------- */
  const deleteProject = async (id) => {
    // if (!window.confirm("Delete project?")) return;

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
  };

  /* ---------------- UPDATE ---------------- */
  const updateProj = async () => {
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
          onClick={() => setIsCreateModelShow(true)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl shadow-md transition"
        >
          + New Project
        </button>
      </div>

      {/* PROJECT GRID */}
      <div className="px-5 md:px-14 lg:px-24 mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-2 pb-20">
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
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setDeleteId(project._id),
                  setShowDeleteModal(true)
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {(isCreateModelShow || isEditModelShow) && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center px-4"
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
              className="w-full p-3 rounded-lg bg-black border border-[#333]"
            />

            {isCreateModelShow && (
              <Select
                styles={customStyles}
                options={languageOptions}
                onChange={setSelectedLanguage}
              />
            )}

            <button
              onClick={isCreateModelShow ? createProj : updateProj}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              {isCreateModelShow ? "Create Project" : "Update Project"}
            </button>
          </div>
        </div>
      )}

     {/* ================= DELETE CONFIRM MODAL ================= */}
{showDeleteModal && (
  <div
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    onClick={(e) =>
      e.target === e.currentTarget && setShowDeleteModal(false)
    }
  >
    <div
      className="
        bg-[#121212]
        border border-[#222]
        rounded-2xl
        p-7
        w-full
        max-w-sm
        text-center
        shadow-2xl
        animate-[fadeIn_.2s_ease]
      "
    >
      {/* Icon */}
      <div className="text-4xl mb-3">⚠️</div>

      <h3 className="text-lg font-semibold mb-2">
        Delete Project?
      </h3>

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

