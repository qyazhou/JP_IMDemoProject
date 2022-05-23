/* 该文件封装聊天用户的所有操作 */
const service = require("../service/user.js");

function login(user,callback) {
    try{
        service.userLoginAction(user,callback);
    }catch(err){
        console.log('catch erro:', err);
        return { success: false, message: err };
    }
}
function getUserList(callback) {
    try{
        service.userListAction(callback);
    }catch(err){
        console.log('catch erro:', err);
        return { success: false, message: err };
    }
}
function modifyUserInfo(user,callback) {
    try{
        service.userModifyAction(user,callback);
    }catch(err){
        console.log('catch erro:', err);
        return { success: false, message: err };
    }
}
module.exports = {
    login,getUserList,modifyUserInfo
}