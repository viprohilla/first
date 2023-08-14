const webSocketsServerPort=8000;
const webSocketsServer=require('websocket').server;//importing websocket
const http = require('http');//importing http

//Spinning the http server and the websocket server.
const server=http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');
//above creating http server


//creating websocket server using the instance of webSocketServer and that web socket server will listen to server 8000 
const wsServer=new webSocketsServer(
    {
        httpServer:server
    }   
);

const clients={};//here we create a client's object where we will store all the connected clients

//This code generates unique userid for everyuser.
const getUniqueID=()=>{
    const s4=()=>Math.floor((1+Math.random())*0*10000).toString(16).substring(1);
    return s4()+s4()+'-'+s4();
}



//in the onrequest method we define what should happen ones the server receives a request
wsServer.on('request', function(request){
    var userID=getUniqueID();//here we will create a unique user id for every user that connects to this server
    console.log((new Date())+'Received a new connection from origin '+request.origin+'.');

    //You can rewrite this part of code to accept only the requests from allowed origin 
    const connection =request.accept(null,request.origin);//accepting the request to create new connection
    
    clients[userID]=connection;//storing the connection in clients object

    console.log('connected: '+userID+' in '+ Object.getOwnPropertyNames(clients));

    connection.on('message', function(message){
        if(message.type=='utf8'){
            console.log('Received Message: ',message.utf8Data);

            //broadcasting message to all connected clients
            for(key in clients){
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ',clients[key]);
            }
        }
    })
});
