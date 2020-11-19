
const express=require('express');
const socket=require('socket.io');
const {createUser,updateStatus,removeUser,resetGame,resetScore,getOnlineUsers,getCurrentWord}=require('./crud.js');
const messages=require('./messages.js');

const app=express();
const port=3000;
const timer=60;
const server=app.listen(port,()=>{
    console.log(`server started running on port ${port}`)
});
const io=socket(server);
app.set('view engine','ejs');
app.set('views','./client/views');
app.use(express.static('client'));
app.use(express.urlencoded({extended:false}))


app.get('/',(req,res)=>{
    res.render('index.ejs');
})

app.get('/user',(req,res)=>{
    const name=app.locals.name;
    res.render('main.ejs',{name});
})
app.post('/user',(req,res)=>{
const name=req.body.username;
app.locals.name=name;
    createUser(name).then(user=>{
        if(user._id)
        res.render('main.ejs',{name})
    }).catch(e=>console.log(e))
})
io.on('connect',(socket)=>{ 
    updateOnlineUsers();
    const name=app.locals.name;
    getCurrentWord(name).then(word=>io.emit('msg',(word))).catch(e=>console.log(e))
 console.log('client connected');

socket.on('word',(word)=>{
    io.emit('timer',(timer));
   updateStatus(name,word).then(word=>{
       if(messages[word]!==undefined){
           const invalidMsg=messages[word]
           io.to(socket.id).emit('msg',(invalidMsg))
       }
       else{
        io.emit('msg',(word));
        updateOnlineUsers();
       }
     
   }).catch(e=>console.log(e));
})

socket.on('disconnect',()=>{
    removeUser(name).then(res=>{
        if(res.n===1){
            socket.broadcast.emit('alert',(name));
            updateOnlineUsers();
        }
        }).catch(e=>console.log(e))

        if(socket.conn.server.clientsCount===0){
            resetGame().catch(e=>console.log(e));
        }

})
socket.on('done',()=>{
    resetScore(name).catch(e=>console.log(e))
    updateOnlineUsers();
    socket.emit('msg','Game Over!')
})
function updateOnlineUsers(){
    getOnlineUsers().then(users=>{
        io.emit('activeUsers',(users));
    }).catch(e=>console.log(e))
}
});




