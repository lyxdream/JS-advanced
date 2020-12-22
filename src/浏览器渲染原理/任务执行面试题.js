// console.log(1);
async function async () {
    console.log(2);
    await console.log(3);  //相当于Promise.resolve().then(()=>{console.log('4')})
    console.log(4)  //4被延时
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)
})
async (); //立即执行
console.log(8);




//new Promise 会立即执行


/*主栈执行顺序
1  
//宏任务 [setTimeout5]  
6 
//微任务[then]
2 3
//微任务[then,4]
8
// 主栈执行完之后，清空微任务队列
7  4 
//执行宏任务 
5
//执行后的结果：1 6 2 3 8 7 4 5
*/