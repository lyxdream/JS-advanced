//柯里化函数

//判断一个变量的类型

// 1、typeof 不能判断变量的类型 typeof [] typeof {}
// 2、constructor 可以找到这个变量是通过谁构造数来的 构造函数
// 3、instanceof 判断谁是谁的实例 _proto_
// 4、Object.prototype.toString.call() 可以判断类型，不能判断谁是谁的实例

// function isType(type:string,val:unknown){
//     return Object.prototype.toString.call(val) === `[object ${type}]`
// }
// let r = isType('String','hello');
// console.log(r)

//柯里化的功能 就是让函数的功能更具体些
//反柯里化 就是让函数的范围变大 let toString = Object.prototype.toString => toString.call()
// type ReturnFn  = (val:unknown) =>Boolean;
// let utils:Record<string,ReturnFn> = {} as any;
// function isType(type:string) { //高阶函数可以用于保存参数
//     return function (val:unknown) {
//         return Object.prototype.toString.call(val) === `[object ${type}]`
//     }
// }
// ['String','Number','Boolean'].forEach(type =>{
//     utils['is'+type] = isType(type);  //闭包
// })
// console.log(utils.isString('123'))


// 实现一个通用的柯里化函数，可以自动的将一个函数传换成多次传递参数
function isType(type:string,val:unknown){
    return Object.prototype.toString.call(val) === `[object ${type}]`
}
// let isString = isType('String');
// isString('hello');

const curring = (fn:Function) =>{//sum
    const exec =(sumArgs:any[]=[])=>{
        return sumArgs.length<fn.length? (...args:any[]) =>exec([...sumArgs,...args]): fn(...sumArgs)
         
    }
    return exec() //用于收集每次传入的参数，第一次默认是空的
}
let isString = curring(isType)('String');
let isNumber = curring(isType)('Number');
console.log(isString([]));
// function sum(a,b,c,d) {
//     return a+b+c+d;
// }
// let fn = curring(sum);
// fn = fn(1);  //需要fn接收
// console.log(fn(2,3)(4))
//暂存变量




