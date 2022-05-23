var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    allowEIO3: true,
    cors: {
        origin: "http://localhost:8081",
        //origin: "http://192.168.1.103:8081",
        methods: ["GET", "POST"],
        credentials: true
    }
});

var {saveMsg,getMsgList} = require("./controller/msgController.js");
var {login,getUserList,modifyUserInfo} = require("./controller/userController.js");

var userList=[{
    status:'',
    name:'聊天室',
    icon:'https://pic1.zhimg.com/50/v2-adfacac8307b48531d4e341a6090aa03_hd.jpg?source=1940ef5c'
}];  

io.on('connect', function (socket) {
    
    /* 监听用户登录事件,并将数据放到socket实例的属性上 */
    socket.on('login',(data,callback)=>{
        /* 遍历服务器连接对象 */
        var islogin=false;
        io.sockets.sockets.forEach(iss => {
            console.log('socket iss name:', iss.name)
            if(iss.name==data.name){
                islogin=true;
            }
        });
        if(!islogin){
            data.status='在线';
            login(data,function(res){
                if(!res){
                    console.log('用户登录失败！：',data);
                    callback(false);
                    return;
                }
                getUserList(function(res){
                    console.log('get userlist:', res)
                    userList = res;
                    socket.name=data.name;
                    callback(true);
                    io.emit('login',userList);
                })
            })
        }else{
            console.log('用户登录失败！：',data);
            callback(false);
        }
    });

   /* 获取用户列表 */
    socket.on('getUserList',data=>{
        io.sockets.sockets.forEach(iss=>{
            if(iss.name==data.receiver){
                data.type='user';
                console.log("转发私人消息:", data, 'to:', iss.id);
                io.to(iss.id).emit('updateChatMessageList',data);
            }
        });
    });
    /* 监听用户改变状态事件 */
    socket.on('changeStatus',data=>{
        // 发送给所有客户端，除了发送者
        /* 修改源数据的属性 */
        data = JSON.parse(data);
        modifyUserInfo(data,function(err,res){
            if(!err){
                console.log('用户修改状态失败！：',err);
                return;
            }
            /* 通知前端 */
            data.type='user';
            console.log('receive changeStatus logout info：',data);
            socket.broadcast.emit('changeStatus',data);
        })
    });
    /* 监听群聊事件 */
    socket.on('groupChat',data=>{
        // 发送给所有客户端，除了发送者
        /* 修改源数据的属性 */
        data.type='user';
        console.log('receive group chat info：',data);
        saveMsg(data,function(err,res){
            if(!err){
                console.log('消息状态保存失败！：',err);
                return;
            }
            /* 通知前端 */
            socket.broadcast.emit('updateChatMessageList',data);
        })
    });

    /* 监听私聊事件 */
    socket.on('privateChat',data=>{
        /* 找到对应的私聊对象 */
        console.log('receive private chat info：',data);
        saveMsg(data,function(err,res){
            if(!err){
                console.log('消息状态保存失败！：',err);
                return;
            }
            /* 通知前端 */
            console.log("开始通知前端");
            io.sockets.sockets.forEach(iss=>{
                if(iss.name==data.receiver){
                    data.type='user';
                    console.log("转发私人消息:", data, 'to:', iss.id);
                    io.to(iss.id).emit('updateChatMessageList',data);
                }
            });
        })
    });

    /* 历史消息查询 */
    socket.on('getMsgHistory',data=>{
        console.log('receive getMsgHistory info：',data);
        var condition = {};
        if(data.receiver == '聊天室') {
            condition.receiver = data.receiver;
        } else {
            condition = {$or:[{ sender: data.sender, receiver: data.receiver}, { sender: data.receiver, receiver: data.sender }]};
        }
        console.log('condition：',condition);
        getMsgList(condition,function(res,err){
            if(err){
                console.log('消息记录查询失败！：',err);
                return;
            }
            /* 通知前端 */
            io.sockets.sockets.forEach(iss=>{
                if(iss.name == data.sender){
                    console.log("转发updateMsgHistory消息:", res, 'to:', iss.id);
                    io.to(iss.id).emit('updateMsgHistory',res);
                } else {
                    console.log("iss.name:", iss.name, 'data.sender:', data.sender);
                }
            });
        })
    });

    /* 用户退出 */
    socket.on('logout',data=>{
        data = JSON.parse(data);
        modifyUserInfo(data,function(err,res){
            if(!err){
                console.log('用户修改状态失败！：',err);
                return;
            }
            /* 通知前端 */
            data.type='user';
            console.log('receive changeStatus logout info：',data);
            socket.broadcast.emit('changeStatus',data);
        })
    });

    /* 用户掉线 */
    socket.on('disconnect',()=>{
        console.log('disconnect envent received');
        let index = userList.findIndex(i=>i.name == socket.name);
        var data = {}
        if(index != -1) {
            data = userList[index];
            data.status = '离线';
            modifyUserInfo(data,function(err,res){
                if(!err){
                    console.log('用户修改状态失败！：',err);
                    return;
                }
                /* 通知前端 */
                data.type='system';
                console.log('receive disconnect logout info：',data);
                socket.broadcast.emit('changeStatus',data);
            })
        } else {
            console.log('unknow user：',socket.name, userList);
        }
    });
});
/*
http.on('request',function (req,res) {
    console.log(req.url + req.method);
})
*/
http.listen(3000, function () {
    console.log('listening on *:3000');
});
