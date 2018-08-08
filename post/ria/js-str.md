# String
与python 一样的定义, 而且不区分双引号：

    '\x00' == '\u0000'
	'\x31' == "\x31"

	'好' === '\u597D' // true
	'好' === '\u{597D}' // true (js only)

Note: '\x87' 并不是单字节字符！它其实表示的是双位uicode(所以是合法的)

    '\u0087' == b'\xc2\x87'.decode()
        '\x87' == bytes([0xc2,0x87]).decode() == chr(0x87)
        '\x87' === Buffer.from([0xc2,0x87]).toString() === String.fromCharCode(0x87)

## es6 string
支持backquote 多行(es6):

	`multiple
	line`

    String.raw`\a` === `\\a`

### charcode(unicode)

	.charAt(pos) str[pos=0]
	.charCodeAt(pos) //返回unicode 十进制表示
	String.fromCharCode(97,98)

### 模板字符

	name='ahui'
	`Hello, ${name}`

### buffer
see py-str-struct: like bytes

string:

    // Buffer -> String
    var text = buf.toString('utf-8');
    // String -> Buffer
    var buf = Buffer.from(text, 'utf-8');

base64

    Buffer.from('a')
    Buffer.from('YQ==', 'base64')
    Buffer.from('a').toString('base64')

    ### base64(chrome)
	btoa(str)
	atob(str)

hex:

    > Buffer.from('ab').toString('hex')
    '6162'
    > Buffer.from('6162', 'hex')

array:

    var buffer = Buffer.from([1,2,3])
    arr = [...buffer]

    > Buffer.from(Array(5))
    <Buffer 00 00 00 00 00>
    > Buffer.from([...Array(5).keys()])

repeat(alloc)

    > Buffer.alloc(5,'\x01\x02');
    <Buffer 01 02 01 02 01>
    > Buffer.alloc(5, 'str');

    > Buffer.alloc(5, Buffer.from([1,2]))
    <Buffer 01 02 01 02 01>

    > Buffer.alloc(5, 15)
    <Buffer 0f 0f 0f 0f 0f>

## pad+repeat

    ('0'+6).slice(-2)
    '6'.padStart(3)             //'006'
    'Vue'.padStart(10)          //'       Vue'
    'Vue'.padStart(10, '_*')    //'_*_*_*_Vue'
    'Vue'.padEnd(10, '_*')      //'Vue_*_*_*_'

    'abc'.repeat(2);    // 'abcabc'

    [...Array(2)].map(()=>'value'); //['value', 'value']

## 字符串是不可变的
    var s = 'Test';
    s[0] = 'X';
    alert(s); // s仍然为'Test'

## function

	#搜索
	.indexOf(sub_string)
	.lastIndexOf(sub_str)
	#compare
	.localeCompare(str) //return 1 0 -1
	#截取(只用slice)
	.slice(start, [end]) //start, end可为负, py: str[slice]
	.substr(start,[length])//start可为负
    .substring(start, [end]) //不可为负

### startsWith
endsWith

###	case

	.toLowerCase() / .toUpperCase()
    //p:first-letter { text-transform:capitalize; }
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

### isNumber

    isNaN(s) // check +s
    s.match(/^-?\d+$/)

### .trim()
trim space only

	' a '.trim()

replace strip

    '#adf#'.replace(/^#+|#+$/g,'')

### for

	for(var i=0; i < str.length; i++ ){
		str[i];
	}

### split
支持regexp

	stringObject.split(separator,[maxSize]);
	'1,2,3,4,5'.split(',', 3);//[1,2,3]
        python: '1,2,3,4,5'.split(',', 2); //[1,2,3]
	'12345'.split('', 3);//[1,2,3]
	'1,2,3,4,5'.split(/,/);//[1,2,3,4,5]

### font

	str.link(url)
	str.bold()
	str.sup() 上标
	str.sub() 下标 //"<sub>str</sub>"
	str.small() 小字号
	str.big()
	str.fontcolor('red') "<font color="red">s</font>"
	's'.fontsize('1px')

### Match

	//return 存放匹配结果的数组
	stringObject.match(searchvalue)

	stringObject.match(regexp)
	matches = "1 2 3 ".match(/\d+/g); //[1,2,3]
	"1 2 3".match(/(\d) s/g); //return null

#### match group

	//如果regexp没有g, 则会匹配子模式
	matches = "first 1".match(/(\w+) 1/);//如果没有g, 则返回包括子表达式  ["first 1", "first"]
	matches.index //0 相当于indexOf返回的位置

> 如果需要同时支持regExp global 及 子表达式, 请使用RegExp.prototype.exec
> match 成功后，`RegExp.$1~$9` 代表子组，`RegExp.$0` 不存在

### search
返回字符位置, 不支持regexp global; 这个像indexOf()

	str.search('string') equal to str.indexOf('string'); //返回字符位置
	str.search(/Hilo/i);

### replace
支持regexp global.

	str = stringObject.replace(substr,replacement); //once
	str = stringObject.replace(/substr/g,replacement); //all

	str = stringObject.replace(regexp/substr,replacement)
	replacement:
		string:
			字符	替换文本
			$1、$2、...、$99	与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。
			$&	与 regexp 相匹配的子串。
			$`	位于匹配子串左侧的文本。
			$'	位于匹配子串右侧的文本。
			$$	$转义
		function:
			function(mathStr, first, second, ...){return replace;}

eg:

	//reference
	'funing smoking '.replace(/(\w+)ing/g, '$1');// "fun smok "
	//func
	card = '[card]google[/card]http://g.cn'; // to "<a href="http://g.cn">google</a>"
	card.replace(/\[card\](\w+)\[\/card\]([\w:\/.]+)/,function(ori,card,url){
		return '<a href="'+url+'">'+card+'</a>';
	})

### map,reduce

    '12345'.split('', 3).map()

## RegExp
Create RegExp：test, exec

	/pattern/attributes
	/str/igm
	new RegExp('pattern', 'attributes');
	new RegExp("str",'igm')
	new RegExp("^str$",'igm')
	new RegExp("(^|&)str$",'igm')


	/\u1321/.test('\u1321');//true
	/\x31/u.test('\x31');//true

### zero-width 断言
正向断言，假定该位置后跟的是X

	(?<=X)	zero-width positive lookbehind
	(?=X)	zero-width positive lookahead

	(?<!X)	zero-width negative lookbehind>
	(?!X)	zero-width negative lookahead

	'?_b=1&b=2'.match(/(?<=[?&])b=(\d+)/)

### test

	test	检索字符串中指定的值。返回 true 或 false。
	str=' 1 2 3';
	r=/\d/igm;
	while(r.test(str) === true){
		console.log(r.lastIndex);//2 4 6 下次要匹配的字符串起始位置
	}

### comile

	r.compile(/\d/); //改变正则表达式

### exec

	str=' 1ing 2ing 3ing';
	r=/\d(ing)/igm;
	while((match = r.exec(str)) !== null){
		console.log(match,r.lastIndex);
		//第1次输出 ["1ing", "ing", index: 1, input: " 1ing 2ing 3ing"] 5
		//第2次输出 ["2ing", "ing", index: 6, input: " 1ing 2ing 3ing"] 10
		//第3次输出 ["3ing", "ing", index: 11, input: " 1ing 2ing 3ing"] 15
	}

## html转码:
URI:

	encodeURI()	把字符串编码为 URI。
		encodeURI("http://a.cn/b?='1'#\"|看"); //转码所有非URI字符转码: '|" Ò' 等等
			'http://a.cn/b?=\'1\'#%22%7C%E7%9C%8B'
	encodeURIComponent()	把字符串编码为 URI 组件(utf8)。(所有URI特殊字符 将被转码)
		encodeURIComponent("看");
			'%E7%9C%8B'
        decodeURIComponent

unicode:

	escape()	对字符串进行编码(unicode)。Don't use it, as it has been deprecated since ECMAScript v3.
		escape("看 ");
			'%u770B%20'
        unescape('%20');
	str.replace(/'/g, "\\'");//addslashes
	eval()	计算 JavaScript 字符串，并把它作为脚本代码来执行。

htmlentities:

	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
	// via html dom
		div.innerText=div.innerHTML
		entities=div.innerHTML

## math

    '11'*'33' //363

### hex2str & str2hex

	function str2hex(str) {
		var hex = '';
		for(var i=0;i<str.length;i++) {
			hex += ('0'+str.charCodeAt(i).toString(16)).substr(-2);
		}
		return hex;
	}
	function hex2str(hex) {
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}
