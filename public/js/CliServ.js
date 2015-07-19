function server(){
    var coordUpdate = new Event('coordUpdate');
    var camperInit = new Event('camperInit');
    
    //For listenting for events
    //document.addEventListener(/*event name*/, function (e) { ... }, false);
    
    //server with no client
    this.peer = new Peer({key: '55sj0os1x512a9k9'});
    
    var campers = []; // Currently connected campers and their positions and usernames
    var chatDat = []; // Array with all chat message objects
    var chatMembers = ["SERVER"];
    
    //instatciate a camper 
    var camper = function (name, peer_id, startX, startY){
        this.name = name;
        this.peer_id = peer_id;
        this.x = startX;
        this.y = startY;
        chatMembers.push(this.name);
        
        function updateCoords(x, y){
            if(x === null){
                this.x = this.x;
            }
            else{
                this.x = x;
            }
            if(y === null){
                this.y = this.y;
            }
            else{
                this.y = y;
            }
            document.dispatchEvent(coordUpdate);
        }
        document.dispatchEvent(camperInit);
    }
    
    function camperByPeerId(peer_id) {
        campers.forEach(function(i, e){
            if (e.peer_id === peer_id) {
                return e;
            }
        });
    }
    
    var chat = {
        renderChat: function (){
            //show and update chatDat
        },
        chatMessage: function (username, message, hex_color){// Do you think we can give this a go? Done!
            //Now when react/angular/ember/jquery(god forbid) renders the chat we'll use that hex color in a span of somefink
            //Add new message to the chat array
            if(chatMembers.indexOf(username) > -1){/*this is to stop non-players from messaging*/
                chatDat.push({username: username, color: hex_color, message: message});
            }
        }
        //ChatMembers are auto appened when a camper joins
        //SERVER is always a member
    };
    
    // User connect handler
    this.peer.on('connection', function(connection){
        campers.push(new camper("A_NAME", connection.peer, 200, 200));
        chat.chatMessage("SERVER", "A_NAME has connected!", "#FF0000");
        document.addEventListener('camperInit', function (e) { 
            console.log(e);//No idea how this will help now but we can use it later to send new cord and join data to the other clients later
        }, false);
        document.addEventListener('coordUpdate', function (e) { 
            console.log(e);//No idea how this will help now but we can use it later to send new cord and join data to the other clients later
        }, false);
        this.peer.on('data', function(){
            console.log(arguments);   
        });
    });
    
    /*var braceYourself = function (){
        this.peer.send('yo');
    }*/
}

var client = function client(peerID){
    //Just a client
    this.peer = new Peer({key: '55sj0os1x512a9k9'});
    this.conn = peer.connect(peerID);
    this.conn.on('open', function(){
        this.conn.send('Hey server!');
    });
}

function cliserver(){
    //normal client hosting itself
    server();
    client(server.peerID);
}