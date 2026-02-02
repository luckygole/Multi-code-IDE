var express = require('express');
var router = express.Router();

// const { requireAuth } = require('@clerk/express');
const { createProj, saveProject, getProjects, getProject, deleteProject, editProject } = require('../controllers/projectController');

const { clerkClient, verifyToken } = require("@clerk/backend");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    console.log("✅ Verified token payload:", decoded);

    req.userId = decoded.sub; // <-- yahan error aata hai agar 'decoded' undefined ho
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ message: err.message });
  }
};


// ✅ Protected routes
router.post('/createProj', requireAuth, createProj);
router.post('/saveProject', requireAuth, saveProject);
router.post('/getProjects', requireAuth, getProjects);
router.post('/getProject', requireAuth, getProject);
router.post('/deleteProject', requireAuth, deleteProject);
router.post('/editProject', requireAuth, editProject);

// 🟢 Test route
router.get('/', (req, res) => {
  res.json({message:'Backend working fine!'});
});

module.exports = router;
