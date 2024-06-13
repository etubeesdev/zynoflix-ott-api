// AWS SDK v3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const multer = require("multer");
const multerS3 = require("multer-s3");

const region = process.env.AWS_REGION || "us-east-1";
export const bucketName = process.env.AWS_BUCKET_NAME || "etubees";
const accessKeyId = process.env.AWS_ACCESS_KEY || "demo-key";
const secretAccessKey = process.env.AWS_SECRET_KEY || "demo-key";

export const s3 = new S3Client({
  region: region,
  credentials: { accessKeyId, secretAccessKey },
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req: any, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: any, file: any, cb: any) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
