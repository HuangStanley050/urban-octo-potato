import fs from "fs";
import crypto from "crypto";
import { parse } from "aws-lambda-multipart-parser";
import AWS from "aws-sdk";

export const decrypt = async (event, context) => {
  const result = parse(event, true);
  const algorithm = "aes-256-ctr";
  const password = "d6F3Efeq";
  const writeStream = fs.createWriteStream(`/tmp/${result.file.filename}`);
  writeStream.write(result.file.content);
  writeStream.on("finish", () => {
    console.log("finish upload");
  });
  const readStream = fs.createReadStream(`/tmp/${result.file.filename}`);
  const decrypt = crypto.createDecipher(algorithm, password);
  const decryptWriteStream = fs.createWriteStream(
    `/tmp/${result.file.filename}.decrypt`
  );

  readStream.pipe(decrypt).pipe(decryptWriteStream);

  decryptWriteStream.on("finish", () => {
    console.log("decryption complete");
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${await message({
        time: 1,
        copy: "decrypt complete",
      })}`,
    }),
  };
};

export const encrypt = async (event, context) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY,
  });
  const result = parse(event, true);
  const algorithm = "aes-256-ctr";
  const password = "d6F3Efeq";
  let location = "";
  //console.log(result);

  /*
    Read the file from the client and save to /tmp
   */
  const writeStream = fs.createWriteStream(`/tmp/${result.file.filename}`);
  writeStream.write(result.file.content);
  writeStream.on("finish", () => {
    console.log("upload finish");
  });
  writeStream.end();
  /*
    End upload file
   */

  /*
    Read the file from /tmp and then encrypt it and save it back to /tmp
   */
  const readStream = fs.createReadStream(`/tmp/${result.file.filename}`);
  const encrypt = crypto.createCipher(algorithm, password);
  const encryptWriteStream = fs.createWriteStream(
    `/tmp/${result.file.filename}.encrypt`
  );

  readStream.pipe(encrypt).pipe(encryptWriteStream);
  /*
  end encrypting file and saving back to /tmp as new file
   */

  /*
    when the encrypted file finished stream to /tmp, save the encrypted file to s3
   */
  encryptWriteStream.on("finish", async () => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${result.file.filename}.encrypt`, // File name you want to save as in S3
      Body: fs.createReadStream(`/tmp/${result.file.filename}.encrypt`),
      //ACL: "public-read",
    };
    const res = await new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err === null) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
    location = res.Location;
    console.log(res.Location);
    console.log("encryption complete");
  });
  /*
   end saving file to s3
   */

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${location}`,
    }),
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
