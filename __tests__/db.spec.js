const db = require('../db.js')
const fs = require('fs')
jest.mock('fs')

describe('db',()=>{
  //每执行一个it函数就会执行afterEach函数
  afterEach = ()=>{
    fs.clearMocks()
  }

  it('can read', async()=>{
    const data = [{title:'hi',done:true}]
    fs.setReadFileMock('/xxx',null,JSON.stringify(data))
    const list = await db.read('/xxx')
    //两个数组或对象不可能相等，因为地址肯定不一样，但是可以用toStrictEqual（严格相等）
    expect(list).toStrictEqual(data)
  })
  it('can read',async()=>{
    //由于测试最好不好影响正式的外界，所以写文件mock到的变量fakeFile里面
    let fakeFile
    fs.setWriteFileMocks('/yyy',(path,data,callback)=>{
      fakeFile = data
      callback(null)
    })
    const list = [{title:'吃方便面',done:true},{title:'吃烤串',done:true}]
    await db.write(list,'/yyy')
    //不加JSON.stringify会出现空格的问题使得不成功
    expect(fakeFile).toBe(JSON.stringify(list))
  })
})
