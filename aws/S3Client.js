const dotenv = require("dotenv");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { generateRandomString } = require("../utils/helpers.js");

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

console.log("AWS_REGION:", AWS_REGION);
console.log("AWS_S3_BUCKET:", AWS_S3_BUCKET);

const client = new S3Client({ region: AWS_REGION });

/**
 * Inserts a file in S3
 * @param {string} key - Object name
 * @param {Buffer} file - The file itself
 * @returns {string} - File name
 */
exports.insertObject = async (key, file) => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: file,
    });
    await client.send(putObjectCommand);
    return key;
    
  } catch (error) {
    console.error(error);
    throw error
  }
};

/**
 * Inserts multiple files in S3
 * @param {Buffer} files - The files
 * @returns {string[]} Array of image file names
 */
exports.insertMultipleObjects = async (files) => {
  let keys = [];

  for (const file of files) {
    const fileName = `${generateRandomString()}-${file.originalname}`;
    const putObjectCommand = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
    });
    
    try {
      const data = await client.send(putObjectCommand);
      console.log("File uploaded successfully", data);
      keys.push(fileName);
    } catch (error) {
      console.error("Error uploading file", fileName, error);
    }
  }
  return keys;
};