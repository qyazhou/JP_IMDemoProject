<template>
  <div class="container1">
    <div class="myinfo">
      <img :src="myInfo.icon">
      <span>{{myInfo.name}}</span>
      <select class="userStatus" id="userStatus" @change="changeUserStatus($event)">
        <option value="在线">在线</option>
        <option value="忙碌">忙碌</option>
        <option value="休息">休息</option>
      </select>
    </div>
    <div class="memberInfo">
      <dl class="dl-horizontal" v-for="item of userList" :key="item.id" @click="setUserInfo(item)">
        <div v-if="item.name !== myInfo.name">
        <dt class="tipMark" :id="item.name"></dt>
        <dd><img class="headimg" :id="item.name" :src="item.icon"><span>{{item.name}}</span><span class="userListStatus">{{item.status}}</span></dd>
        </div>
      </dl>
    </div>
    <div class="logoutZone">
      <button class="logout" @click="logOut()">退出登录</button>
    </div>
  </div>
</template>

<script>
import store from '../store/index'
let _this = null
export default {
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    setUserInfo(row){
      if(row.name=='聊天室'){
        store.commit('changeChatType','group');
        let receiver = document.getElementById('聊天室')
        receiver.style.display = "none";
      }else{
        store.commit('changeChatType','private');
        let receiver = document.getElementById(row.name)
        receiver.style.display = "none";
      }
      this.setMsgHistoryShow(false)
      store.commit('setUserInfo',{name:row.name,img:row.img,status:row.status});
    },
    changeUserStatus(event) {
      this.myInfo.status = event.target.value
      console.log( "change status" + JSON.stringify(this.myInfo));
      this.$socket.emit("changeStatus", JSON.stringify(this.myInfo))
    },
    logOut() {
      this.myInfo.status = '离线'
      this.$socket.emit("changeStatus", JSON.stringify(this.myInfo))
      console.log( "logout" + JSON.stringify(this.myInfo));
      this.$router.push("/");
    },
    setMsgHistoryShow (value) {
      this.$emit('show', value);
    }
  },
  created() {
    _this = this
  },
  mounted() {
    this.sockets.subscribe("changeStatus", (mes) => {
      if (mes == null || mes.length === 0) {
        return
      }
      var userInfo = mes;
      console.log('userInfo', userInfo)
      if(userInfo == null || userInfo.length === 0) {
        return
      }
      let index = _this.userList.findIndex(i =>i.name === userInfo.name);
      if(index < 0) {
        console.log('index invalid', index)
        return
      }
      _this.userList[index].status = userInfo.status;
      console.log('this.userlist:', _this.userList)
      store.commit('SOCKET_login',_this.userList);
      if(userInfo._id === this.myInfo._id && userInfo.name === this.myInfo.name && userInfo.status === '离线') {
        this.logOut();
      }
    })
    this.sockets.subscribe("updateChatMessageList", (mes) => {
      console.log('receive updateChatMessageList', mes)
      if (mes == null || mes.length === 0) {
        return
      }
      var msgInfo = mes;
      if(msgInfo == null || msgInfo.length === 0) {
        return
      }
      //未读消息进行红点提示
      if (msgInfo.sender !== _this.userInfo.name && msgInfo.receiver !== '聊天室') {
        let sender = document.getElementById(msgInfo.sender)
        sender.style.display = "block";
      } else if(_this.userInfo.name !== '聊天室' && msgInfo.receiver === '聊天室') {
        let receiver = document.getElementById(msgInfo.receiver)
        receiver.style.display = "block";
      }
      //console.log('write msginfo:',msgInfo)
      //store.commit('SOCKET_updateChatMessageList',msgInfo);
    })
  },
  computed:{
    userList(){
      return store.state.userList;
    },
    myInfo(){
      return store.state.myInfo;
    },
    userInfo(){
      return store.state.userInfo;
    }
  },
  beforeDestroy() {
      this.logOut()
      this.sockets.unsubscribe('changeStatus');
      this.sockets.unsubscribe('updateChatMessageList'); 
      this.$socket.close();
  },
};
</script>
<style scoped>
.container1 {
  width: 100%;
  margin-left: 0px;
  padding-left: 0px;
  background-color: #c1c1c4;
}
.myinfo{
  text-align: left;
  vertical-align: middle;
  margin-top: 10px;
  margin-left: 0px;
  border-bottom: 1px solid #000;
}
.userStatus{
  background-color: #c1c1c4;
  margin-left: 36px;
  border: 0px;
  width: 60px;
}
.memberInfo{
  text-align: left;
  vertical-align: middle;
  margin-top: 10px;
  margin-left: 10px;
  height: 470px;
  width: 100%;
  overflow-y:auto;
}
.myinfo span{
  text-align: left;
  vertical-align: middle;
  margin-left: 10px;
}
.userlist{
  vertical-align: middle;
  cursor: pointer;
}
.userlist span{
  vertical-align: middle;
  margin-left: 10px;
}
.tipMark {
    display: none;
    background-color: red;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    top: 6px;
    left: 40px;
    position: relative;
}
.myinfo img {
    width: 70px;
    border-radius: 50px;
}
.memberInfo img {
    width: 35px;
    border-radius: 5px;
}

.userListStatus {
  font-size: 3px;
  right: 8px;
  float:right;
  text-align: right;
  position: relative;
}
.logout {
  position: absolute;
  text-align: center;
  bottom: 4px;
  left: 0px;
	float: left;
  width: 100%;
  border: 2.5px solid rgb(152, 151, 151);
}
</style>