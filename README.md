# 高阶函数

什么是高阶函数： 把函数作为参数或者返回值的一类函数。

1、如果一个函数的参数是一个函数（回调函数就是一种高阶函数）

2、如果一个函数返回一个函数（当前这个函数就是高阶函数）

百度百科上面的定义：
> AOP(面向切面的编程)主要是将一些与核心业务逻辑模块无关的功能抽离出来，这些功能通常包括日志统计，安全控制，或者是异常处理等等。

总结：
简单的AOP实现，就是在原函数执行的前后，增加运行before和after两个增强方法，用这个新函数替换原函数，
用途：日志记录，性能统计，安全控制，事务处理，异常处理等等。日志记录，性能统计，安全控制，事务处理，异常处理等等。

## before 函数

给某个方法添加一个方法在它执行之前调用

<!-- code runner //运行代码的插件 -->

```js
//写一个业务代码，扩展当前的业务代码
function say() {
    console.log('say', a, b)
}
```

1、使用箭头函数的形式：

```js
function say(a, b) {
    console.log('say', a, b)
}
Function.prototype.before = function (callback) {
    return (...args) => {
        //箭头函数改变this指向say()  //...args剩余参数  箭头函数没有this也没有argument
        callback();
        this(...args) //扩展运算符 apply的用法
           // console.log(this)  [Function: say]
    }
}
let beforeSay = say.before(function () {
    console.log('befor say')
})
beforeSay('hello', 'word')
```

> ...args 有两个用法
> 1、在函数参数的时使用,...args 是接收所有的参数。存到一个数组
> 2、在函数调用的时候使用，是展开参数，一个个传给另一个函数

2、未使用箭头函数的形式

```js
function say(a) {
    console.log('say')
    console.log(a)
}
Function.prototype.before = function (callback) {
    let _this = this
    return function () {
        callback.apply(this, arguments)
        _this.apply(this, arguments)
    }
}
let beforeSay = say.before(function (b) {
    console.log(2)
    console.log(b)
})
beforeSay([3, 2, 1])
```

## 类型检测

判断变量的类型

### 常见的判断变量的类型有四种

1、typeof 不能判断变量的类型 typeof [] typeof {}

2、constructor 可以找到这个变量是通过谁构造数来的 构造函数

3、instanceof 判断谁是谁的实例 _proto_

4、Object.prototype.toString.call() 可以判断类型，不能判断谁是谁的实例

```js
function isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`
}
console.log(isType([], 'Array'))
//true
```

## 函数柯里化 和函数反柯里化

柯里化的定义：柯里化是将使用多个参数的一个函数，通过拆分参数的方式，转换成一系列使用一个参数的函数。

函数的柯里化，返回的是一个参数的函数。其实现方式是需要依赖参数以及递归，通过拆分参数的方式，来调用一个多参数的函数方法，增加可读性的目的。

```js

function isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`
}
//把上面的函数通过拆分参数的方式，将使用多个参数的一个函数转换成一系列使用一个参数的函数
function isType(type){
    return function(value){
            return Object.prototype.toString.call(value) === `[object ${type}]`
    }
}
let isArry = isType('Array');
console.log(isArry([]))
//true
```

柯里化的通用化实现： 

通过一个柯里化函数实现通用的柯里化方法
```js
//支持多参数传递
//es6实现
function isType(type){
    return function(value){
        return Object.prototype.toString.call(value) === `[object ${type}]`
    }
}
let  currying = (fn,arr=[]) =>{
    let len = fn.length;  //这里获取的是函数参数的个数
    //  console.log(len)
    return function(...args){  //每次执行传入的参数
        //高阶函数
       let  _arr = [...arr, ...args] //合并上次传入的参数到arr数组
        if (_arr.length < len) {
            return currying(fn, _arr) //递归不停的产生函数
        } else {
            return fn(..._arr)
        }
    }
}

let isArray = currying(isType)('Array');
let isString = currying(isType)('String');

//es5实现
// 支持多参数传递
function currying(fn, args) {
    var args = args || [];//用来存储所有传入的参数
    var _this = this;
    var len = fn.length;
    return function () {
        var _args = Array.prototype.slice.call(arguments) //把arguments转换成数组  用来存放每次递归传过来的参数
         _args = args.concat(args)
        // 如果参数个数小于fn.length，则递归调用，继续收集参数
        if (_args.length < len) {
            return currying.call(_this, fn, _args)
        } else {
            // 参数收集完毕，则执行fn
            return fn.apply(_this, _args)
        }
    }
}
//ts实现

const curring = (fn:Function) =>{//sum
    const exec =(sumArgs:any[]=[])=>{
        return sumArgs.length<fn.length? (...args:any[]) =>exec([...sumArgs,...args]): fn(...sumArgs)
         
    }
    return exec() //用于收集每次传入的参数，第一次默认是空的
}


```
**反柯里化**

  - 柯里化：方法的范围变小了（isType => isString/isArray） 方法的范围变小了
  - 反柯里化：范围变大了

```js
//   ---------分割线----------------------
/*  let toString = Object.prototype.toString;
   console.log(toString.call(123)) 
*/
//   ---------分割线----------------------
  Function.prototype.unCurrying = function(){
     return (...args)=>{ //将所有参数组成一个数组
         /* this.call 这样调用call方法，可能并不是原型上的call方法，可能是用户自己定义的
            防止用户自定义了call方法，这里调用原型上的call方法
           借用原型上的call方法  apply：主要就是改变this,并且传入参数 
           第一个call是找到call函数，第二个apply是让call执行
           让call方法上的this变成了toString(...args),让toString执行
           */
         return Function.prototype.call.apply(this,args)
     }
  }
  let toString = Object.prototype.toString.unCurrying();
  //toString原来只是原型上的，现在变成全局的了，其他原型的方法都可以通过这样变为全局的方法
  console.log(toString(123))
  
```
函数柯里化经典面试题：
```js
function add(a, b, c, d, e) {
    return a + b + c + d + e
}
let sum = currying(add)
console.log(sum(1, 2)(3, 4)(5))
```
##  after函数(多个异步请求同时获取最终结果)

示例：
```js
//多个异步请求同时获取最终结果
//常规解决办法
let fs = require('fs')
let school = {};
let index = 0;
const cb = () => {
    if(++index==2){
        console.log(school)
    }
}
fs.readFile('./name.txt', 'utf8', function (err, data) {
    //    console.log(data)
    school.name = data;
    cb()
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    // console.log(data)
    school.age = data;
     cb()
})
//{ name: 'yx', age: '100' }
```
使用after函数

```js
let fs = require('fs')
let school = {};
fs.readFile('./name.txt', 'utf8', function (err, data) {
    school.name = data;
    cb()
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    school.age = data;
     cb()
})

// ES5实现
function after(items,callback){
     return function(){  //闭包函数   函数定义的作用域和函数执行的作用域
         if(--items==0){
            callback() 
         }
     }
}
let cb = after(2,function(){
     console.log(school)
})
//es6实现
const after = (times, callback) => () => {
    if (--times === 0) {
        callback()
    }
}
const cb = after(2, () => {
    console.log(school)
})

```
**使用fs模块读取json出现了错误'no such file or directory'原因如下：**

  - 使用nodejs的fs模块读取文件时习惯用相对路径，但是运行的时候出现了上述的错误，原因就是fs模块读取文件的相对路径是以启动server.js的位置为基准的，而不是以server.js文件的位置。 
  - nodejs官方推荐在使用fs模块读取文件时使用绝对路径，而不是相对路径。
  - 但是写绝对路径又有些许麻烦，那该如何解决呢，参考以下代码就可以啦：

```js
const fs = require('fs');//可以读取文件
let path = require('path');
let PUBLIC_PATH = path.resolve(__dirname, 'name.txt');
let PUBLIC_PATH1 = path.resolve(__dirname, 'age.txt');

function after(times,callback){ // 高阶函数  可以暂存变量
    let obj = {};
    return function(key,val){
        obj[key] = val;
        --times == 0 && callback(obj);
    }
}
let fn = after(2,(obj)=>{
    console.log(obj);
})
fs.readFile(PUBLIC_PATH,'utf8',(err,data)=>{
    fn('name',data);
})
fs.readFile(PUBLIC_PATH1,'utf8',(err,data)=>{
    fn('age',data);
})

```

ts里面找不到require
```ts
TS2304: Cannot find name 'require' 
```
解决办法：
安装@types/node，它定义了require
```bash
npm install @types/node --save-dev
```
添加到tsconfig.json的types里
```json
{
    "compilerOptions": {
        "types": ["node"]
    }
}
```
在xx.ts里面：
```ts
declare function require(string):any;
```
fs.readFile 读取路径需要绝对路径

```ts
declare function require(string):any;
const fs = require('fs'); // 可以读取文件

interface IPerson {
    age:number,
    name:string
}
function after(times,callback){ // 高阶函数  可以暂存变量
    let obj = {} as IPerson;
    return function(key:string,val:number | string){
        // console.log(obj)
        obj[key] = val;
        --times == 0 && callback(obj);
    }
}
let fn = after(2,(obj)=>{
    console.log(obj);
})

fs.readFile('/Users/yinxia/Desktop/项目/架构课学习/预习/promise/src/name.txt','utf8',(err,data)=>{
    console.log(data)
    fn('name',data);
})
fs.readFile('/Users/yinxia/Desktop/项目/架构课学习/预习/promise/src/age.txt','utf8',(err,data)=>{
    console.log(data)
    fn('age',data);
})


export {}

```

## 发布订阅模式

- 发布订阅模式  主要分为两个部分 on emit
  - on  就是把一些函数维护到一个数组中（订阅）
  - emit  就是让数组中的方法依次执行 （发布）

- 把需要做的事放到一个数组中，等会儿事情发生了让订阅的事依次执行

```js
let fs = require('fs')
let school = {}

let event = {  //订阅和发布没有明显的关联
    arr:[],
     on(fn){
         console.log(fn)
        this.arr.push(fn);
     },
     emit(){
         this.arr.forEach((fn) => fn())
     }
}

event.on(function () {
    console.log('读取一个')
})
event.on(function(){
     console.log('读取两个')
    if(Object.keys(school).length===2){
        console.log(school)
    }
})

fs.readFile('./name.txt', 'utf8', function (err, data) {
    school.name = data
    event.emit()
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    school.age = data
    event.emit()
})

```

```js
// on的时候收集了两个函数进去，
event.on(function () {
    console.log(school)
})
event.on(function () {
    console.log('读取一个')
})

```
打印on里面收集的东西
```js
[Function]
[Function]
```

每调一次emit就会发布两个出来

```js
读取一个
读取两个

读取一个
读取两个
{ name: 'yx', age: '100' }
```

```ts
//发布订阅模式
//把需要做的事放到一个数组中，等会儿事情发生了让订阅的事依次执行

declare function require(string):any;
const fs = require('fs'); // 可以读取文件

interface events{
    arr:Array<Function>,
    on(fn:Function):void,
    emit():void
}
let events:events = {
    arr:[],//[fn,fn]
    on(fn){
        this.arr.push(fn)
    },
    emit(){
        this.arr.forEach(fn => fn());
    }
}
interface IPerson {
    age:number,
    name:string
}
let person = {} as IPerson;
events.on(()=>{
    if(Object.keys(person).length==2){
        console.log(person)
    }
})
events.on(()=>{
    console.log('触发一次')
})

fs.readFile('/Users/yinxia/Desktop/项目/架构课学习/预习/promise/src/name.txt','utf8',(err,data)=>{
    // console.log(data)
    person.name = data;
    events.emit()
})
fs.readFile('/Users/yinxia/Desktop/项目/架构课学习/预习/promise/src/age.txt','utf8',(err,data)=>{
    // console.log(data)
    person.age = data;
    events.emit()
})

export {}

```

## 观察者模式

-  观察者模式  （观察者，被观察者之间是存在关联的，内部还是发布订阅） 有依赖关系就是观察者模式，没有依赖关系就是发布订阅
-  观察者需要放到被观察者中，被观察者的状态变化之后需要通知观察者
-  内部也是基于发布订阅模式  收集观察者，状态变化之后通知观察者

```js
class Subject {
    //被观察者  小宝宝
    constructor(name) {
        this.state = '开心'
        this.name = name
        this.observers = []
    }
    attach(o) {
        //Subject.prototype.attach
        this.observers.push(o)
    }
    setState(newState){
        this.state = newState;
        this.observers.forEach( (o) =>o.update(this) )
    }
}
class Observer {
    //观察者 爸爸 妈妈
    constructor(name) {
        this.name = name;
    }
    update(baby){
        console.log(`当前${this.name}被通知了，当前小宝宝的状态是${baby.state}`)
    }
}

//需要观察小宝宝心里状态的变化
let baby = new Subject('小宝宝');
let father = new Observer('爸爸');
let mother = new Observer('妈妈')
baby.attach(father);
baby.attach(mother);
baby.setState('被欺负了')

// 注意：o能调用update因为o是Observer的实例
// 用es5实现：
function Subject(name) {
    //被观察者  小宝宝
      this.state = '开心'
      this.name = name
     this.observers = []
}
Subject.prototype.attach = function(o){
     this.observers.push(o)
}   
Subject.prototype.setState = function(newState){
     this.state = newState;
    this.observers.forEach( (o) =>o.update(this) )
}
```
```ts
class Subject{  //被观察者
    name:string;  //实例上面又一个name属性
    state:string;
    observers:Observer[];
    constructor(name:string){
        this.name = name;
        this.state = '我现在很开心';
        this.observers = []
    }
    attach(o:Observer){  //传入 观察者
        this.observers.push(o)
    }
    setState(newState:string){
        this.state = newState;
        this.observers.forEach(o => o.update(this));
    }

}
class Observer{  //观察者
    name:string  //实例上面又一个name属性
    constructor(name:string){
        this.name = name;    
    }
    update(baby:Subject) {
        console.log(`${baby.name}对${this.name}说${baby.state}`)
    }
}

//家里有个小宝宝，爸爸妈妈需要观察小宝宝的变化
let baby = new Subject('小宝宝');
let father = new Observer('爸爸');
let mather = new Observer('妈妈');
baby.attach(father);
baby.attach(mather);
baby.setState('我不开心了');
baby.setState('我开心了');

// 小宝宝对爸爸说我不开心了
// 小宝宝对妈妈说我不开心了
// 小宝宝对爸爸说我开心了
// 小宝宝对妈妈说我开心了
```

## 异步

览器最早解决异步回调 => promise => generator => async + await


### generator

> Generator函数，又称生成器函数
- 原理是：利用Generator函数暂停执行的作用，可以将异步操作的语句写到yield后面，通过执行next方法进行回调。
- 特点：可以控制函数的执行

**Generator函数和普通函数区别**

- 普通函数用function来声明，Generator函数用function*声明
- Generator函数内部有新的关键字：yield，普通函数没有。

> yield代表的是暂停执行，后续通过调用生成器的next( )方法，可以恢复执行。

**Generator函数运行结果：**

```js
function *hello(){
   yield '你好，'
   return '欢迎来到前端成长指引！'
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite)  //Object [Generator] {}
console.log(ite.next())  //{ value: '你好，', done: false }
console.log(ite.next())  //{ value: '欢迎来到前端成长指引！', done: true }
```
 可以看出函数执行后，
 - 返回了一个：[Object [Generator] {}生成器对象
 - 第1次调用生成器对象ite的next( )方法，返回了一个对象：{ value: '你好，', done: false }
 - 第2次调用生成器对象ite的next( )方法，同样返回一个对象{ value: '欢迎来到前端成长指引！', done: true }

 **Generator函数的执行过程：**
    Generator函数被调用后并不会一直执行到最后，它是先回返回一个生成器对象，等到生成器对象的next( )方法被调用后，函数才会继续执行，直到遇到关键字yield后，又会停止执行，并返回一个Object对象，然后继续等待，直到next( )再一次被调用的时候，才会继续接着往下执行，直到done的值为true。

**yield和teturn的区别**
    yield有点像普通函数的return的作用，但不同的是普通函数只能return一次，但是Generator函数可以有很多个yield。
    而return代表的是终止执行，yield代表的是暂停执行，后续通过调用生成器的next( )方法，可以恢复执行。
 **next()方法传递参数**
  -  next()方法还可以接受一个参数，它的参数会作为上一个yield的返回值
  -  第一次next中传递参数是没有意义的
```js
function *hello(){
    let res = yield '你好，'
    console.log(a)  //undefined
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite.next('hello'))  //{ value: '你好，', done: false }
console.log(ite.next())  //{ value: undefined, done: true }
```
```js
    function *hello(){
    let res = yield '你好，'
    console.log(res)  //欢迎来到前端成长指引！
    let b =  yield res
    console.log(b)//undefined
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite.next())  //{ value: '你好，', done: false }
console.log(ite.next('欢迎来到前端成长指引！'))  //{ value: '欢迎来到前端成长指引！', done: true }
console.log(ite.next())//{ value: undefined, done: true }
```

例子

```js
function *hello(){
    let a = yield 1;
    console.log(a)//1
    let b =  yield 2
    console.log(b)//2
    return 100
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
let {value,done} = ite.next();
value = ite.next(value).value;
console.log(ite.next(value))  //{ value: 100, done: true }
   
```
打开https://babeljs.io/转换一下代码为es2015,可以看到：

```js
 function *hello(){
    let a = yield 1;
    console.log(a)
    let b =  yield 2
    console.log(b)
    let c =  yield 3
    console.log(c)
}
// 转换后：
"use strict";

var _marked = /*#__PURE__*/regeneratorRuntime.mark(hello);

function hello() {
  var a, b, c;
  return regeneratorRuntime.wrap(function hello$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
          a = _context.sent;
          console.log(a); //1

          _context.next = 6;
          return 2;

        case 6:
          b = _context.sent;
          console.log(b); //2

          _context.next = 10;
          return 3;

        case 10:
          c = _context.sent;
          console.log(c); //3

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
```
可以看到生成器函数里面返回了一个regeneratorRuntime对象，regeneratorRuntime对象上有两个方法：mark和wrap，wrap执行后返回一个iterator，iterator上有个next方法，next执行完返回一个对象，对象有两个参数value和done,同时又next的参数作为上一次返回值  context.sent = v;

实现如下：生成器部分代码

```js
class Context{
    constructor(){
        this.next = 0; //执行第几步
        this.done = false;//是否已经完成
    }
    stop(){
        this.done = true;
    }
}

let regeneratorRuntime = {
    mark(genFunc){
        return genFunc;//最外层的generator函数
    },
    wrap(innerFn,outerFn){
        let ite={};
        let context = new Context()
        ite.next = function(v){
            context.sent = v;  //作为上一个yield返回值
          let value = innerFn(context);//next的返回值
            return {
                value,
                done:context.done
            }
        }
        return ite;
    }
}

// 执行以下代码：

let it = hello()
console.log(it.next())
console.log(it.next('a'))
console.log(it.next('b'))
console.log(it.next('c'))

// 可以看到输出结果为：

{ value: 1, done: false }
a
{ value: 2, done: false }
b
{ value: 3, done: false }
c
{ value: undefined, done: true }

```

**扩展：**

数据结构拥有一个叫[Symbol.iterator]()方法的数据结构，就可以被for...of遍历，我们称之为：可遍历对象。比如：数组，字符串，Set和Map结构。

但是Object对象
 ```js
    Object.prototype[Symbol.iterator];
    //结果：undefined
```
可以看到Object对象的原型上没有Symbol.iterator，所以Object不能被for...of遍历

for...of的原理就是：先调用可遍历对象的[Symbol.iterator]( )方法，得到一个iterator遍历器对象，然后就在遍历器上不断调用next( )方法，直到done的值为true的时候，就表示遍历完成结束了。

**自定义Iterator遍历器**

有了[Symbol.iterator]()方法就算是可遍历对象，那么给Object对象手动加上一个[Symbol.iterator]()方法，它就可以被for...of遍历了

```js
const interable = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
interable[Symbol.iterator] = function() {
    let index = 0;
    return { // 遍历器对象
        next: () => {
            return { value: this[index], done: index++ >= this.length }
        }
    }
}
// 咱们来for...of一下
    for(let v of obj){
        console.log(v);
    }
     //a b c
```

> 如果自己去迭代一个对象需要实现一个迭代器接口，返回一个具有next方法的对象。内部会调用这个next方法返回结果包含value和done,当done为true时迭代完成。

执行

```js
 const interable = {0:'a',1:'b',2:'c',length:3};
    interable[Symbol.iterator] = function(){
        let index=0; //执行次数
        return {
            next:()=>{
                let value = this[index];
                let done = index++ >= this.length
                return {value,done}
            }
        }
    }
let iter = interable[Symbol.iterator]();
console.log(iter.next())//{ value: 'a', done: false }
console.log(iter.next())//{ value: 'b', done: false }
console.log(iter.next())//{ value: 'c', done: false }
console.log(iter.next())//{ value: undefined, done: true }

```

### async

- 同步的，底层还是异步的
```js
// 异步串行
function *readAge(filePath){
    let name =yield fs.readFile(filePath,'utf8');
    let age = yield fs.readFile('/Users/yinxia/highFunction/src1/'+name,'utf8');
    return age;
}
let it = readAge('/Users/yinxia/highFunction/src/name.txt');

```

(1)使用回调形式

```js
// generator---------------
let {value,done} = it.next();
Promise.resolve(value).then(data=>{
    console.log(data)
    let {value,done} = it.next(data);
    Promise.resolve(value).then(data=>{
        console.log(data)
        let {value,done} = it.next(data);
        console.log(value,done);
    })
})
```

(2)co-->tj

 安装co=>npm install co

```js
let co = require('co');
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
})
```

(3)vue-router =>beforeEach  next=>next=>next

 - 实现co
   - readAge('/Users/yinxia/highFunction/src/name.txt');//返回一个ite
   - 还可以then,说明返回了一个promise

 ```js
 function co(it){
    //递归 异步迭代（函数来迭代）   同步是forEach promise.all
    return new Promise((resolve,reject)=>{
        function next(val){
            let {value,done} = it.next(val);  //val上一次产出的结果  value是yeild产出的结果
            if(done){  //如果完成了就返回最终结果
                resolve(value)
            }else{
                Promise.resolve(value).then(data=>{
                    next(data)
                },reject)  //有一个失败就失败了
            }
        }
        next();
    })
    
}
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e,'错误')
})
 ```
(4) it.throw('出错了')，抛错

```js
function *readAge(filePath){
   try{
        let name =yield fs.readFile(filePath,'utf8');
        let age = yield fs.readFile('/Users/yinxia/highFunction/src1/'+name,'utf8');
        return age;
    }catch(e){
        console.log(e)
    }
}
function co(it){
    //递归 异步迭代（函数来迭代）   同步是forEach promise.all
    return new Promise((resolve,reject)=>{
        function next(val){
            let {value,done} = it.next(val);  //val上一次产出的结果  value是yeild产出的结果
            if(done){  //如果完成了就返回最终结果
                resolve(value)
            }else{
                   Promise.resolve(value).then(data=>{
                        next(data)
                },(err)=>{it.throw('出错了')
                 }) 
                //有一个失败就失败了
            }
        }
        next();
    })
    
}
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
})
```
（5）async + await

```js
let fs = require('fs').promises;
async function readAge(filePath){
    let name =await fs.readFile(filePath,'utf8');
    let age = await fs.readFile('/Users/yinxia/highFunction/src/'+name,'utf8');
     return age;
 }
 //async执行完后返回的就是一个promise
//  async + await => generator + co
//co自动解析yield方法，自动调用it.next()
 readAge('/Users/yinxia/highFunction/src/name.txt').then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e)
})
```
(6)async + await

```js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);    //it.next(val)
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

function readAge(_x) {
    return _readAge.apply(this, arguments);
} //async执行完后返回的就是一个promise

function _readAge() {
    _readAge = _asyncToGenerator( /*#__PURE__*/ regeneratorRuntime.mark(function _callee(filePath) {
        var name, age;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fs.readFile(filePath, 'utf8');

                    case 2:
                        name = _context.sent;
                        _context.next = 5;
                        return fs.readFile('/Users/yinxia/highFunction/src/' + name, 'utf8');

                    case 5:
                        age = _context.sent;
                        return _context.abrupt("return", age);

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _readAge.apply(this, arguments);
}

readAge('/Users/yinxia/highFunction/src/name.txt').then(function (data) {
    console.log(data);
}).catch(function (e) {
    console.log(e);
});
```






