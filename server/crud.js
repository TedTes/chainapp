const {User,Status}=require('./db.js');
const words=require('an-array-of-english-words')

async function createUser(name){
     const user=new User({name})
     return await user.save();
}

async function updateStatus(name,word){
if(words.indexOf(word)===-1) return 'INVALID_WORD'

const status=await Status.findOne({})
if(status===null){
  await Status.create({'currWord':word})
  return word;
}
else if(status.currWord===word || status.usedWords.indexOf(word)!==-1) return 'USED_WORD';
else if(status.currWord.substr(-1)!==word.substr(0,1)) return 'NOT_CHAINED';

else{
  await Status.updateOne({'currWord':status.currWord},{$set:{'currWord':word},$push:{usedWords:status.currWord}})
  await User.updateOne({'name':name},{$inc:{score:1}})
  return word;
}
}

async function getOnlineUsers(){
  const users=await User.find({});
  return users;
}
async function getCurrentWord(name){
const status=await Status.findOne({})
if(status!==null)return status.currWord;
const word=words[Math.floor(Math.random()*words.length)];
return updateStatus(name,word);
}
async function resetScore(name){
await User.updateOne({'name':name},{$set:{score:0}})
}
async function resetGame(){
  await User.deleteMany({});
  await Status.deleteMany({})
}
async function removeUser(name){
  return await User.deleteOne({'name':name})
}
module.exports={
    createUser,
    updateStatus,
    removeUser,
    resetScore,
    resetGame,
    getOnlineUsers,
    getCurrentWord

 } 