

var express = require('express');
var router = express.Router();

const { requireAuth } = require('@clerk/express');
const { createProj, saveProject, getProjects, getProject, deleteProject, editProject , runCode} = require('../controllers/projectController');

// ✅ Protected routes
router.post('/createProj', requireAuth(), createProj);
router.post('/saveProject', requireAuth(), saveProject);
router.post('/getProjects', requireAuth(), getProjects);
router.post('/getProject', requireAuth(), getProject);
router.post('/deleteProject', requireAuth(), deleteProject);
router.post('/editProject', requireAuth(), editProject);
router.post('/runCode', requireAuth(), runCode);

// 🟢 Test route
router.get('/', (req, res) => {
  res.json({ message: 'Backend working fine!' });
});

module.exports = router;