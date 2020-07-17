#!/usr/bin/env node
//命令行库
const program = require('commander');
const api = require('./index')
program
  .option('-x, --xxx', 'what the x')

program
  .command('add')
  .description('add a task')
  .action((...args) => {
    // console.log(...args)
    let len = args.length - 1;
    let words = [...args].slice(0, -1).join(' ')
    console.log(words)
    api.add(words).then(() => {
      console.log('add success')
    }, () => {
      console.log('add fail')
    })

    
  });
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => { console.log('清除成功') }, () => { console.log('清除失败') })
  });

program.parse(process.argv)

if (process.argv.length === 2) {
  api.showAll()
}