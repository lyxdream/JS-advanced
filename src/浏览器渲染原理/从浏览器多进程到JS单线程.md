# 从浏览器多进程到JS单线程
## 区分进程和线程
  应用 -》 进程 -》 线程  
  - 一个应用可以有多个进程，一个进程可以有多个线程  
  - 单线程与多线程，都是指在一个进程内的单和多
  **官方一点解释：**
  - 进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位）
  - 线程是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程
## 浏览器是多进程的
  - 每一个页卡（浏览器每打开一个窗口就是一个页卡）都是进程 (互不影响)
  - 渲染进程 每个页卡里，都有一个渲染进程 (浏览器内核)
###浏览器都包含哪些进程？
### 浏览器多进程的优势
### 浏览器内核（渲染进程） 
### Browser进程和浏览器内核（Renderer进程）的通信过程  





例子：

### 微任务和GUI渲染
```js
 document.body.style.background = 'red';
  console.log(1)
  Promise.resolve().then(()=>{
      console.log(2)
      document.body.style.background = 'yellow';
  })
  console.log(3);
  //1 3 2
  //微任务执行完毕之后才会取渲染页面，所以直接是'yellow'

```

```js
 document.body.style.background = 'red';
    console.log(1)
    setTimeout(()=>{
        console.log(2)
        document.body.style.background = 'yellow';
    },1000)
    console.log(3);
    //1 3 2 红变黄   渲染了两次，第一次走执行栈，页面为红，第二次取出一个宏任务，会变黄
```
### 事件任务

```
<body>
    <button id="button">点我</button>
</body>
<script>
    button.addEventListener('click',()=>{
        console.log('listener1');
        Promise.resolve().then(()=>console.log('micro task1'))
    })
    button.addEventListener('click',()=>{
        console.log('listener2');
        Promise.resolve().then(()=>console.log('micro task2'))
    })
    button.click(); // click1() click2()
    //button.click() listener1 listener2  micro task1  micro task2  立即执行，而不是一个个执行，不点就不会产生一个⌚事件线程，就同步了
    
    //宏任务是一个个执行
    //如果手动去点，则是一个个去执行，会产生事件线程  listener1    micro task1   listener2 micro task2
</script>
```
### 定时器任务

```js
 Promise.resolve().then(() => {
        console.log('Promise1')
        setTimeout(() => {
            console.log('setTimeout2')    
        }, 0);
    })
    setTimeout(() => {
        console.log('setTimeout1');
        Promise.resolve().then(() => {
            console.log('Promise2')
        })
    }, 0);
    /*
    主栈代码：
    微任务  [promise1] 
    宏任务 [setTimeout1]

    1、执行第一个promise，则打印Promise1，setTimeout2进入宏任务队列
    此时微任务 [] 
    此时 宏任务 [setTimeout1，setTimeout2]
    2、取出一个宏任务执行，则打印setTimeout1，
    此时微任务队列：[promise2] 
    宏任务执行完毕之后，清空对应的微任务则打印Promise2
    3、此时任务队列中只有一个宏任务[setTimeout2]
    取出一个宏任务执行，则打印setTimeout2，
    所以执行结果是Promise1，setTimeout1，Promise2，setTimeout2
   */
```
### 任务执行面试题
```js
// console.log(1);
async function async () {
    console.log(2);
    await console.log(3);  //相当于Promise.resolve().then(()=>{console.log('4')})
    console.log(4)
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)
})
async (); //立即执行
console.log(8);

//new Promise 会立即执行
//await console.log(3); await后面紧跟着的代码是同步代码，但是接下来的是微任务，相当于.then
```
**主栈执行顺序,以及最终执行结果**
```js
1  
//宏任务 [setTimeout5]  
6 
//微任务[then]
2 3
//微任务[then,4]
8
// 主栈执行完之后，清空微任务队列
7  4 
//执行宏任务 
5
//执行后的结果：1 6 2 3 8 7 4 5
```