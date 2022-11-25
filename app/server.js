/*node express app tat uploads and downloads objects from amazon S3*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const amazonS3 = require("aws-sdk");
const { Redshift } = require("aws-sdk");
const bucketController = require("controllers/s3controller");

const app = express();
const frontUrl = "http://127.0.0.1:3000";
const PORT_APP = 8085;
app.use(cors(frontUrl));
app.use(fileupload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// upload route
app.post("/api/upload", bucketController.uploadToBucket);

// app listen
app.listen(PORT_APP, () => {
  console.log("Working on http://localhost:" + PORT_APP);
});
