const express = require("express");

const router = express.Router();

const Intern = require("../models/Intern.model");

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

module.exports = router;