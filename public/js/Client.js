function Client(props) {
    
    var self = this;
    var serverID;
    
    if(!props.username) {
        console.error('Error creating client "props.username" must be set!');
        return;
    }
    else if(!props.serverid) {
        console.error('Error creating client "props.serverid" must be set!');
        return;
    }
    
    /*$.get('/api/list', function(data){
        $.each(JSON.parse(data), function(i, e){
            serverID = e.id;
        });
    });*/
    
    $.get('/api/client?username=' + props.username, function(data){
        data = JSON.parse(data);
        
        
        var peer = new Peer()
        console.log(data.id, props.serverid);
        
        console.log(props.serverid);
        
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