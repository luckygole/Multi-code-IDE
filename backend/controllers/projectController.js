const projectModel = require("../models/projectModel");
const { requireAuth } = require("@clerk/express");

// 🧠 Helper: Get starter code for each language
 function getStartupCode(language) {
  if (language.toLowerCase() === "python") {
    return 'print("Hello World")';
  } else if (language.toLowerCase() === "java") {
    return 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }';
  } else if (language.toLowerCase() === "javascript") {
    return 'console.log("Hello World");';
  } else if (language.toLowerCase() === "cpp") {
    return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
  } else if (language.toLowerCase() === "c") {
    return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
  } else if (language.toLowerCase() === "go") {
    return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
  } else if (language.toLowerCase() === "bash") {
    return 'echo "Hello World"';
  } else {
    return 'Language not supported';
  }
}
// function getStartupCode(language = "") {
//   const lang = language.toLowerCase();
//   const codes = {
//     python: 'print("Hello World")',
//     java: 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }',
//     javascript: 'console.log("Hello World");',
//     cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}',
//     c: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}',
//     go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}',
//     bash: 'echo "Hello World"',
//   };
//   return codes[lang] || 'Language not supported';
// }

// ✅ Create a new project
exports.createProj = 
  async (req, res) => {
    try {
      const { name, projLanguage, version } = req.body;
      const userId = req.auth.userId;

      if (!name || !projLanguage) {
        return res.status(400).json({ success: false, msg: "Missing required fields" });
      }

      const project = await projectModel.create({
        name,
        projLanguage,
        createdBy: userId,
        code: getStartupCode(projLanguage),
        version,
      });

      res.status(201).json({
        success: true,
        msg: "Project created successfully",
        projectId: project._id,
      });
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message });
    }
  };

// ✅ Save / update project code
exports.saveProject = 
  async (req, res) => {
    try {
      const { userId } = req.auth(); // ✅ correct new syntax

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized user" });
    }
      const { projectId, code } = req.body;
      

      if (!projectId || code == null) {
        return res.status(400).json({ success: false, msg: "Project ID or code missing" });
      }

      const project = await projectModel.findOneAndUpdate(
        { _id: projectId, createdBy: userId },
        { $set: { code } },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ success: false, msg: "Project not found" });
      }

      res.status(200).json({ success: true, msg: "Project saved successfully", project });
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message });
    }
  },


// ✅ Get all projects of a logged-in user
exports.getProjects = 
  async (req, res) => {
    try {
      const { userId } = req.auth(); // ✅ correct new syntax

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized user" });
    }
      const projects = await projectModel.find({ createdBy: userId }).sort({ createdAt: -1 });
      console.log("Fetched for user:", req.auth.userId);

      res.status(200).json({
        success: true,
        projects,
        msg: "Projects fetched successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message });
    }
  };

// ✅ Get a specific project by ID
exports.getProject =
  async (req, res) => {
        try {
          const { userId } = req.auth(); // ✅ correct new syntax

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized user" });
    }
      const { projectId } = req.body;
      

      if (!projectId) {
        return res.status(400).json({ success: false, msg: "Project ID required" });
      }

      const project = await projectModel.findOne({ _id: projectId});

      if (!project) {
        return res.status(404).json({ success: false, msg: "Project not found" });
      }

      res.status(200).json({ success: true, project, msg: "Project fetched successfully" });
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message });
    }
  };

// ✅ Delete a project
exports.deleteProject =
  async (req, res) => {
    try {
      const { userId } = req.auth(); // ✅ correct new syntax

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized user" });
    }
      const { projectId } = req.body;
      

      if (!projectId) {
        return res.status(400).json({ success: false, msg: "Project ID required" });
      }

      const project = await projectModel.findOneAndDelete({ _id: projectId, createdBy: userId });

      if (!project) {
        return res.status(404).json({ success: false, msg: "Project not found" });
      }

      res.status(200).json({ success: true, msg: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message });
    }
  };

// ✅ Edit project name
exports.editProject =
  async (req, res) => {
    try {
      const { userId } = req.auth(); // ✅ correct new syntax

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized user" });
    }
      const { projectId, name } = req.body;
      
      if (!projectId || !name) {
        return res.status(400).json({ success: false, msg: "Project ID or name missing" });
      }

      const project = await projectModel.findOne({ _id: projectId, createdBy: userId });
      if (!project) {
        return res.status(404).json({ success: false, msg: "Project not found" });
      }

      project.name = name;
      await project.save();

      res.status(200).json({ success: true, msg: "Project name updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message });
    }
  };