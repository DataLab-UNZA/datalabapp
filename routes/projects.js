const express = require("express");

const router = express.Router();
const Projects = require("../models/Project.model");


router.get("/", (req, res) => {
    //res.send("/projects Router");
    Projects.find({}).exec((error, projects) => {
        if(error) {
            // Check for errors
            console.log(`Error extracting projects from database. Error: ${error}`);
            res.send(`Error extracting projects from database.`);
        } else {
            // Render projects
            console.log(`Extracting projects: ${projects}`);
            res.json(projects);
        }
    });
});

module.exports = router;