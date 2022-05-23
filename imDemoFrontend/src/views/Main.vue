
<template>
  <div class="container">
    <div class="row" id="mainFrame">
      <div class="col-md-3" style="background-color: #c1c1c4;">
        <im-user-panel @show="setMsgHistoryShow" />
      </div>
      <div class="col-md-9" id="chatZone" style="background-color: #c1c1c4;">
        <div class="row name">
          <span class="titleName" v-if="userInfo.name=='聊天室' || userInfo.name==''">聊天室: {{userList.length-1}}人</span>  
          <span class="titleName" v-else>{{userInfo.name}}</span>
           <i v-if="!showHistoryMsg" class="bi bi-chevron-right" @click="setMsgHistoryShow(true)"></i>
           <i v-else class="bi bi-chevron-left" @click="setMsgHistoryShow(false)"></i>
        </div>
        <div class="row msgRow">
          <im-msg-panel />
        </div>
        <div class="row" style="height:5%">
          <im-send-panel />
        </div>
      </div>
      <div class="col-md-3 msgHistory" v-if="showHistoryMsg" style="background-color: #c1c1c4;">
          <im-msg-history-panel />
      </div>
    </div>
  </div>  
</template>
<script>
import store from '../store/index'
import ImMsgPanel from "../components/imMsgPanel.vue";
import ImSendPanel from '../components/imSendPanel.vue';
import ImUserPanel from '../components/imUserPanel.vue';
import ImMsgHistoryPanel from "../components/imMsgHistoryPanel.vue";
export default {
  components: { ImMsgPanel, ImSendPanel, ImUserPanel, ImMsgHistoryPanel },
  data() {
    return {
      showHistoryMsg:false
    };
  },
  mounted() {
    store.commit('changeChatType','group');
    this.sockets.subscribe("login", (mes) => {
      let index=mes.findIndex(i=>i.name==this.myInfo.name);
      var myNewInfo = {}
      if(index!=-1){
        myNewInfo = mes[index];
      }
      console.log('client login msg:', myNewInfo)
      store.commit('setMyInfo',myNewInfo);
      store.commit('SOCKET_login',mes);
    })
  },
  computed:{
    userList(){
      return store.state.userList;
    },
    userInfo(){
      return store.state.userInfo;
    },
    myInfo(){
      return store.state.myInfo;
    }
  },
  methods: {
    setMsgHistoryShow(value) {
      this.showHistoryMsg = value;
      let chatZone = document.getElementById('chatZone')
      if(value) {
        chatZone.className = 'col-md-6';
      } else {
        chatZone.className = 'col-md-9';
      }
    }
  }
}
</script>
<style scoped>
[class*="col-"]{
  width: 100%;
  height: 100%;
  margin: 0px;
}
.container {
  height: 100%;
  min-height: 600px;
}
.name {
  height: 40px;
  text-align: center;
}
.msgRow {
  /*width: 869px;*/
  width: 103%;
  height: 87.5%;
  padding-right: 0px;
  overflow-x:auto;
  overflow-y:auto
}
.titleName {
  position: absolute;
  top: 10px;
  text-align: center;
  left: 45%;
}
.bi {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 15px;
  top: 10px;
}

#mainFrame {
  height: 600px;
  position:relative;
}
</style>

