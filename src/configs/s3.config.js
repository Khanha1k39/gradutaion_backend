"use strict";
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
module.exports = {
  s3: new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
      secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
    },
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
  }),
};
