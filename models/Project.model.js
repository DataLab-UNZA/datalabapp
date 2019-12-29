/*
> db.datalabProjects.find().pretty()
{
        "_id" : ObjectId("5e07861166263facea099631"),
        "projectCode" : "Project 1",
        "projectName" : "IR Deposit",
        "projectDescription" : "MERN stack-based Web application for processing ETDs submitted by students at The University of Zambia",
        "responsibility" : [
                "Jackson Mwanaumo",
                "Mathews Lungu",
                "Wezi Munthali",
                "Hockings Mambwe"
        ]
}
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
    projectCode: String,
    projectName: String,
    ProjectDescription: String,
    responsibility: [{fullName: String}]
});

module.exports = mongoose.model("Project", ProjectSchema, "datalabProjects");