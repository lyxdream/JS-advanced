1、
```js
let p = new Promise(function(resolve,reject){
     reject()
    resolve();
})
p.then(function(){
    console.log('成功');
},function(){
    console.log('失败');
})
//失败
```

2、
```js
const promise = new Promise((resolve,reject)=>{
    console.log(1);
    resolve();
      console.log(2)
})

promise.then(function(){
    console.log(3)
})
//123
```
```js
const promise = new Promise((resolve,reject)=>{
    console.log(1);
    resolve('ok');
      console.log(2)
})

promise.then(function(data){
    console.log(3)
    console.log(data)
})
// 123 'ok'
```
3、
```js
Promise.resolve(1).then(res=>2).catch(err=>3).then(res=>console.log(res))
//2
```
4、
```js
Promise.resolve(1)
    .then((x) => x+1)
    .then((x) => {throw new Error('my error')})
    .catch(() => 1)
    .then((x) => x+1)
    .then((x) => console.log(x))
    .catch(console.error)
//2
```
5、
```js
// async 
async function async1(){
    console.log('async1 start');
    await async2();
}
async function async2(){
    console.log('async2');
}
console.log('script start');
setTimeout(function(){
    console.log('setTimeout')
},0)

async1();
new Promise(function(resolve){
    console.log('promise1');
    resolve()
}).then(function(){
    console.log('promise2')
})
console.log('script end')

//script start
//async1 start
//async2
//promise1
//script end
//promise2
//setTimeout

```