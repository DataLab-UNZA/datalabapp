const express = require("express");

const router = express.Router();
const Project = require("../models/Project.model");
const Person = require("../models/Person.model");

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
            //res.json(projects);
            res.render("projects/index", {projects: projects});
        }
    });
});


// Router to extract a project by Project Code
router.get("/search/project/:projectID", (req, res) => {
    //
    const projectID = req.params.projectID;

    Project.find({projectCode: projectID}).exec((error, project) => {
        if(error) {
            //
            console.log(`Error extracting Project. Error: ${error}`);
            res.render("projects/index");
        } else {
            // 
            console.log(`Extracting Project: ${project}`);
            res.render("projects/project", {project: project[0]});
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
            //res.json(projects); // ONLY used for testing API calls
            res.render("projects/index", {projects: projects});
        }
    });
});


// Router for rendering form for adding new project
router.get("/add", (req, res) => {
    
    Person.find({}).exec((error, intern) =>{
        if(error) {
            //
            console.log(`Error extracting interns. Error: ${error}`);
            res.redirect("/interns");
        } else {
            //
            console.log(`Extracting interns: ${intern}`);
            res.render("projects/add", {project: new Project(), interns: intern});
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
    /*req.body.responsibility.forEach((responsible) => {
        newProject.responsibility.push({"fullName": responsible});
    });*/
    newProject.responsibility = req.body.responsibility;
    
    newProject.save((error, project) => {
        if(error) {
            //
            console.log(`Error creating new project. Error: ${error}`);
            res.send(`Error creating new project.`);
        } else {
            //
            console.log(`Creating new project: ${project}`);
            //res.json(project); // ONLY used for testing API calls
            res.redirect("/projects");
        }
    });


});


// Router for rendering form to edit existing project
// Router for rendering form for editing intern
router.get("/edit/:projectID", (req, res) => {
    //
    const projectID = req.params.projectID;

    Project.find({projectCode: projectID}).exec((error, project) => {
        if(error) {
            //
            console.log(`Error extracting project. Error: ${error}`);
            res.send(`Error extracting project.`);
        } else {
            //
            // Nested query to extract all interns
            Person.find({}).exec((error, intern) =>{
                if(error) {
                    //
                    console.log(`Error extracting interns. Error: ${error}`);
                    res.redirect("/interns");
                } else {
                    //
                    console.log(`Extracting interns: ${intern}`);
                    console.log(`Extracting project: ${project}`);
                    res.render("projects/edit", {project: project[0], interns: intern}); // find seems to return an array: this causes issues with add and edit
                }
            });
        }
    });
});


// Router for editing an existing Project
router.put("/edit/:projectID", (req, res) => {
    const projectID = req.params.projectID;

    Project.findOneAndReplace(
        {projectCode: projectID},
        {
            projectCode: req.body.projectCode ? req.body.projectCode: projectID,
            projectName: req.body.projectName,
            projectDescription: req.body.projectDescription,
            responsibility: req.body.responsibility
        },
        {
            new: true,
            upsert: false,
            useFindAndModify: false
        },
        (error, project) => {
            if(error) {
                //
                console.log(`Error updating project. Error: ${error}`);
            } else {
                //
                console.log(`Update project: ${project}`);
                //res.json(project); // ONLY used for testing API calls
                res.redirect("/projects");
            }
        });
});


// Router for deleting an existing project
router.delete("/delete/:projectID", (req, res) => {
    const projectID = req.params.projectID;

    Project.findOneAndDelete(
        {projectCode: projectID},
        (error, project) => {
            if (error) {
                //
                console.log(`Error deleting project. Error: ${error}`);
                res.send(`Error deleting project.`);
            } else {
                //
                console.log(`Deleted project: ${project}`);
                //res.send(`Deleted project: ${project}`);
                res.redirect("/projects");
            }
        });
});

module.exports = router;