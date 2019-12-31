const express = require("express");

const router = express.Router();

const Person = require("../models/Person.model");

// Router for extracting all records
router.get("/", (req, res) => {
    //res.send("/authors router");
    Person.find({}).exec((error, people) => {
        if(error) {
            //
            console.log(`Error extracting People from the database. Error: ${error}`);
            res.send(`Error extracting People from database.`);
        } else{
            //
            console.log(`Extracting People: ${people}`);
            //res.json(people) // ONLY for testing API calls
            res.render("people/index", {people: people});
        }
    });
});

// Router for extracting a single record by studetID
router.get("/search/id/:studentID", (req, res) => {
    
    // res.send("/search/:studetnID");
    const searchKey = req.params.studentID;
    // Experiment with wild character: studentID: {$regex: '*' + searchKey + '*'}
    Person.find({studentID: searchKey}).exec((error, person) => {
        if(error) {
            //
            console.log(`Error extracting student with ID: ${searchKey}`);
            res.send(`Error extracting student: ${searchKey}`);
        } else {
            //
            console.log(`Found student: ${searchKey}`);
            //res.json(student); // ONLY used for testing API calls
            res.render("people/person", {person: person[0]}); // render a single person
        }
    });
});

// Router for extracting a single record by fullname
router.get("/search/name/:fullName", (req, res) => {
    //res.send("/search/name:fullName");
    const fullName = req.params.fullName;
    Person.find({fullName: {$regex: '.*' + fullName + '.*'}}).exec((error, people) => {
        if(error) {
            //
            console.log(`Error extracting name from database. Error: ${error}`);
            res.send(`Error extracting name from database.`);
        } else {
            //
            console.log(`Extracted records matching fullName: ${people}`);
            //res.json(people); // ONLY used for testing API calls
            res.render("people/person", {person: people});
        }
    });
});


// Router for rendering new person form
router.get("/add", (req, res) => {
    res.render("people/add", {person: new Person()}); // render the form
});

// Router for adding a new person
router.post("/add", (req, res) => {
    //
    const newPerson = new Person();
    newPerson.fullName = req.body.fullName ? req.body.fullName: "";
    newPerson.studentID = req.body.studentID ? req.body.studentID: "";
    newPerson.emailAddress.push(req.body.emailAddress ? req.body.emailAddress: "");
    newPerson.phoneNumber.push(req.body.phoneNumber ? req.body.phoneNumber: "");
    newPerson.residentialAddress = req.body.residentialAddress ? req.body.residentialAddress: "";
    // 
    newPerson.save((error, person) => {
        if(error) {
            //
            console.log(`Error creating new person. Error: ${error}.`);
            res.send(`Error creating new person.`);
        } else {
            //
            console.log(`Creating new person: ${newPerson}`);
            //res.json(newPerson);
            res.redirect("/people"); // redirect to people list after successfully adding a new person
        }
    });
});


// Router for rendering form for editing person
router.get("/edit/:studentID", (req, res) => {
    //
    const personID = req.params.studentID;
    Person.find({studentID: personID}).exec((error, person) => {
        if(error) {
            //
            console.log(`Error extracting person. Error: ${error}`);
            res.send(`Error extracting person.`);
        } else {
            //
            console.log(`Extracting person: ${person}`);
            res.render("people/edit", {person: person[0]}); // find seems to return an array: this causes issues with add and edit
        }
    });
});

// Router for editing  an existing user
router.put("/edit/:studentID", (req, res) => {
    //
    const personID = req.params.studentID;

    Person.findOneAndReplace(
        {studentID: personID},
        {
            studentID: req.body.studentID ? req.body.studentID: personID,
            fullName: req.body.fullName ? req.body.fullName: Person.fullName,
            residentialAddress: req.body.residentialAddress ? req.body.residentialAddress: Person.residentialAddress,
            emailAddress: req.body.emailAddress ? req.body.emailAddress: Person.emailAddress,
            phoneNumber: req.body.phoneNumber ? req.body.phoneNumber: Person.phoneNumber,
        },
        {
            new: true,
            upsert: false,
            useFindAndModify: false
        },
        (error, person) => {
            if(error) {
                //
                console.log(`Error updating person record. Error: ${error}`);
                res.send(`Error updating person record.`);
            } else {
                //
                console.log(`Document after update: ${person}`);
                //res.json(person); // ONLY used for testing API calls
                res.redirect("/people");
            }
        });
});

// Router for deleting an existing user
router.delete("/delete/:studentID", (req, res) => {
    const personID = req.params.studentID;

    Person.findOneAndDelete(
        {
            studentID: personID
        },
        (error, person) => {
            if(error) {
                //
                console.log(`Error deleting person. Error: ${error}`);
                res.send(`Error deleting person.`);
            } else {
                //
                console.log(`Deleted person: ${person}`);
                //res.json(person); // ONLY used for testing API calls
                res.redirect("/people");
            }
        });
});


module.exports = router;