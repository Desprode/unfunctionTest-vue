var express = require('express');
var fs = require('fs');
var proxy = require('http-proxy-middleware');
const app = express()

const port = process.env.PORT || 8080;

console.log(__dirname,'');

const api = proxy('/myapi',{target:'http://128.195.0.12:8080/',changeOrigin: true,
         pathRewrite: {
           '^/myapi': '/'
         }});

app.use('/myapi/*',api);

app.use(express.static(__dirname+'/dist'));

app.get('/',function (req,res){
    var html = fs.readFileSync(__dirname+'/dist/index.html','utf-8');	
    res.send(html);
});

app.listen(port);
