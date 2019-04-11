// await 关键字后的函数
var Delay_Time = function(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    } )
}
// async 函数
var Delay_Print = async function(ms) {
    let value = await Delay_Time(ms);
    console.log("test section");
    return new Promise(function(resolve, reject) {
        resolve("END");
    })
}

var Delay_Print_1 = async function(ms) {
    await Delay_Time(ms);
    console.log("DONE");
}
// 执行async函数后
Delay_Print(1000).then(function(resolve) {
    console.log(resolve);
});

function test(){
    var avalue = 5;
}

Delay_Print_1(5000);
console.log("Program DONE");
test();
console.log(avalue);