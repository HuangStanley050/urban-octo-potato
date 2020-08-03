import fs from "fs";
import crypto from "crypto";
import { parse } from "aws-lambda-multipart-parser";

export const encrypt = async (event, context) => {
  const result = parse(event, true);
  algorithm = "aes-256-ctr";
  password = "d6F3Efeq";
  //console.log(result);
  const writeStream = fs.createWriteStream(`/tmp/${result.file.filename}`);
  writeStream.write(result.file.content);
  writeStream.on("finish", () => {
    console.log("upload finish");
  });
  writeStream.end();

  const readStream = fs.createReadStream(`/temp/${result.file.filename}`);
  const encrypt = crypto.createCipher(algorithm, password);
  const encryptWriteStream = fs.createWriteStream(
    `/temp/${result.file.filename}.encrypt`
  );

  readStream.pipe(encrypt).pipe(encryptWriteStream);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
    }),
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
