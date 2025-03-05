const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../configs/s3.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { result } = require("lodash");
const urlcloudfront = "https://d2a6lvbw3os87d.cloudfront.net";
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // CJS
const keyPairId = "K8Z7AYLDGK17U";
const base64EncodedServiceAccount =
  process.env.BASE64_ENCODED_AWS_BUCKET_PRIVATE_KEY;
const decodedPrivatekey = Buffer.from(
  base64EncodedServiceAccount,
  "base64"
).toString("utf-8");
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg", // that is what you need!
    });

    const result = await s3.send(command);
    // const signedUrl = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: file.originalname || "unknown",
    // });
    const url = getSignedUrl({
      url: `${urlcloudfront}/${file.originalname || "unknown"}`,
      keyPairId,
      dateLessThan: new Date(Date.now() + 30 * 1000),
      privateKey: decodedPrivatekey,
    });
    // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
    console.log(result);
    return {
      //   image_url: result.secure_url,
      //   shopId: 8409,
      //   thumb_url: await cloudinary.url(result.public_id, {
      //     height: 100,
      //     width: 100,
      //     format: "jpg",
      //   }),
      //   url: `${urlcloudfront}/${file.originalname || "unknown"}`,
      url,
      result,
    };
  } catch (error) {
    console.error("Error uploading image use S3Client::", error);
  }
};
module.exports = {
  uploadImageFromLocalS3,
};
