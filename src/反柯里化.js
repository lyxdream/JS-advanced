// 3、反柯里化  
  //柯里化 方法的范围变小了（isType => isString/isArray） 方法的范围变小了
//   ---------分割线----------------------
/*  let toString = Object.prototype.toString;
   console.log(toString.call(123)) 
*/
//  -------------------分割线----------------------
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



  
  
  