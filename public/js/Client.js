function Client(props) {
    
    if(props.username) {
        this.username = props.username;
    }
    
    $.get('/api/client', function(data){
        this.peer = new Peer(data.id);
    });
}