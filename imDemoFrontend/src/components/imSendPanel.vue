<template>
  <div class="msgSendZone">
    <input class="msgInput" placeholder="请输入内容" v-model="input" @keyup.enter="send"/>
    <button class="sendButton" @click="send"> &nbsp;发送&nbsp;</button>
  </div>
</template>

<script>
import store from '../store/index'
export default {
  data() {
    return {
      input:'',
    }
  },
  methods: {
    send(){
      var time = new Date();
      console.log('send msg,chatType:', this.chatType, this.myInfo)
      /* 发送消息 */
      /* 先判断是群聊还是私聊 */
      if(this.chatType=='group'){
         let data={
            type:'my',
            sender:this.myInfo.name,//发送者id
            senderimg:this.myInfo.icon,//发送者的img
            receiver: '聊天室',//接收方id
            time:time.toLocaleString( ),//发送时间
            msg: this.input,//消息内容
        }
        this.$socket.emit('groupChat',data);
        /* 自己的信息直接push到数组中 */
        store.commit('SOCKET_updateChatMessageList',data);
      }else{
         let data={
            type:'my',
            sender:this.myInfo.name,//发送者id
            senderimg:this.myInfo.icon,//发送者的img
            receiver:this.userInfo.name,//接收方id
            time:time.toLocaleString( ),//发送时间
            msg: this.input,//消息内容
        }
        this.$socket.emit('privateChat',data);
        /* 自己的信息直接push到数组中 */
        store.commit('SOCKET_updateChatMessageList',data);
      }
      /* 清空输入框 */
      this.input='';
    }
  },
  computed:{
    myInfo(){
      return store.state.myInfo;
    },
    chatType(){
      return store.state.chatType;
    },
    userInfo(){
      return store.state.userInfo;
    },
  },
};
</script>

<style>
.msgInput {
  position: absolute;
  text-align: left;
  bottom: 4px;
  left: 0px;
	float: left;
  width: 94%;
}
.sendButton {
  position: absolute;
  bottom: 4px;
  right: 6px;
	float: left;
  border: 2.5px solid rgb(152, 151, 151);
}
</style>