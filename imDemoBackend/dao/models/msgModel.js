var mongoose=require('../db.js');
 
var MsgSchema=mongoose.Schema({
    type:String,
    sender:String,
    senderimg:String,
    receiver:String,
    time:String, //发送时间
    msg:String
},
{
    //设置时间戳
    timestamps: true
})
module.exports=mongoose.model('Msg',MsgSchema,'msg');