const socket=io();


const chainForm=document.getElementById('chain-form');
const labelWord=document.getElementById('word')
const alertMsg=document.getElementById('alert-msg');
const onlineUsers=document.getElementById('online-users');
const timerValue=document.getElementById('timer');

if(window.history.replaceState){
    window.history.replaceState(null,null,window.location.href)
}
chainForm.addEventListener('submit',(e)=>{
    e.preventDefault();
   
    const word=e.target.inputWord.value;
    socket.emit('word',(word));
    e.target.inputWord.value=''
})

socket.on('msg',(word)=>{
labelWord.innerText=word;
})

socket.on('alert',(name)=>{
alertMsg.innerText=`${name} has left the game`
setTimeout(()=>alertMsg.innerText='',2000);
})

socket.on('activeUsers',(users)=>{
onlineUsers.innerHTML=users.map(user=>`<li><i class="fas fa-user"></i>${user.name}(${user.score})</li>`).join('')
})

let start=true;
socket.on('timer',(timer)=>{
    if(start){
        setTimer (timer);
        start=false;
    }

})

function setTimer(timer){
    const interval=setInterval(()=>{
        timerValue.style.visibility='unset';
        timer=timer-1;
        timerValue.innerText=timer;
        if(timer===0){
            clearInterval(interval);
            timerValue.style.visibility='hidden';
            socket.emit('done')
            start=true;
        }

    },1000)
}
