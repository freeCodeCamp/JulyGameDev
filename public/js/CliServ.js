function server(){
    var coordUpdate = new Event('coordUpdate');
    var camperInit = new Event('camperInit');
    
    //For listenting for events
    //document.addEventListener(/*event name*/, function (e) { ... }, false);
    
    //server with no client
    this.peerID = createRdmId(16);
    this.peer = new Peer(this.peerID, {key: '55sj0os1x512a9k9'});
    
    var campers = []; // Currently connected campers and their positions and usernames
    var chatDat = []; // Array with all chat message objects
    var chatMembers = ["SERVER"];
    
    
    //instatciate a camper 
    var camper = function (name, peer_id, startX, startY){
        this.name = name;
        this.peer_id = peer_id;
        this.x = startX;
        this.y = startY;
        
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
        //yep ignore me :p
        // :P
        campers.forEach(function(){
            
        });
    }
    
    var chat = {
        renderChat: function (){
            //show and update chatDat
        },
        chatMessage: function (username, message){
            //Add new message to the chat array
            if(chatMembers.indexOf(username > -1)){
                chatDat.push({username: username, message, message});
            }
        }
        //chatMembers up above is an array
    };
    // User connect handler
    this.peer.on('connection', function(connection){
        var player_peer_id = connection.peer;
        chat.chatMessage("SERVER",  + " has connected!");
    });
    
    
    
    
}



function client(peerID){
    //Just a  client
    
}

function cliserver(){
    //normal client hosting itself
    server();
    client(server.peerID);
}

/*
Already confusing xD
one sec
so cliserver is just going to call server and then client
we need to have it so that any one thing can work in isolation
so we can unit test stuff as we go
Then why do we need server


server should start a server and allow connections 
Then what's the point of cliserver, AAH gotcha
just a neat way of calling 
then you can have people acting as either a cliserver or a client
Cool
*/
//I'm having some early concerns that none of this will actually work
//I'll be back in 15 but the peerjs probably wont handle udp like transfers (rediculous levels of cord updates being sent around i think the host will shit itslef
//Yeah it's worth a try
//hopefully if this is written right it should be easy to modify later
//okay one sec i'll be back in 15

//We can atleast try, and hope it will work... Otherwise we can maybe do something with 2 clients racing and then being able to chat and see who completes levels faster

function createRdmId(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
        var rdm = Math.floor(Math.random() * chars.length);
        result += chars.charAt(rdm);
    }
    return result;
}


