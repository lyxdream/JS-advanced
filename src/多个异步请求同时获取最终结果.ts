//promise 最重要的核心 解决了1、异步并发问题 2、回调地狱问题 回调函数
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

fs.readFile('./name.txt','utf8',(err,data)=>{
    console.log(data)
    fn('name',data);
})
fs.readFile('./age.txt','utf8',(err,data)=>{
    console.log(data)
    fn('age',data);
})
// 发布订阅模式 =》 观察者模式

export {}


