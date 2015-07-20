var express = require("express");
var app = express();
var fs = require('fs');

var players = [];

function PeerStruct(id, username) {
    this.id = id;
    this.username = username;
    this.lastPingTime = new Date().getTime();
    this.ingame = false;
}

// this will return a list of Peer id's that clients can connect to
app.get('/api/list', function(req, res) {
    
    var clientsNotInGame = [];
    
    for(var i = 0; i < players.length; i++) {
        if(players[i].ingame == false) {
            clientsNotInGame.push({
                id: players[i].id,
                username: players[i].username
            });
        }
    }
    
    res.send(JSON.stringify(clientsNotInGame));
});

app.get('/api/register', function(req, res){
    var data = null;
    
    if(!req.query.id) {
        data = { error: "'id' missing from request query!" };
    }
    else if(!req.query.username) {
        data = { error: "'username' missing from request query!" };
    }
    else {
        for(var i = 0; i < players.length; i++) {
            if(players[i].id == req.query.id) {
                data = { error: 'Peer with that id already exists!' };
                break;
            }
            //else if(players[i].username == req.query.username) {
            //    data = { error: 'Peer with that username already exists!' };
            //    break;
            //}
        }
        
        // if data wasn't set to anything from an error above
        if(data == null) {
            players.push(new PeerStruct(req.query.id, req.query.username));
            data = {
                success: 'Peer successfully added to server list!'
            };
        }
    }
    
    res.send(data);
});

// this should be passed two args, p1 and p2, each with the id of the player
app.get('/api/start', function(req, res){
    var data = {};
    
    if(!req.query.p1) {
        data = { error: "'p1' missing from request query!" };
    }
    else if(!req.query.p2) {
        data = { error: "'p2' missing from request query!" };
    }
    else if(req.query.p1 == req.query.p2) {
        data = { error: "'p2' missing from request query!" };
    }
    else {
        var p1 = null, p2 = null;
        
        for(var i = 0; i < players.length; i++) {
            if(players[i].id == req.query.p1) {
                if(players[i].ingame) {
                    data = { error: "'p1' is already in game!" };
                }
                else {
                    p1 = players[i];
                }
                break;
            }
            else if(players[i].id == req.query.p2) {
                if(players[i].ingame) {
                    data = { error: "'p2' is already in game!" };
                }
                else {
                    p2 = players[i];
                }
                break;
            }
        }
        
        if(p1 == null) data = { error: "'p1' does not exists!" };
        else if(p2 == null) data = { error: "'p2' does not exists!" };
        
        // if data wasn't set to anything from an error above
        if(data == null) {
            data = {
                success: 'Peer successfully added to server list!'
            };
        }
    }
    
    
    res.send(JSON.stringify(data));
});

app.get('/api/ping', function(req, res){
    
});

app.get('/api/fileExists', function(req, res){
    if(!req.query.file) {
        res.send(JSON.stringify({error: "'file' missing from request query!"}));
    }
    else {
        fs.exists(__dirname + '/public/' + req.query.file, function(exists){
            res.send(JSON.stringify({exists: exists}));
        });
    }
});

// serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// bind the server to the port that c9 gives us
app.listen(process.env.PORT);