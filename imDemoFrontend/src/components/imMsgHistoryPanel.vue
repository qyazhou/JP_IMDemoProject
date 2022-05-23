<template>
  <div class="msgHistoryContainer">
    <div class="msgHistoryTitle">
      <span class="msgReceiverName">{{userInfo.name}}</span>
      <span class="msgHistoryName">聊天记录</span>
    </div>
    <!--
    <div class="list-group">
      <div v-for="(list, index) in msgHistoryList" :key="index">
        <div class="list-group-item">
          <img class= "msgIcon" :src="list.senderimg">
          <span class= "name">{{list.sender}}</span><span class="userListStatus">{{list.msg}}</span>
        </div>
      </div>
    </div>
    -->
    <div class="msgScrollZone">
    <table class="msgTable">
      <tbody class="msgTbody">
        <tr class="msgHistoryRow" v-for="(list, index) in msgHistoryList" :key="index">
          <td><img class= "msgIcon" :src="list.senderimg"></td>
          <td class="msgInfo">
            <tr class="nameRow">
              <span class= "name">{{list.sender}}</span>
            </tr>
            <tr class="contentRow">
              <span class="msgContent">{{list.msg}}</span>
            </tr>
          </td>
          <td class="timeRow">
            <span class="time">{{list.time}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="opZone">
      <button class="save" @click="saveMsgLocally()">保存记录</button>
    </div>
  </div>
  
</template>

<script>
import store from "../store/index";
export default {
  data() {
    return {
      msgHistoryList: []
    };
  },
  methods: {
    subscribeMsgHistory() {
      this.sockets.subscribe("updateMsgHistory", (mes) => {
        console.log('receive updateMsgHistory', mes)
        if (mes == null || mes.length === 0) {
          return
        }
        this.msgHistoryList = mes;
      })
    },
    getMsgHistory() {
      let data={
          sender:this.myInfo.name,//发送者id
          receiver: this.userInfo.name,//接收方id
        }
      this.$socket.emit('getMsgHistory',data);
    },
  },
  created() {
    this.subscribeMsgHistory();
  },
  mounted() {
    this.subscribeMsgHistory();
    this.getMsgHistory();
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
  beforeDestroy() {
    console.log('beforeDestroy')
    this.sockets.unsubscribe('updateMsgHistory'); 
  },
};
</script>
<style scoped>
.msgHistoryContainer {
  width: 100%;
}
.msgHistoryTitle {
  width: 100%;
  height: 100%;
  align-items: left;
}
.msgReceiverName {
  position: relative;
  display:inline;
  top: 6px;
  margin-left: -133px;
}
.msgHistoryName {
  position: relative;
  display: inline;
  top: 6px;
  left: 40px;
  justify-content: center;
  align-items: center;
}
.list-group {
  padding-top: 16px;
}
.list-group-item {
  height: 40px;
  padding-top: 2px;
  text-align: left;
  margin-left: -25px;
  margin-right: -10px;
}
.list-group-item-text {
  height: 10px;
}
.msgIcon {
  width: 40px;
  border-radius: 5px;
}
.name {
  font-size: 16px;
}
.msgTable {
  width: 100%;
  margin-left: 0px;
}
.msgTbody {
  width: 100%;
}
.msgScrollZone {
  width: 114%;
  height: 530px;
  margin-top: 14px;
  margin-left: -22px;
  background-color: #e9e9ec;
  overflow-x:auto;
}
.msgInfo {
  text-align: left;
  vertical-align: top;
  width: 100%;
}
.msgContent {
  font-size: 3px;
  width: 100%;
  white-space: normal;
  word-wrap: break-word;
}
.msgHistoryRow {
  width: 100%;
  right: 0px;
  margin-right: 0px;
}
.timeRow {
  width: 30px;
  right: 0px;
  margin-right: 0px;
}
.time {
  font-size: 1px;
  right: 0px;
}
.save {
  position: absolute;
  bottom: 4px;
  left: -10px;
  width: 103%;
  border: 2.5px solid rgb(152, 151, 151);
}
</style>