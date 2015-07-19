function Server(props) {
    
    var self = this;
    
    if(!props.name) {
        console.error('Error creating server "props.name" must be set!');
        return;
    }
    else if(!props.maxsize) {
        console.error('Error creating server "props.maxsize" must be set!');
        return;
    }
    
    $.get('/api/server?name=' + props.name + '&' + 'maxsize=' + props.maxsize, function(data){
        
        data = JSON.parse(data);
        
        console.log(data);
        
        self.peer = new Peer(data.id, {key: '55sj0os1x512a9k9'});
        
        self.peer.on('connection', function(connection){
            self.conn = connection;
            
            self.conn.on('data', function(data){
                console.log(data);
            });
            
            self.conn.send('Hello client!');
            
        });
        
    });
    
    
}