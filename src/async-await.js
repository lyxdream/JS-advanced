

let fs = require('fs').promises;
async function readAge(filePath){
    let name =await fs.readFile(filePath,'utf8');
    let age = await fs.readFile('/Users/yinxia/highFunction/src/'+name,'utf8');
     return age;
 }
 //async执行完后返回的就是一个promise
//  async + await => generator + co
//co自动解析yield方法，自动调用it.next()
 readAge('/Users/yinxia/highFunction/src/name.txt').then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e)
})



