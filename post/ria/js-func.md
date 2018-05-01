# generator
    function* foo() {
        yield 11
        return 22;
    }
    f=foo()
    f.next(); // {value: 11, done: false}
    f.next(); // {value: 22, done: true}
    f.next(); // {value: undefined, done: true}

    for(var x of foo())

# define arrow func 

    (参数1, 参数2, …, 参数N) => { 函数声明 }
    (参数1, 参数2, …, 参数N) => 表达式（单一）
    //相当于：(参数1, 参数2, …, 参数N) =>{ return 表达式; }

    // 当只有一个参数时，圆括号是可选的：
    (单一参数) => {函数声明}
    单一参数 => {函数声明}

    // 没有参数的函数应该写成一对圆括号。
    () => {函数声明}

高级语法

    //加括号的函数体返回对象字面表达式：
    参数=> ({foo: bar})

    //支持剩余参数和默认参数
    (参数1, 参数2, ...rest) => {函数声明}
    (参数1 = 默认值1,参数2, …, 参数N = 默认值N) => {函数声明}

    //同样支持参数列表解构
    let f = ([a, b] = [1, 2], {x: c} = {x: a + b}) => a + b + c;
    f();  // 6

## define + exec

    !function(){return 0}()
    (function(){return 0})()
    (()=>0)()

## arguments
如果arguments[0] 存在, name 指针都指向arguments[0]内存:
否则name 不变

	function a(name){
		arguments[0]='v11';//same as: name='v11'
		console.log(arguments, name);
	}
	a('v1','v2'); //output: ['v11', 'v2'], 'v11'

arguments本身不是Array, 如果想让 arguments 支持数组函数:

    function f(a){
        [].shift.call(arguments)
        console.log(arguments, a);
    }
    f(1); //[],1
    f(1,2); //[2],2
    f(1,2,3); //[2,3],2
    f(1,2,3,4); //[2,3,4],2

注意arguments 还是近引用传值, 修改前要copy 一下

    !function(){
        var params = Array.prototype.slice.call(arguments); // copy
        params.shift();
        console.log([params, arguments, 'ahui'])
    }(1,2,3)

### ...rest
rest，b，a 参数不全时，可以为undefined

    function foo(a, b, ...rest) {
        console.log('a = ' + a);
        console.log('b = ' + b);
        console.log(rest);
    }

    foo(1, 2, 3, 4, 5);
    // a = 1
    // b = 2
    // Array [ 3, 4, 5 ]


# bind params
http://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function/36786630#36786630

## bind params via bind
bind params by value(not by Reference)

    var a = 'before'
    function echo(a, b, c, d){
        console.log(a,b,c, d);
    }
    function caller(callback){
        callback(2,3);
    }
    caller(echo.bind(null,a, a));//bind： before, before, 2,3
    a = 'after'

## bind params via anonymous func's closure
You could pass somevar by value(not by reference) via a javascript feature known as [closure][1]:

    var someVar=1;
    func = function(v){
        console.log(v);
    }
    document.addEventListener('click',function(someVar){
        return function(){func(someVar)}
    }(someVar));
    someVar=2

In generic, you could write a common wrap function such as wrapEventCallback

    function wrapEventCallback(callback){
        var args = Array.prototype.slice.call(arguments, 1);
        return function(e){
            callback.apply(this, args)
        }
    }
    var someVar=1;
    func = function(v){
        console.log(v);
    }
    document.addEventListener('click',wrapEventCallback(func,someVar))
    someVar=2

## bind via event.target

    var someInput = document.querySelector('input');
    someInput.addEventListener('click', myFunc, false);
    someInput.myParam = 'This is my parameter';
    function myFunc(evt) {
      window.alert( evt.target.myParam );
    }

# empty object
js

    Object.keys(obj).length === 0 && obj.constructor === Object

jQuery:

    jQuery.isEmptyObject({}); //

# Function 函数

## anonymous func
You can define a anonymous function via named function:
Example:


	//factorial
    (function(n){
    	var self = function(n){
    		//call self
			return n > 0 ? (self(n-1) * n) : 1;
    	}
    	return self;
    })()

## static variable 静态作用域
可以构造一个:

	a = function(){
		var self=a;
		self.name = 1;//static variable
	}
	a.name=1;//函数静态变量

## 闭包
privat 变量:

    function create_counter(initial) {
        var x = initial || 0;
        return {
            inc: function () {
                x += 1;
                return x;
            }
        }
    }

    var c1 = create_counter();
    c1.inc(); // 1

或者:

    x=1
    f1=(function(x){return ()=>x})(x)
    f2=()=>x

    x=2; 
    f1(); //1
    f2(); //2


## function 对象

	new a(); 函数本身就是一个类似php 的 __constructor.
	a.length; //参数数量


## eval

    i=0
    j=eval('i=1'); // i==j==1

# decorator,装饰

    var count = 0;
    var oldParseInt = parseInt; // 保存原函数

    window.parseInt = function () {
        count += 1;
        return oldParseInt.apply(null, arguments); // 调用原函数
    };
