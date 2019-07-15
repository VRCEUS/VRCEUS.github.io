

//Cookie不行的...

    pageview();




    function pageview(){


        var caution = false
function setCookie(name, value, expires, path, domain, secure) {
var curCookie = name + "=" + escape(value) +
((expires) ? "; expires=" + expires.toGMTString() : "") +
((path) ? "; path=" + path : "") +
((domain) ? "; domain=" + domain : "") +
((secure) ? "; secure" : "")
if (!caution || (name + "=" + escape(value)).length <= 4000)
document.cookie = curCookie
else
if (confirm("Cookie exceeds 4KB and will be cut!"))
document.cookie = curCookie
}


function getCookie(name) {
var prefix = name + "="
var cookieStartIndex = document.cookie.indexOf(prefix)
if (cookieStartIndex == -1)
return null
var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length)
if (cookieEndIndex == -1)
cookieEndIndex = document.cookie.length
return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex))
}


function deleteCookie(name, path, domain) {
if (getCookie(name)) {
document.cookie = name + "=" +
((path) ? "; path=" + path : "") +
((domain) ? "; domain=" + domain : "") +
"; expires=Thu, 01-Jan-70 00:00:01 GMT"
}
}


function fixDate(date) {
var base = new Date(0)
var skew = base.getTime()
if (skew > 0)
date.setTime(date.getTime() - skew)
}


var now = new Date()

fixDate(now)
now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000)
var visits = getCookie("counter")
if (!visits)
visits = 1
else
visits = parseInt(visits) + 1

setCookie("counter", visits, now)
document.write("浏览量：" + visits)

    }


//获取页面（文章）名称
var key = document.getElementById("title").innerText;


//定义字典
//字典数据结构
function Dictionary(){
    this.items = {};
    //检查是否有某一个键
    this.has = function(key){
        return this.items.hasOwnProperty(key);
    }
    //为字典添加某一个值
    this.set = function(key,val){
        this.items[key] = val;
    }
    //删除某一个键
    this.delete = function(key){
        if(this.has(key)){
            delete this.items[key];
            return true;
        }
        return false;
    }
    //查找某一特定项
    this.get = function(key){
        return this.has(key) ? this.items[key] : undefined; 
    }
    //返回字典中的所有值
    this.values = function(){
        var res = [];
        for(var prop in this.items){
            if(this.has(prop)){
                res.push(this.items[prop]);
            }
        }
        return res;
    }
    //清空字典
    this.clear = function(){
        this.items = {};
    }
    //获取字典的长度
    this.size = function(){
        return Object.keys(this.items).length;
    }
    //获取字典所有的键
    this.keys = function(){
        return Object.keys(this.items);
    }
    //返回字典本身
    this.getItems = function(){
        return this.items;
    }
}
//使用方法
// var dictionary = new Dictionary();
// dictionary.set('Gandalf', 'gandalf@email.com');
// dictionary.set('John', 'johnsnow@email.com');
// dictionary.set('Tyrion', 'tyrion@email.com');
// console.log(dictionary.has('Gandalf'));
// console.log(dictionary.size());
// console.log(dictionary.keys());
// console.log(dictionary.values());
// console.log(dictionary.getItems());
// console.log(dictionary.get('Tyrion'));
// dictionary.delete('John');
// console.log(dictionary.keys());
// console.log(dictionary.values()); 
// console.log(dictionary.getItems());
