const express = require("express");
const app = express();

// Configure port where application will run from
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`DataLab app running on PORT: ${PORT}`);
});