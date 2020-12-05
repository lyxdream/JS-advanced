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