let fs = require('fs').promises;


//同步的，底层还是异步的
//异步串行
// function *readAge(filePath){
//     let name =yield fs.readFile(filePath,'utf8');
//     let age = yield fs.readFile('/Users/yinxia/highFunction/src1/'+name,'utf8');
//     return age;
// }
// let it = readAge('/Users/yinxia/highFunction/src/name.txt');

// ///（1）generator---------------
// let {value,done} = it.next();
// Promise.resolve(value).then(data=>{
//     console.log(data)
//     let {value,done} = it.next(data);
//     Promise.resolve(value).then(data=>{
//         console.log(data)
//         let {value,done} = it.next(data);
//         console.log(value,done);
//     })
// })

///（2）co-->tj
//安装co,npm install co
// let co = require('co');
// co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
//     console.log(data)
// })


// （3）vue-router =>beforeEach  next=>next=>next
// 实现co
// readAge('/Users/yinxia/highFunction/src/name.txt');//返回一个ite
// 还可以then,说明返回了一个promise
/*
function co(it){
    //递归 异步迭代（函数来迭代）   同步是forEach promise.all
    return new Promise((resolve,reject)=>{
        function next(val){
            let {value,done} = it.next(val);  //val上一次产出的结果  value是yeild产出的结果
            if(done){  //如果完成了就返回最终结果
                resolve(value)
            }else{
                Promise.resolve(value).then(data=>{
                    next(data)
                },reject)  //有一个失败就失败了
            }
        }
        next();
    })
    
}
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e,'错误')
})
*/



// (4)\\\\\\\\\\\\\\\\\\\\\
function *readAge(filePath){
   try{
        let name =yield fs.readFile(filePath,'utf8');
        let age = yield fs.readFile('/Users/yinxia/highFunction/src1/'+name,'utf8');
        return age;
    }catch(e){
        console.log(e)
    }
}
function co(it){
    //递归 异步迭代（函数来迭代）   同步是forEach promise.all
    return new Promise((resolve,reject)=>{
        function next(val){
            let {value,done} = it.next(val);  //val上一次产出的结果  value是yeild产出的结果
            if(done){  //如果完成了就返回最终结果
                resolve(value)
            }else{
                   Promise.resolve(value).then(data=>{
                        next(data)
                },(err)=>{it.throw('出错了')
                 }) 
                //有一个失败就失败了
            }
        }
        next();
    })
    
}
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
})

