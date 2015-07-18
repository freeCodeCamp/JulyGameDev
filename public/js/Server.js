function Server(options, id) {
    console.log("Test");
    if(options.name) {
        this.name = options.name;
    }
    
    if(id) {
        this.peer = new Peer(id, {key: '55sj0os1x512a9k9'});
    }
    else {
        $.get('/api/server', function(data){
            this.peer = new Peer(data.id, {key: '55sj0os1x512a9k9'});
        });
    }
}