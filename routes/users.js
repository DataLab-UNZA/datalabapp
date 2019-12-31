const express = require("express");
const router = express.Router();

const User = require("../models/User.model");


// Router for rendering registration form
router.get("/register", (req, res) => {
    //res.send("/registration form");
    res.render("users/register");
});

// Router for processing registration form
router.post("/register", (req, res) => {
    res.send("/registration processing");
});

// Router for rendering login form
router.get("/login", (req, res) => {
    //res.send("/login form");
    res.render("users/login");
});

// Router for processsing login form
router.get("/login", (req, res) => {
    res.send("/login processing");
});


module.exports = router;