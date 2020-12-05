// function core(){
//     console.log('core...')
// }
// let beforefn = core.before = function(){
//      console.log(1)
//      core()
// }

// beforefn()

// Function.prototype.before = function(fn){
//     return (...args) =>{
//        fn();
//        this(...args);
//     }
//   }
//   function core(a,b,c){
//       console.log("core...",a,b,c)
//   }
//   let fn = core.before(()=>{
//       console.log('before core...')
//   })
//   fn(1,2,3)



// let fs = require('fs');
// let path = require('path');
// let PUBLIC_PATH = path.resolve(__dirname, 'name.txt');
// let PUBLIC_PATH1 = path.resolve(__dirname, 'age.txt');
// let school = {};
// fs.readFile(PUBLIC_PATH, 'utf8', function (err, data) {
//     console.log(data)
//     school.name = data;
//     cb()
// })
// fs.readFile(PUBLIC_PATH1, 'utf8', function (err, data) {
//     school.age = data;
//      cb()
// })
// function after(items,callback){
//     return function(){  //闭包函数   函数定义的作用域和函数执行的作用域
//         if(--items==0){
//            callback() 
//         }
//     }
// }
// let cb = after(2,function(){
//     console.log(school)
// })

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

