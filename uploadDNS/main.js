var router = require('request');
var dnspod = require('request');

var querystring = require('querystring');

var routerOpt = {
    url: "http://home.jcdev.cc:8888/cgi-bin/luci/;stok=/login?form=login",
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Referer": "http://home.jcdev.cc:8888/webpages/login.html",
        "Content-Type": "application/x-www-form-urlencoded"
    }
}

var routerLoginData = {
    "data": '{"method":"login","params":{"username":"admin","password":"6e84923fb45013217b1118a7b71c2455bf8d46a81eae11a77f525b8b1d841d9ab0b7353840923ee2f244d65181fb49b79f0bdf761bdc05c17656c29ab9e9b60fc1b897d966de1d9f0a9d53e74eac10b5733d25b69164f9a0fada1e5d4c1b49ab95572f35fce65f647e607ecfc10bc8fafef8472952490c4a5ef876c8796a51a6"}}'
}

var routerStatusData = {
    "data": '{"method":"get"}'
}

var encodedData = querystring.stringify(routerLoginData);
console.log(encodedData);

routerOpt.body = encodedData;
var stok;
router(routerOpt,function(err,res,body){
    console.log(res.statusCode);
    if(res.statusCode == "200"){
        stok = JSON.parse(body).result.stok;
        console.log(stok);
        routerOpt.headers.Cookie = res.headers["set-cookie"];
        getIp(stok);
    }
    console.log(body);
});

function getIp(stok){
    routerOpt.url = "http://home.jcdev.cc:8888/cgi-bin/luci/;stok=" + stok + "/admin/system_state?form=system_state";
    routerOpt.body = querystring.stringify(routerStatusData);

    router(routerOpt, function(err,res,body){
        if(res.statusCode == "200"){
            var ips = {};
            var normal = JSON.parse(body).result[0].normal;
            ips.telecom = normal[0].ipaddr;
            ips.unicom = normal[1].ipaddr;
            console.log(ips);
            uploadIps(ips);
        }
    });
}

function uploadIps(ips){
    var queryOpt = {
        "url": "https://dnsapi.cn/Record.List",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            "login_token": "90628,fe6a1f18839f83dc56d3472f27cbdd23",
            "format": "json",
            "domain": "jcdev.cc",
            "sub_domain": "home"
        }
    }


    var opt = {
        "url": "https://dnsapi.cn/Record.Modify",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    var data = {        
        "login_token": "90628,fe6a1f18839f83dc56d3472f27cbdd23",
        "format": "json",
        "domain": "jcdev.cc",
        "record_id": "415380637",
        "record_line_id": "0",
        "record_type": "A",
        "sub_domain": "home"
    };

    data.value = ips.telecom;

    opt.body = querystring.stringify(data);
    
    dnspod(opt,function(err,res,body){
        console.log(body);
    });

    data.record_id = "415379011";
    data.record_line_id = "10=1";
    data.value = ips.unicom;
    dnspod(opt,function(err,res,data){
        console.log(data);
    });
}

async 
