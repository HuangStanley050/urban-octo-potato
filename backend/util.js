export const saveToFileSystem = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(filePath);
    fileWriteStream
      .on("finish", resolve("upload finish"))
      .on("error", reject("unable to upload"));
  });
};

export const transformAndSaveToFileSystem = (filePath, method, type) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    let writeStream;
    if (type === "encrypt") {
      writeStream = fs.createWriteStream(`${filePath}.encrypt`);
    } else {
      writeStream = fs.createWriteStream(`${filePath}.decrypt`);
    }
    readStream.pipe(encrypt).pipe(writeStream);
    readStream
      .on("finish", resolve("file encrypted and saved"))
      .on("error", reject("unable to encrypt and save file"));
  });
};

export const uploadS3 = (s3Instance, params) => {
  return new Promose((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err === null) {
        resolve("upload to s3 successful");
      } else {
        reject(err);
      }
    });
  });
};
