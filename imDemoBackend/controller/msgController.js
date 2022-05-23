/* 该文件封装聊天消息的所有操作 */
const service = require("../service/msg.js");

function saveMsg(msg,callback) {
    try{
        service.msgInsertAction(msg,callback);
    }catch(err){
        console.log('catch erro:', err);
        return { success: false, message: err };
    }
}
function getMsgList(condition,callback) {
    try{
        service.msgListGetAction(condition,callback);
    }catch(err){
        console.log('catch erro:', err);
        return { success: false, message: err };
    }
}
module.exports = {
    saveMsg,getMsgList
}