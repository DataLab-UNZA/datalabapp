const express = require("express");

const router = express.Router();

const Intern = require("../models/Intern.model");

// Router for extracting all records
router.get("/", (req, res) => {
    //res.send("/authors router");
    Intern.find({}).exec((error, interns) => {
        if(error) {
            //
            console.log(`Error extracting Interns from the database. Error: ${error}`);
            res.send(`Error extracting Interns from database.`);
        } else{
            //
            console.log(`Extracting Interns: ${interns}`);
            res.json(interns)
        }
    });
});

// Router for extracting a single record by studetID
router.get("/search/id/:studentID", (req, res) => {
    
    // res.send("/search/:studetnID");
    const searchKey = req.params.studentID;
    // Experiment with wild character: studentID: {$regex: '*' + searchKey + '*'}
    Intern.find({studentID: searchKey}).exec((error, student) => {
        if(error) {
            //
            console.log(`Error extracting student with ID: ${searchKey}`);
            res.send(`Error extracting student: ${searchKey}`);
        } else {
            //
            console.log(`Found student: ${searchKey}`);
            res.json(student);
        }
    });
});

// Router for extracting a single record by fullname
router.get("/search/name/:fullName", (req, res) => {
    //res.send("/search/name:fullName");
    const fullName = req.params.fullName;
    Intern.find({fullName: {$regex: '.*' + fullName + '.*'}}).exec((error, fullNames) => {
        if(error) {
            //
            console.log(`Error extracting name from database. Error: ${error}`);
            res.send(`Error extracting name from database.`);
        } else {
            //
            console.log(`Extracted records matching fullName: ${fullNames}`);
            res.json(fullNames);
        }
    });
});

module.exports = router;