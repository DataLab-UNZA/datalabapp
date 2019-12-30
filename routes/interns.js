const express = require("express");

const router = express.Router();

const Intern = require("../models/Intern.model");

// Method override
const methodOverride = require("method-override"); // TODO: READ UP 
router.use(methodOverride("_method")); // TODO: READ UP on method overriding

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
            //res.json(interns) // ONLY for testing API calls
            res.render("interns/index", {interns: interns});
        }
    });
});

// Router for extracting a single record by studetID
router.get("/search/id/:studentID", (req, res) => {
    
    // res.send("/search/:studetnID");
    const searchKey = req.params.studentID;
    // Experiment with wild character: studentID: {$regex: '*' + searchKey + '*'}
    Intern.find({studentID: searchKey}).exec((error, intern) => {
        if(error) {
            //
            console.log(`Error extracting student with ID: ${searchKey}`);
            res.send(`Error extracting student: ${searchKey}`);
        } else {
            //
            console.log(`Found student: ${searchKey}`);
            //res.json(student); // ONLY used for testing API calls
            res.render("interns/intern", {intern: intern[0]}); // render a single intern
        }
    });
});

// Router for extracting a single record by fullname
router.get("/search/name/:fullName", (req, res) => {
    //res.send("/search/name:fullName");
    const fullName = req.params.fullName;
    Intern.find({fullName: {$regex: '.*' + fullName + '.*'}}).exec((error, interns) => {
        if(error) {
            //
            console.log(`Error extracting name from database. Error: ${error}`);
            res.send(`Error extracting name from database.`);
        } else {
            //
            console.log(`Extracted records matching fullName: ${interns}`);
            //res.json(interns); // ONLY used for testing API calls
            res.render("interns/intern", {intern: interns});
        }
    });
});


// Router for rendering new intern form
router.get("/add", (req, res) => {
    res.render("interns/add", {intern: new Intern()}); // render the form
});

// Router for adding a new intern
router.post("/add", (req, res) => {
    //
    const newIntern = new Intern();
    newIntern.fullName = req.body.fullName ? req.body.fullName: "";
    newIntern.studentID = req.body.studentID ? req.body.studentID: "";
    newIntern.emailAddress.push(req.body.emailAddress ? req.body.emailAddress: "");
    newIntern.phoneNumber.push(req.body.phoneNumber ? req.body.phoneNumber: "");
    newIntern.residentialAddress = req.body.residentialAddress ? req.body.residentialAddress: "";
    // 
    newIntern.save((error, intern) => {
        if(error) {
            //
            console.log(`Error creating new intern. Error: ${error}.`);
            res.send(`Error creating new intern.`);
        } else {
            //
            console.log(`Creating new intern: ${newIntern}`);
            //res.json(newIntern);
            res.redirect("/interns"); // redirect to interns list after successfully adding a new intern
        }
    });
});


// Router for rendering form for editing intern
router.get("/edit/:studentID", (req, res) => {
    //
    const internID = req.params.studentID;
    Intern.find({studentID: internID}).exec((error, intern) => {
        if(error) {
            //
            console.log(`Error extracting intern. Error: ${error}`);
            res.send(`Error extracting intern.`);
        } else {
            //
            console.log(`Extracting intern: ${intern}`);
            res.render("interns/edit", {intern: intern[0]}); // find seems to return an array: this causes issues with add and edit
        }
    });
});

// Router for editing  an existing user
router.put("/edit/:studentID", (req, res) => {
    //
    const internID = req.params.studentID;

    Intern.findOneAndReplace(
        {studentID: internID},
        {
            studentID: req.body.studentID ? req.body.studentID: internID,
            fullName: req.body.fullName ? req.body.fullName: Intern.fullName,
            residentialAddress: req.body.residentialAddress ? req.body.residentialAddress: Intern.residentialAddress,
            emailAddress: req.body.emailAddress ? req.body.emailAddress: Intern.emailAddress,
            phoneNumber: req.body.phoneNumber ? req.body.phoneNumber: Intern.phoneNumber,
        },
        {
            new: true,
            upsert: false,
            useFindAndModify: false
        },
        (error, intern) => {
            if(error) {
                //
                console.log(`Error updating intern record. Error: ${error}`);
                res.send(`Error updating intern record.`);
            } else {
                //
                console.log(`Document after update: ${intern}`);
                //res.json(intern); // ONLY used for testing API calls
                res.redirect("/interns");
            }
        });
});

// PLEASE READ up on how to override GET to DELETE request: https://stackoverflow.com/a/34929022/664424

router.use((req, res, next) => {
    if(req.method._method == "DELETE") {
        req.method = "DELETE";
        req.url = req.path;
    }
    next();
});

// Router for deleting an existing user
router.delete("/delete/:studentID", (req, res) => {
    const internID = req.params.studentID;

    Intern.findOneAndDelete(
        {
            studentID: internID
        },
        (error, intern) => {
            if(error) {
                //
                console.log(`Error deleting intern. Error: ${error}`);
                res.send(`Error deleting intern.`);
            } else {
                //
                console.log(`Deleted intern: ${intern}`);
                //res.json(intern); // ONLY used for testing API calls
                res.render("/interns");
            }
        });
});


module.exports = router;