/*node express app tat uploads and downloads objects from amazon S3*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const { Redshift } = require("aws-sdk");
const { uploadToBucket, test } = require("./controllers/bucketController");
const app = express();
const frontUrl = "http://127.0.0.1:3000";
const PORT_APP = 8085;
app.use(cors());
app.use(fileupload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test routes
app.get("/", test);
// upload route
app.post("/api/upload", uploadToBucket);

// app listen
app.listen(PORT_APP, () => {
  console.log("Working on http://localhost:" + PORT_APP);
});
