const fs = require("fs");
class FileHelper {
  readFile(nameFile) {
    return new Promise((res, rej) => {
      fs.readFile(nameFile, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        res(JSON.parse(data));
      });
    });
  }
  writeFile(nameFile, result) {
    return new Promise((res, rej) => {
      fs.writeFile(nameFile, JSON.stringify(result), (err) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        res("Файл успешно записан.");
      });
    });
  }

  checkFileExist(filePath) {
    return new Promise ((res,rej)=>{
      fs.access(filePath, fs.constants.F_OK, (err)=>{
        if (err) {
          rej(new Error('Файл не существует'))
        }
        else {
          res('Всё норм, файл найден')
        }
      })
    })
  }
}

module.exports = new FileHelper();
