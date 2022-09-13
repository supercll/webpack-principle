let { AsyncParallelBailHook } = require('tapable')
let queue = new AsyncParallelBailHook(['name'])

// tap同步注册，callAsync触发，不需要等待队列都处理完才出发callAsync回调，因为是bailHook，所以有返回值则结束，直接走触发函数callAsync回调
// queue.tap('1', function (name) {
//   console.log(1)
// })
// queue.tap('2', function (name) {
//   console.log(2)
//   return name
// })
// queue.tap('3', function (name) {
//   setTimeout(() => {
//     console.log(3)
//   }, 3000)
// })
// queue.callAsync('lc', err => {
//   console.log(err, '错误信息')
// })

// tapAsync注册，callAsync触发,任务全部完成才触发CallAsync回调，因为是bailHook，所以有返回值则结束，直接走触发函数callAsync回调
// queue.tapAsync('1', function (name, callback) {
//   console.log(1)
//   callback('Wrong')
// })
// queue.tapAsync('2', function (name, callback) {
//   console.log(2)
//   callback()
// })
// queue.tapAsync('3', function (name, callback) {
//   console.log(3)
//   callback()
// })
// queue.callAsync('lc', err => {
//   console.log(err)
// })

//  tapPromise, 只要有一个任务有 resolve 或者 reject 值，不管成功失败都结束,结束的意思是都走callAsync触发函数的回调，并不是说其他注册的函数都不执行了，执行还是要执行的。
//  resolve或reject执行或一次后面的就无效了,无效的意思是不会再触发callAsync函数了
queue.tapPromise('1', function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('tapPromise', 1)
      //对于promise来说，resolve还reject并没有区别
      //区别在于你是否传给它们的参数
      resolve(1)
    }, 1000)
  })
})
queue.tapPromise('2', function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('tapPromise', 2)
      resolve(2)
      // reject(2) // resolve或reject执行或一次后面的就无效了。
    }, 2000)
  })
})

queue.tapPromise('3', function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('tapPromise', 3)
      resolve(3)
    }, 3000)
  })
})

queue.promise('lc').then(
  result => {
    console.log('成功', result)
  },
  err => {
    console.error('失败', err)
  },
)
