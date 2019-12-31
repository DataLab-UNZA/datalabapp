/*
> db.datalabRAs.find().limit(1).pretty()
{
        "_id" : ObjectId("5e07828266263facea099549"),
        "fullName" : "Mathews Lungu",
        "studentID" : "2017012950",
        "emailAddress" : [
                "2017012950@student.unza.zm",
                "muyaz068@gmail.com"
        ],
        "phoneNumber" : [
                "+260963137684"
        ],
        "residentialAddress" : "Garden Park"
}
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PersonSchema = new Schema({
    // Notice the different ways of defining a schema entry
    fullName: {
        type: String,
        required: true
    },
    studentID: String,
    emailAddress: [String],
    phoneNumber: [String],
    residentialAddress: String
});


module.exports = mongoose.model("Person", PersonSchema, "datalabRAs");