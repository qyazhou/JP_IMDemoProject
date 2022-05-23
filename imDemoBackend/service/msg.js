/* 消息处理的底层实现操作 */
const MsgModel = require("../dao/models/msgModel.js");
class Msg{
    msgGetAction(msg,callback){
        try{
            MsgModel.findOne({msg: msg.msg}, function(err,ret){
                if(err){
                    console.log('查询失败')
                    callback(err)
                }else{
                    console.log('查询成功ret:', ret,'Msg:', msg)
                }
            });
        }catch(err){
            console.log('getMsgInfo catch erro:', err);
        }
    }
    msgModifyAction(msg,callback){
        try{
            MsgModel.updateOne({ _id: msg._id }, { msg: msg.msg }, (err, docs) => {
                if (err) {
                  console.log('修改数据错误', err);
                  callback(false,err)
                  return;
                }
                console.log(docs)
                if(docs.modifiedCount > 0) {
                    callback(true,docs)
                }
              })
        }catch(err){
            console.log('catch erro:', err);
            return { success: false, message: "修改错误" };
        }
    }
    msgInsertAction(msg,callback){
        try{
            new MsgModel({
                type : msg.type,                
                sender: msg.sender,
                senderimg: msg.senderimg,
                receiver: msg.receiver,
                time: msg.time,
                msg: msg.msg
            }).save(function(err,ret){
                if(err){
                    console.log('新增聊天消息失败')
                    callback(false)
                }else{
                    console.log('新增聊天消息成功ret:', ret, msg)
                    callback(true)
                }
            });
        }catch(err){
            console.log('getMsgInfo catch erro:', err);
        }
    }
    msgListGetAction(condition,callback){
        try{
            console.log('condition:', condition)
            MsgModel.find(condition).then((docs,err)=>{
                console.log('docs:',docs,'err:',err)
                callback(docs,err);
             });
        }catch(err){
            console.log('getMsgInfo catch erro:', err);
        }
    }
}
module.exports = new Msg();