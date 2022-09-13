console.log('--------------SyncHook-----------------')
const { SyncHook } = require('tapable')
const syncHook = new SyncHook(['name', 'age222']) // ['name', 'age']代表形参。其实这两的参数有用的是参数的长度，代表取call的参数的个数，至于元素是什么 没什么关系
// 注册事件函数
syncHook.tap('1', (name, age) => {
  console.log(1, name, age)
})
syncHook.tap('2', (name, age) => {
  setTimeout(() => {
    console.log(2, name, age)
  })
  return 1
})
syncHook.tap('3', (name, age) => {
  console.log(3, name, age)
})
// 触发事件函数
syncHook.call('lc', 18)

console.log('--------------SyncBailHook-----------------')

const { SyncBailHook } = require('tapable')

const syncBailHook = new SyncBailHook(['name', 'age'])

syncBailHook.tap('1', (name, age) => {
  console.log(1, name, age)
})
syncBailHook.tap('2', (name, age) => {
  console.log(2, name, age)
  return '2'
})
syncBailHook.tap('3', (name, age) => {
  console.log(3, name, age)
})

syncBailHook.call('lc', 18)

console.log('--------------SyncWaterfallHook-----------------')
// waterfallHook将最近上一个函数的返回值作为下一个函数的参数，如果上一个函数没有返回值(返回undefined)，那么就继续找上上个，如果找不到就用自己传入的参数

const { SyncWaterfallHook } = require('tapable')

const syncWaterfallHook = new SyncWaterfallHook(['name', 'age'])

syncWaterfallHook.tap('1', (name, age) => {
  console.log(1, name, age)
  return name
})
syncWaterfallHook.tap('2', (name, age) => {
  console.log(2, name, age)
  return name + 'c'
})
syncWaterfallHook.tap('3', (name, age) => {
  console.log(3, name, age)
  return name
})
syncWaterfallHook.tap('4', (name, age) => {
  console.log(4, name, age)
})

syncWaterfallHook.call('lc', 18)

console.log('--------------SyncLoopHook-----------------')

const { SyncLoopHook } = require('tapable')
// 不停的循环执行事件函数，直到所有函数结果 result === undefined
// 每次循环都是从头开始的
const syncLoopHook = new SyncLoopHook(['name', 'age'])

let counter1 = 0
let counter2 = 0
let counter3 = 0

syncLoopHook.tap('1', (name, age) => {
  console.log(1, 'counter1', counter1, name, age)
  if (++counter1 === 1) {
    counter1 = 0
    return
  }
  return true
})
syncLoopHook.tap('2', (name, age) => {
  console.log(2, 'counter2', counter2, name, age)
  if (++counter2 === 2) {
    counter2 = 0
    return
  }
  return true
})
syncLoopHook.tap('3', (name, age) => {
  console.log(3, 'counter3', counter3, name, age)
  if (++counter3 === 3) {
    counter3 = 0
    return
  }
  return true
})
syncLoopHook.call('lc', 18)
