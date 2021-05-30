const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const { Credentials } = require("aws-sdk");

const access = new Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3({
  credentials: access,
  region: process.env.AWS_S3_REGION,
  signatureVersion: "v4",
});

exports.requestPreSignedUrl = async (req, res) => {
  try {
    const fileId = v4();
    const { fileName, fileType } = req.body;
    const signedUrlExpireSeconds = 60 * 15;

    const presignedPostData = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET,
      Fields: {
        Key: fileName,
        ACL: "public-read",
      },
      Expires: signedUrlExpireSeconds,
    });
    return res.json(presignedPostData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An error occured",
    });
  }
};
