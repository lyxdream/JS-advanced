const { wrap } = require("module");


/*
   function *hello(){
      let a = yield 1;
      console.log(a)//1
     let b =  yield 2
      console.log(b)//2
     let c =  yield 3
      console.log(c)//3
    }
*/

class Context{
    constructor(){
        this.next = 0; //执行第几步
        this.done = false;//是否已经完成
    }
    stop(){
        this.done = true;
    }
}

let regeneratorRuntime = {
    mark(genFunc){
        return genFunc;//最外层的generator函数
    },
    wrap(innerFn,outerFn){
        let ite={};
        let context = new Context()
        ite.next = function(v){
            context.sent = v;  //作为上一个yield返回值
          let value = innerFn(context);//next的返回值
            return {
                value,
                done:context.done
            }
        }
        return ite;
    }
}



var _marked = /*#__PURE__*/regeneratorRuntime.mark(hello);
function hello() {
    var a, b, c;
    return regeneratorRuntime.wrap(function hello$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return 1;
  
          case 2:
            a = _context.sent; //作为上一个yield返回值
            console.log(a);
            _context.next = 6; //记录走到第几步
            return 2;  //innerFn执行完的返回值
  
          case 6:
            b = _context.sent; 
            console.log(b);
            _context.next = 10;
            return 3;
  
          case 10:
            c = _context.sent;
            console.log(c);
  
          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _marked);
  }

let it = hello()


console.log(it.next())
console.log(it.next('a'))
console.log(it.next('b'))
console.log(it.next('c'))