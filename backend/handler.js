import fs from "fs";
import { parse } from "aws-lambda-multipart-parser";

export const encrypt = async (event, context) => {
  const writeStream = fs.createWriteStream("/tmp/experiment");
  //console.log(event);
  const result = parse(event, false);
  console.log(result);
  result.file.content.pipe(writeStream);
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
