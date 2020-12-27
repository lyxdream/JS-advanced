/* 
 注意： 浏览器多进程的，js主线程是单线程的 
# 从浏览器多进程到JS单线程
## 区分进程和线程
  应用 -》 进程 -》 线程  
  - 一个应用可以有多个进程，一个进程可以有多个线程  
  - 单线程与多线程，都是指在一个进程内的单和多
## 浏览器是多进程的
  - 每一个页卡（浏览器每打开一个窗口就是一个页卡）都是进程 (互不影响)
  - 渲染进程 每个页卡里，都有一个渲染进程 (浏览器内核)
### 浏览器的渲染进程 
    -（页面渲染线程，js执行线程）
    - js和页面渲染是互斥的，不能同时进行
    （一边渲染页面，一边执行js，就会出现问题）
    主线程是单线程的，js代码从上到下依次执行
    ajax事件，promise （异步方法） 要等待同步执行完毕之后，再执行异步代码）
    单独的线程去管理代码执行的逻辑，调度整个执行的过程
    进程是计算机分配任务的最小单位-》线程
## EventLoop  浏览器 事件触发线程
   ## 宏任务（宿主环境提供的）     微任务(语言本身提供的)
    宏任务：script 宏任务要求时间到了才会执行
    微任务:then
    宏任务（如script脚本） =》清空所有微任务 =》取出一个宏任务 
   
    宏任务：script,setTimeout ui渲染  setImmediate (ie下才执行)  messageChannel  requestAnimationFrame  node(i/o)
    微任务:promise.then  
    - MutationObserver  接口提供了监视对DOM树所做更改的能力 (MutationObserver 对 DOM 的观察不会立即启动；而必须先调用 observe() 方法来确定，要监听哪一部分的 DOM 以及要响应哪些更改。)  
    - queueMicrotask (promise.then)
    queueMicrotask(() => {
        console.log('queueMicrotask');
    });
   以下是mdn中的介绍：
    下面的代码是一份 queueMicrotask() 的 polyfill。它通过使用立即 resolve 的 promise 创建一个微任务（microtask），如果无法创建 promise，则回落（callback）到使用setTimeout()。
    if (typeof window.queueMicrotask !== "function") {
      window.queueMicrotask = function (callback) {
        Promise.resolve()
          .then(callback)
          .catch(e => setTimeout(() => { throw e; }));
      };
    }
   - node中process.nextTick
    
*/

