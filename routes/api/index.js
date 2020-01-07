const express = require("express");

const router = express.Router();

// API router to render index page with API endpoints documentation
router.get("/", (req, res) => {
  res.render("api/index");
});

module.exports = router;
