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
console.log('--------------AsyncParallelHook-----------------')
const { AsyncParallelHook } = require('tapable')
let queue = new AsyncParallelHook(['name'])

// 同步注册钩子，按顺序执行回调，不需要等待队列都处理完才出发callAsync回调。
// 下面的执行答案为：1、2、undefined 错误信息、3
queue.tap('1', function (name) {
  console.log(1)
})
queue.tap('2', function (name) {
  console.log(2)
})
queue.tap('3', function (name) {
  setTimeout(() => {
    console.log(3)
  }, 3000)
})
queue.callAsync('lc', err => {
  console.log(err, '错误信息')
})

// 异步注册钩子，需要全部任务完成后才执行callAsync回调
// callback一旦传入参数，就会走触发监听事件的函数，也就是callAsync
// 且一旦走过触发监听事件的函数callAsync，就不会再走了。比如有两个callback有入参，那只会是第一个callback执行的时候去执行callAsync，第二个callback不会触发callAsync了。
queue.tapAsync('1', (name, callback) => {
  setTimeout(() => {
    console.log(1)
    callback(111)
  }, 1000)
})
queue.tapAsync('2', (name, callback) => {
  setTimeout(() => {
    console.log(2)
    callback(222)
  }, 2000)
})
queue.tapAsync('3', (name, callback) => {
  setTimeout(() => {
    console.log(3)
    callback()
  }, 3000)
})
queue.callAsync('lc', err => {
  console.log(err, '错误信息')
})

// tapPromise注册钩子，注册时，必须返回一个promise
// resolve()的参数是没有作用的，reject的参数会传到queue.promise的错误回调中。且一旦触发reject，就会执行promise的错误回调，并不会等到玩不执行完后去执行。当然，执行了reject，也不会阻止事件的继续触发。
queue.tapPromise('1', name => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      console.log(1)
      resolve(111)
    }, 1000)
  })
})
queue.tapPromise('1', name => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      console.log(2)
      reject(222)
    }, 2000)
  })
})
queue.tapPromise('1', name => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      console.log(3)
      resolve()
    }, 3000)
  })
})
queue.promise('lc').then(
  res => {
    console.log('成功触发', res)
  },
  err => {
    console.log('错误触发', err)
  },
)
