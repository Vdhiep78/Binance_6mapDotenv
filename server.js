require('dotenv').config();
var express = require("express");
// goi thu vien truy cap binance qua api
const Binance = require('node-binance-api');
var bodyParser = require("body-parser");
// goi thu vien doc file config
var fs = require("fs");
var app = express();
//app.use(bodyParser.JSON);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
var cors = require('cors')

//123.23.23.23
const whitelist = ['http://192.168.1.113:8081','http://192.168.1.102:5554','http://192.168.1.33:8081','http://192.168.1.102:8081', 'http://localhost:8081', 'http://localhost:5554'];
const corsOptions ={
     origin: (origin, callback) => {
         if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
     },
    credentials:true, //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
//app.use(bodyParser.json);
var server = require("http").Server(app);
var io = require("socket.io")(server);
// kep bien io vaof  bien app do io....
app.io = io;
// server lang nghe ket noi tren cong 3000
server.listen(process.env.PORT || 3002);
// server lang nghe ket noi tren cong 3000 khi cos ket noi thi bao co ket noi vaf in ra id cua ket noi
io.on("connection", function(socket){
 //   console.log("server on");
    console.log("New connection: " + socket.id);
});

// doc file config
loadConfigFile("./config.json");

// taoj ham doc file config
function loadConfigFile(file){
    var obj;
    fs.readFile(file, "utf8", function(err, data){
        if (err) throw err;
        // eps kieu data sang Json
        obj = JSON.parse(data);
   
        // const binance = new Binance().options({
        //     APIKEY: obj.API,
        //     APISECRET: obj.KEY,
        // });

        const binance = new Binance().options({
            APIKEY: process.env.API,
            APISECRET: process.env.KEY,
        });
   

        // goi ham routes/client
        // require("./routes/client")(app, obj, binance);
        require("./routes/client")(app, binance);
    });
}

