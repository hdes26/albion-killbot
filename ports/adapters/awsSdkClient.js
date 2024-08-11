const { S3 } = require("@aws-sdk/client-s3");

let client = new S3({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    },
    maxRetries: 3,
    httpOptions: {
      timeout: 60000,
    },
  });


async function downloadFromS3(name, writer) {
  try {
    const response = await client.getObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: name,
    });

    return new Promise((resolve) => {
      console.log(`Downloading "${name}" from AWS Bucket`, { name });
      response.Body.pipe(writer);
      writer.on("finish", () => resolve(true));
      writer.on("error", () => resolve(false));
      // Emergency timeout
      setTimeout(() => resolve(false), 30000);
    });
  } catch (error) {
    console.log(`Error while downloading ${name} from AWS Bucket: ${error.message}`, { name, error });
    return null;
  }
}

async function uploadToS3(name, readStream) {
  try {
    console.log(`Uploading "${name}" to AWS Bucket`);
    
    await client.putObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: name,
      Body: readStream,
    });

    return true;
  } catch (error) {
    console.log(`Failed to upload ${name} from AWS Bucket: ${error.message}`, { error, name });
    return false;
  }
}

module.exports = {
  downloadFromS3,
  uploadToS3,
};
