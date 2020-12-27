setTimeout(()=>{  //宏任务
    console.log('ok1');
},1000)
setTimeout(()=>{  //宏任务
    console.log('ok2');
},0)
Promise.resolve().then((resolve,reject)=>{  //微任务
    console.log('then')
})

function a(){
    console.log('a')
    function b(){
        console.log('b')
        function c(){
            console.log('c')
        }
        c();
    }
    b();
}
a();


// a
// b
// c
// then
// ok2
// ok1

// 宏任务 [ok1,ok2]
//宏任务 script脚本 =》清空所有微任务 =》取出一个宏任务 
//宏任务要求时间到了才会执行

