const fs = jest.genMockFromModule('fs');
const _fs = jest.requireActual('fs')

Object.assign(fs,_fs)

let readMock = {}
fs.setReadFileMock = (path, error, data)=>{
  readMock[path] = [error,data]
}
fs.readFile = (path,options,callback)=>{
  if(callback===undefined){callback = options}
  if(path in readMock){
    callback(...readMock[path])
  }else{
    _fs.readFile(path,options,callback)
  }
}

let writeMocks = {}

fs.setWriteFileMocks = (path,fn)=>{
  writeMocks[path]=fn
}

fs.writeFile = (path,data,options,callback)=>{
  if(path in writeMocks){
    writeMocks[path](path,data,options,callback)
  }else{
    _fs.writeFile(path,data,options,callback)
  }
}

fs.clearMocks=()=>{
  readMock = {};
  writeMocks = {};
}

module.exports = fs