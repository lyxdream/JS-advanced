let channel = new MessageChannel();
channel.port1.postMessage('ok');
channel.port2.onmessage = function(e){
    console.log(e.data)
}
Promise.resolve().then((data)=>{
    console.log(data)
})

//undefined
//ok
// 先走微任务再走宏任务