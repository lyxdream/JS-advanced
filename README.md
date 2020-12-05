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

函数的柯里化，返回的是一个函数的函数。其实现方式是需要依赖参数以及递归，通过拆分参数的方式，来调用一个多参数的函数方法，增加可读性的目的。

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

