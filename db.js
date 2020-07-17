const p = require('path')
const fs = require('fs')
//home目录
const homedir = require('os').homedir()
//home变量，因为有可能自己设置home变量
const home = process.env.HOME || homedir;
const dbPath = p.join(home, 'todo')


const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
        if (error) { console.log('error',error); return reject(error)}
        let list;
        try {
          list = JSON.parse(data.toString())
        } catch (error2) {
          list = []
        }
        resolve(list)

      })
    })

  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify((list))
      fs.writeFile(path, string, (error) => {
        if (error) return reject(error)
        resolve()

      })
    })


  }
}
module.exports = db;