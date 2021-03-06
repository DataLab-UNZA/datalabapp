// dotenv
// Use configuration entries in ".env" file
///////require("dotenv").config(); // results in Heroku errors
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Path
const path = require("path");

// Express Layouts
const expressLayouts = require("express-ejs-layouts");

// Express JS
const express = require("express");
const app = express();

// Body parser
const bodyParser = require("body-parser");

// Method override
const methodOverride = require("method-override"); // TODO: READ UP

// Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
});

// Configure database connection
const db = mongoose.connection;
db.on("error", error => {
  console.log(`Database Error: ${error}`); // check to see if there are database errors
});

db.once("open", () => {
  console.log(`Successfully connected to database: ${db.name} on ${db.host}`);
});

const indexRouter = require("./routes/index");
const peopleRouter = require("./routes/people");
const projectsRouter = require("./routes/projects");
const indexAPIRouter = require("./routes/api/index");
const peopleAPIRouter = require("./routes/api/people");
const projectAPIRouter = require("./routes/api/projects");

//--- Settings ---

app.set("view engine", "ejs"); // Specify templating engine
app.set("views", path.join(__dirname, "views")); // Specify view directory
app.set("layout", path.join("layouts", "layout")); // Specify layout file to be used in project

//--- Middleware ---

app.use(expressLayouts); // Explicitly indicate that expressLayouts will be used---express-ejs-layouts
app.use(methodOverride("_method")); // TODO: READ UP on method overriding
app.use(express.static(path.join(__dirname, "public"))); // Configure public directory
app.use(express.static(__dirname + "/node_modules/bootstrap/dist")); // Configure Bootstrap

// PLEASE READ up on how to override GET to DELETE request: https://stackoverflow.com/a/34929022/664424

app.use((req, res, next) => {
  if (req.method._method == "DELETE") {
    req.method = "DELETE";
    req.url = req.path;
  }
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Configure sub routers
app.use("/", indexRouter);
app.use("/people", peopleRouter);
app.use("/projects", projectsRouter);
app.use("/api", indexAPIRouter);
app.use("/api/people", peopleAPIRouter);
app.use("/api/projects", projectAPIRouter);

// Configure port where application will run from
//let PORT = process.env.PORT || 3000;

// Dynamically print out port to console
// https://stackoverflow.com/a/4842885/664424
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`DataLab app running ${listener.address().port}`);
});
