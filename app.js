// dotenv
// Use configuration entries in ".env" file
require("dotenv").config();

// Express JS
const express = require("express");
const app = express();

// Mongoose
const mongoose  = require("mongoose");
mongoose.connect(
    process.env.DATABASE_URL,
    {
        useNewUrlParser: true
    }
);

const db = mongoose.connection;
db.on("error", (error) => {
    console.log(`Database Error: ${error}`); // check to see if there are database errors
});

db.once("open", () => {
    console.log(`Successfully connected to database: ${db.name} on ${db.host}`);
});

const indexRouter = require("./routes/index");
const internsRouter = require("./routes/interns");
const projectsRouter = require("./routes/projects");

// Configure sub routers
app.use("/", indexRouter);
app.use("/interns", internsRouter);
app.use("/projects", projectsRouter);


// Configure database connection



// Configure port where application will run from
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`DataLab app running on PORT: ${PORT}`);
});