
const express=require('express');
const socket=require('socket.io');
const {createUser,updateStatus}=require('./crud.js');

const app=express();
const port=3000;
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

app.post('/user',(req,res)=>{
const name=req.body.username;
app.locals.name=name;
    createUser(name).then(user=>{
        if(user._id)
        res.render('main.ejs',{name})
    }).catch(e=>console.log(e))
})
io.on('connect',(socket)=>{ 
    const name=app.locals.name;
 console.log('client connected');
socket.on('word',(word)=>{
   updateStatus(name,word).then(word=>{
       io.emit('msg',(word));
   }).catch(e=>console.log(e));
})
});




