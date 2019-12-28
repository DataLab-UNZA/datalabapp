const express = require("express");

const router = express.Router();
const Projects = require("../models/Project.model");

// Router to extract all projects in the database
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


// Router to extract projects with name or description matching search text
router.get("/search/project/:searchText", (req, res) => {
    const searchText = req.params.searchText;
    //res.send("/search/project/:searchText");
    Projects.find({$or: [
        {projectDescription: {$regex: '.*' + searchText + '*.'}}, 
        {projectName: {$regex: '.*' + searchText + '*.'}},
        {projectCode: {$regex: '.*' + searchText + '*.'}}
    ]}).exec((error, projects) => {
        if(error) {
            //
            console.log(`Error searching through projects.`);
            res.send(`Error searching through projects`);
        } else {
            //
            console.log(`Extracting projects with phrase: ${searchText}`);
            res.json(projects);
        }
    });
});

module.exports = router;