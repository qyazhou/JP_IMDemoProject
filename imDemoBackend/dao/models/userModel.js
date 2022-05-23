var mongoose=require('../db.js');
 
var UserSchema=mongoose.Schema({
    name:String,
    age:Number,
    // 指定默认参数
    status:String,
    icon:String
},
{
    //设置时间戳
    timestamps: true
})
module.exports=mongoose.model('User',UserSchema,'user');