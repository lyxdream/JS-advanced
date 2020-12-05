// let str:string = 'hello';
// console.log(str)

//promise 都是基于回调模式的

//高阶函数 1、如果一个函数的参数是一个函数 2、如果一个函数返回一个函数

//基于原来的代码扩展
// AOP(面向切面的编程)主要是将一些与核心业务逻辑模块无关的功能抽离出来，这些功能通常包括日志统计，安全控制，或者是异常处理等等。
//其实就是给原函数增加一层，不用管原函数内部实现

type Callback = () => void;   //type不能被继承
type ReturnFn = (...args:any[]) =>void; 

declare global{
    interface Function{  //接口的合并
        before(fn:Callback):ReturnFn
    }  
}

Function.prototype.before = function(fn){
    return (...args) =>{
       fn();//先调用before的方法
       this(...args);//再调用原有的core方法
    }
  }
  function core(...args){
      console.log("core...",...args)
  }
  let fn = core.before(()=>{
      console.log('before core...')
  })
  fn(1,2,3)

  export {}