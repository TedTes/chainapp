const socket=io();


const chainForm=document.getElementById('chain-form');
const labelWord=document.getElementById('word')

chainForm.addEventListener('submit',(e)=>{
    e.preventDefault();
   
    const word=e.target.inputWord.value;
    socket.emit('word',(word));
    e.target.inputWord.value=''
})

socket.on('msg',(word)=>{
labelWord.innerText=word;
})