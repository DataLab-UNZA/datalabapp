const express = require("express");
const app = express();

const indexRouter = require("./routes/index");
const internsRouter = require("./routes/interns");
const projectsRouter = require("./routes/projects");

// Configure sub routers
app.use("/", indexRouter);
app.use("/interns", internsRouter);
app.use("/projects", projectsRouter);

// Configure port where application will run from
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`DataLab app running on PORT: ${PORT}`);
});