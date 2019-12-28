const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("/projects Router");
});

module.exports = router;