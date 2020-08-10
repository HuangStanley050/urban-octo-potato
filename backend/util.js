export const saveToFileSystem = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(filePath);
    fileWriteStream
      .on("finish", resolve("upload finish"))
      .on("error", reject("unable to upload"));
  });
};

export const encryptAndSaveToFileSystem = (filePath, encrypt) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(`${filePath}.encrypt`);
    readStream.pipe(encrypt).pipe(writeStream);
    readStream
      .on("finish", resolve("file encrypted and saved"))
      .on("error", reject("unable to encrypt and save file"));
  });
};
