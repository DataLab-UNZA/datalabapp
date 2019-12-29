const express = require("express");

const router = express.Router();
const Project = require("../models/Project.model");

// Router to extract all projects in the database
router.get("/", (req, res) => {
    //res.send("/projects Router");
    Project.find({}).exec((error, projects) => {
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
    Project.find({$or: [
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


// Router for adding a single project
router.post("/add", (req, res) => {
    const newProject = new Project();

    newProject.projectCode = req.body.projectCode;
    newProject.projectName = req.body.projectName;
    newProject.projectDescription = req.body.projectDescription;
    // Push all individuals that are part of the project
    req.body.responsibility.forEach((responsible) => {
        newProject.responsibility.push({"fullName": responsible});
    });
    
    newProject.save((error, project) => {
        if(error) {
            //
            console.log(`Error creating new project. Error: ${error}`);
            res.send(`Error creating new project.`);
        } else {
            //
            console.log(`Creating new project: ${project}`);
            res.json(project);
        }
    });


});


module.exports = router;