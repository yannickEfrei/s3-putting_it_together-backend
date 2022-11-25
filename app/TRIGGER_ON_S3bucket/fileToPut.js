console.log("Loading function");

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-1" });
// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

exports.handler = async (event, context) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  console.log(key);
  const strKeyArray = key.split("/");
  const username = strKeyArray[0];
  const filename = strKeyArray[1];

  const paramsDB = {
    TableName: "yannick_together_db",
    Item: {
      id: { S: String(username) },
      ts: { S: String(Date.now()) },
      username: { S: String(username) },
      filename: { S: String(filename) },
    },
  };
  // Call DynamoDB to add the item to the table
  ddb.putItem(paramsDB, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });

  const paramsBucket = {
    Bucket: bucket,
    Key: key,
  };
  try {
    const { ContentType } = await s3.getObject(paramsBucket).promise();
    console.log("CONTENT TYPE:", ContentType);
    return ContentType;
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};
