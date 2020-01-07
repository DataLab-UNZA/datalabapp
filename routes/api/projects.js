const express = require("express");

const router = express.Router();
const Project = require("../../models/Project.model");
const Person = require("../../models/Person.model");

// API router to extract all projects in the database
router.get("/", (req, res) => {
  //res.send("/projects Router");
  Project.find({}).exec((error, projects) => {
    if (error) {
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

// API router to extract a project by Project Code
router.get("/id/:projectID", (req, res) => {
  //
  const projectID = req.params.projectID;

  Project.find({ projectCode: projectID }).exec((error, project) => {
    if (error) {
      //
      console.log(`Error extracting Project. Error: ${error}`);
      res.json({ message: "Error extracting project." });
    } else {
      //
      console.log(`Extracting Project: ${project}`);
      res.json(project);
    }
  });
});

// API router to extract projects with name or description matching search text
router.get("/name/:searchText", (req, res) => {
  const searchText = req.params.searchText;
  //res.send("/search/project/:searchText");
  Project.find({
    $or: [
      { projectDescription: { $regex: ".*" + searchText + "*." } },
      { projectName: { $regex: ".*" + searchText + "*." } },
      { projectCode: { $regex: ".*" + searchText + "*." } }
    ]
  }).exec((error, projects) => {
    if (error) {
      //
      console.log(`Error searching through projects.`);
      res.json({ message: "Error searching" });
    } else {
      //
      console.log(`Extracting projects with phrase: ${searchText}`);
      res.json(projects);
    }
  });
});

// API router for adding a single project
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
    if (error) {
      //
      console.log(`Error creating new project. Error: ${error}`);
      res.json({ message: "Error creating new project" });
    } else {
      //
      console.log(`Creating new project: ${project}`);
      res.json(project);
    }
  });
});

// API router for editing an existing Project
router.put("/:projectID", (req, res) => {
  const projectID = req.params.projectID;

  Project.findOneAndReplace(
    { projectCode: projectID },
    {
      projectCode: req.body.projectCode ? req.body.projectCode : projectID,
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
      if (error) {
        //
        console.log(`Error updating project. Error: ${error}`);
        res.json({ message: "Error updating project" });
      } else {
        //
        console.log(`Update project: ${project}`);
        res.json(project);
      }
    }
  );
});

// API router for deleting an existing project
router.delete("/:projectID", (req, res) => {
  const projectID = req.params.projectID;

  Project.findOneAndDelete({ projectCode: projectID }, (error, project) => {
    if (error) {
      //
      console.log(`Error deleting project. Error: ${error}`);
      res.json({ message: "Error deleting project" });
    } else {
      //
      console.log(`Deleted project: ${project}`);
      res.send(project);
    }
  });
});

module.exports = router;
