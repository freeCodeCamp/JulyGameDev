function Server(props) {
    
    var self = this;
    
    if(!props.name) {
        console.error('Error creating server "props.name" must be set!');
        return;
    }
    
    $.get('/api/server?name=' + props.name, function(data){
        console.log("Test");
        data = JSON.parse(data);
        
        console.log(data);
        
        self.peer = new Peer(data.id, {key: '55sj0os1x512a9k9'});
        
        self.peer.on('connection', function(connection){//why not just move this to client.js?
            self.conn = connection;
            
            self.conn.on('data', function(data){
                console.log(data + " - TEST!@#");
            });
            
            self.conn.send('Hello client!');
            
        });
    });
}