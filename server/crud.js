const {User,Status}=require('./db.js');
const words=require('an-array-of-english-words')

async function createUser(name){
     const user=new User({name})
     return await user.save();
}

async function updateStatus(name,word){
  console.log(words);
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
module.exports={
    createUser,
    updateStatus

 } 