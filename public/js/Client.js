function Client(props) {
    
    var self = this;
    
    if(!props.username) {
        console.error('Error creating client "props.username" must be set!');
        return;
    }
    else if(!props.serverid) {
        console.error('Error creating client "props.serverid" must be set!');
        return;
    }
    
    $.get('/api/client?username=' + props.username, function(data){
        
        data = JSON.parse(data);
        
        console.log(data);
        
        self.peer = new Peer(data.id, {key: '55sj0os1x512a9k9'});
        
        self.conn = self.peer.connect(props.serverid);
        
        self.conn.on('data', function(data){
            console.log(data);
        });
        
        self.conn.on('open', function(){
            self.conn.send('Hello server!');
        });
        
    });
}