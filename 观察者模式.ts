// 发布订阅 发布和订阅，中间有第三方arr  发布和订阅之间没有关联
//观察者模式 观察者和被观察者之间是存在关联的 （内部还是发布订阅）

class Subject{  //被观察者
    name:string;  //实例上面又一个name属性
    state:string;
    observers:Observer[];
    constructor(name:string){
        this.name = name;
        this.state = '我现在很开心';
        this.observers = []
    }
    attach(o:Observer){  //传入 观察者
        this.observers.push(o)
    }
    setState(newState:string){
        this.state = newState;
        this.observers.forEach(o => o.update(this));
    }

}
class Observer{  //观察者
    name:string  //实例上面又一个name属性
    constructor(name:string){
        this.name = name;    
    }
    update(baby:Subject) {
        console.log(`${baby.name}对${this.name}说${baby.state}`)
    }
}

//家里有个小宝宝，爸爸妈妈需要观察小宝宝的变化
let baby = new Subject('小宝宝');
let father = new Observer('爸爸');
let mather = new Observer('妈妈');
baby.attach(father);
baby.attach(mather);
baby.setState('我不开心了');
baby.setState('我开心了');