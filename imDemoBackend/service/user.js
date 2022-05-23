const UserModel = require("../dao/models/userModel.js");
class User{
    getUserInfoAction(user,callback){
        try{
            UserModel.findOne({name: user.name}, function(err,ret){
                if(err){
                    console.log('查询失败')
                    callback(err)
                }else{
                    console.log('查询成功ret:', ret,'user:', user)
                }
            });
        }catch(err){
            console.log('getUserInfo catch erro:', err);
        }
    }
    userModifyAction(user,callback){
        try{
            UserModel.updateOne({ _id: user._id }, { status: user.status }, (err, docs) => {
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
    userLoginAction(user,callback){
        try{
            UserModel.findOne({name: user.name}, function(err,ret){
                if(err){
                    console.log('查询失败')
                    callback(false)
                }else{
                    console.log('查询成功ret:', ret,'user:', user)
                    if(ret==null){
                        new UserModel({
                            name :user.name,                     //用户账号
                            //userpwd: pwd,                     //密码
                            status: user.status,
                            icon: user.icon,                     //头像url
                            logindate : new Date()              //最近登录时间
                        }).save(function(err,ret){
                            if(err){
                                console.log('新增失败')
                                callback(false)
                            }else{
                                console.log('新增成功ret:', ret, user)
                                callback(true)
                            }
                        });
                    }else if(ret.status === '离线'){
                        var conditions = {name: user.name};
                        var updates = {$set: {status: user.status}};
                        UserModel.update(conditions, updates, function(err,ret){
                            if(err){
                                console.log('更新失败')
                                callback(false)
                            }else{
                                console.log('更新成功ret:', ret, user)
                                callback(true)
                            }
                        });
                    }else {
                        console.log('已经登录:', ret, user)
                        callback(false)  
                    }
                }
            });
        }catch(err){
            console.log('getUserInfo catch erro:', err);
        }
    }
    userListAction(callback){
        try{
            UserModel.find({}).then((res)=>{
                callback(res);
             });
        }catch(err){
            console.log('getUserInfo catch erro:', err);
        }
    }
}
module.exports = new User();