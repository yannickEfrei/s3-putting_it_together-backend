// Initializing the amazonS3 object.
let amazonS3 = require("aws-sdk");
amazonS3.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const s3Bucket = new amazonS3.S3({ params: { Bucket: "yannick-dev-bucket" } });

const test = (req, res) => {
  res.send("SUPER");
};

function uploadToBucket(req, res) {
  if (req.files) {
    let file = req.files.file,
      filename = file.name,
      username = req.body.username;
    let params = {
      Key: `${username}/${Date.now()}-${filename}`,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    // upload file to S3
    s3Bucket.upload(params, function (err, data) {
      if (err) {
        console.log("Error occured while trying to upload to AWS: ", err);
        res.send(err);
      } else {
        console.log("Upload Success", data.Location);
        res.json(data);
      }
    });
  } else {
    console.log("no files");
    res.sendStatus("303");
  }
}

module.exports = {
  uploadToBucket,
  test,
};
