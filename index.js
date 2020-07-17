const db = require('./db.js')
const inquirer = require('inquirer')
module.exports.add = async (title) => {
  //优化代码的总体思路：面向接口编程
  //读取之前的任务
  const list = await db.read()
  //往里面加一个title任务
  list.push({ title, done: false })
  //存储任务到文件
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

module.exports.showAll = async () => {
  //读取之前的任务
  const list = await db.read()
  //打印之前的任务
  printTasks(list)

}

function printTasks(list) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '疫情结束最想做的事',
        choices: [{ name: 'quit', value: -1 }, ...list.map((task, index) => {
          return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index + 1 }
        }), { name: '+ 创建任务', value: -2 }]
      },
    ])
    .then(answer => {
      const index = answer.index
      if (index >= 0) {
        //选中一个任务
        askForAction(list, index)
      } else if (index === -2) {
        //创建任务
        askForCreateTask(list)
      }
    });
}

function askForAction(list, index) {
  const actions = { markAsDone, markAsUndone, remove, updateTitle }
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Which action do you want to choose?',
        choices: [
          { name: 'quit', value: 'quit' },
          { name: 'markAsDone', value: 'markAsDone' },
          { name: 'markAsUndone', value: 'markAsUndone' },
          { name: 'updateTitle', value: 'updateTitle' },
          { name: 'remove', value: 'remove' },
        ]

      },
    ]).then(answer2 => {
      //js里面的switch必须break
      const action = actions[answer2.action]
      action && action(list, index)

    })


}

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "Please input your title",
  }).then(answer => {
    list.push({
      title: answer.title,
      done: false
    })
    db.write(list)
  });
}

function markAsDone(list, index) {
  list[index - 1].done = true;
  db.write(list)
}

function markAsUndone(list, index) {
  list[index - 1].done = false
  db.write(list)
}

function updateTitle(list, index) {
  console.log('update')
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "What's the new title?",
    default: list[index - 1].title
  }).then(answer => {
    list[index - 1].title = answer.title
    db.write(list)
  });
}

function remove(list, index) {
  list.splice(index - 1, 1)
  db.write(list)
}