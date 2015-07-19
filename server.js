var express = require("express");
var app = express();

//app.use(express.bodyParser());

var servers = [], clients = [];

function genId(len) {
    
    var chars = "123456789abcdefghijklmnopqrstuvwxyz", id = '';
    
    for(var i = 0; i < len; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return id;
};

// find an unused id
function genFreeId(arr, suffix) {
    
    if(!arr) {
        console.error("argument 'arr' of genFreeId must be set!");
        return;
    }
    
    if(suffix)
        suffix += '_';
    else
        suffix = '';
    
    var id = suffix + genId(16); 
    do {
        var stop = true;
        
        for(var i = 0; i < arr.length; i++) {
            if(id == arr[i].id) {
                stop = false;
                break;
            }
        }
        
        if(stop) break;
        
        id = suffix + genId(16);
    } while(true);
    
    return id;
}

function PeerStruct(id, props) {
    this.id = id;
    this.lastPingTime = new Date().getTime();
    this.props = props;
}

// this will return a list of Peer id's that clients can connect to
app.get('/api/list', function(req, res) {
    res.send(JSON.stringify(servers));
});

// resets a servers lastPingTime
app.get('/api/server/ping', function(req, res){
    var data = {};
    
    if(!req.query.id) {
        data = {
            error: "GET parameter 'id' missing from request"
        };
    }
    else {
        for(var i = 0; i < servers.length; i++) {
            if(servers[i].id == req.query.id) {
                servers[i].lastPingTime = new Date().getTime();
                data = {
                    success: "Ping time for '" + req.query.id + "' reset!"
                };
                break;
            }
        }
    }
    
    res.send(JSON.stringify(data));
});

// resets a clients lastPingTime
app.get('/api/client/ping', function(req, res){
    var data = {};
    
    if(!req.query.id) {
        data = {
            error: "GET parameter 'id' missing from request"
        };
    }
    else {
        for(var i = 0; i < clients.length; i++) {
            if(clients[i].id == req.query.id) {
                clients[i].lastPingTime = new Date().getTime();
                data = {
                    success: "Ping time for '" + req.query.id + "' reset!"
                };
                break;
            }
        }
    }
    
    res.send(JSON.stringify(data));
});

// generates a server

//when stuff is added to the global list of arrays you'll want to stored the gengerated id, the name, and the peer id
//then you should be able to look up the stuff using any info
//i think though at this point we should try to redesign in a more stateful way
//like at this point we're getting confused by a system we designed which is yeah
 
app.get('/api/server', function(req, res){
    var data = {};
    
    if(!req.query.name) {
        data = {
            error: 'Please specify a name for this server!'
        };
    }
    else {
        var id = genFreeId(servers, 'server');
        servers.push(
            new PeerStruct(id, {
                name: req.query.name,
                maxsize: 2,
                currentplayers: 0
            })
        );
        data = { id: id };
    }
    
    res.send(JSON.stringify(data));
});

// generates a client
app.get('/api/client', function(req, res){
    var data = {};
    
    if(!req.query.username) {
        data = {
            error: 'Please specify a username for this client!'
        };
    }
    else {
        var id = genFreeId(clients, 'client');
        clients.push(
            new PeerStruct(id, {
                username: req.query.username
            })
        );
        data = { id: id };
    }
    
    res.send(JSON.stringify(data));
});

app.get('/api/echo', function(req, res) {
    res.send('<script src = "https://code.jquery.com/jquery-2.1.4.min.js"></script><script>$.ajax({url: "/api/echo", method: "POST", data: {"meow":"meow"}}).done(function(msg){console.log(msg);});</script>');
});


app.get('/api/echo2', function(req, res) {
    res.send('meow');
});//done

app.post('/api/echo', function(req,res){
    console.log(req.body);
});//probably should be handled by a seperate UDP server but like lol

// serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// bind the server to the port that c9 gives us
app.listen(process.env.PORT);