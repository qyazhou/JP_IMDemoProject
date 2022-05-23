<template>
  <div class="div1">
    <!-- 先循环找到你想要聊天的那个人 -->
    <div v-for="(list, index) in msgList" :key="index">
      <!-- 有聊天记录：循环聊天记录 -->
      <div v-if="(list.receiver == userInfo.name) && userInfo.name=='聊天室'">
        <!-- 再循环显示聊天记录 --> 
        <p class='right' v-if="list.type=='my'">
          <span class="content">{{list.msg}}</span>
          <span class="myMessageName">{{list.sender}}</span>
          <img class="userAvatarImg" v-if="list.type=='user'" :src="list.senderimg">
          <img class="avatarImg" v-if="list.type=='my'" :src="list.senderimg" >
        </p>
        <p class='left' v-else>
          <img class="userAvatarImg" v-if="list.type=='user'" :src="list.senderimg">
          <img class="avatarImg" v-if="list.type=='my'" :src="list.senderimg" >
          <span class="myMessageName">{{list.sender}}</span>
          <span class="content">{{list.msg}}</span>
        </p>
      </div>
      <div v-else>
        <!-- 根据接收者和发送者定位聊天记录 -->
        <div v-if="((list.receiver == myInfo.name) && (list.sender==userInfo.name)) || ((list.receiver==userInfo.name) && (list.sender==myInfo.name))">
            <!-- 再循环显示聊天记录 --> 
          <p class='right' v-if="list.type=='my'">
            <span class="content">{{list.msg}}</span>
            <img class="userAvatarImg" v-if="list.type=='user'" :src="list.senderimg">
            <img class="avatarImg" v-if="list.type=='my'" :src="list.senderimg" >
          </p>
          <p class='left' v-else>
            <img class="userAvatarImg" v-if="list.type=='user'" :src="list.senderimg">
            <img class="avatarImg" v-if="list.type=='my'" :src="list.senderimg" >
            <span class="content">{{list.msg}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/index";
export default {
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
  },
  computed:{
    msgList(){
      return store.state.chatMessageList;
    },
    myInfo(){
      return store.state.myInfo;
    },
    userInfo(){
      return store.state.userInfo;
    }
  },
};
</script>
<style scoped>
.div1 {
  width: 100%;
  background-color: rgb(241, 240, 238);
}
.content{
background-color: antiquewhite;
padding: 5px;
border-radius: 10px;
font-weight: bold;
white-space: normal;
word-wrap: break-word;
}
.right{
  text-align: right;
}
.left{
  text-align: left;
}
.chatImg {
  width: 35px;
  border-radius: 5px;
}
.userAvatarImg{
  cursor: pointer;
  width: 35px;
  border-radius: 5px;
  margin-right: 5px;
}
.avatarImg{
  cursor: pointer;
  width: 35px;
  border-radius: 5px;
  margin-left: 5px;
}
.myMessageName,
.otherMessageName {
    position: relative;
    top: -5px;
    height: 25px;
    padding: 0px;
}
</style>