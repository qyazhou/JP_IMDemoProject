
<template>
  <div class="login" id="login">
    <div class="alert" v-show="alter.isShow" :class="alter.color" role="alert">{{alter.Info}}</div>
    <img src="/static/images/Hi.png"/>
    <div><label>欢迎使用在线聊天工具</label></div>
    <div class="Row">
      <input type="text" class="form-control" v-model="userInfo.name" id="oName" placeholder="请输入用户名">
    </div>
    <div class="Row">
      <label>请选择您的头像</label>
    </div>
    <div class="Row">
      <img v-for="(image,index) of images" :key="index" :class="image['class']" :src="image['src']"
        @click="changeImgColor(index)" class="rounded float-start images">
      </div>
    <div class="Row">
      <button type="button" @click="login" class="btn btn-primary">登录</button>
    </div>
    <div class="Row">
      <label>在线聊天工具的第一个demo版本不需要密码</label>
    </div>
  </div>
</template>
<script>
import store from '../store/index.js'
export default {
  data() {
    return {
      images: [{
          src: "/static/images/head-1.jpg",
          class: 'active'
        },
        {
          src: "/static/images/head-2.jpg",
          class: 'unActive'
        },
        {
          src: "/static/images/head-3.jpg",
          class: 'unActive'
        },
        {
          src: "/static/images/head-4.jpg",
          class: 'unActive'
        }
      ],
      userInfo: {
        name: '',
                icon: "/static/images/head-1.jpg",
                id: '',
                status: '',
                onLine: false,
                isInit: true,
                msgList: []
            },
            receiverInfo: {},
            alter: {
                isShow: false,
                color: 'alert-info',
                Info: '登录成功！',
            },
            allMessage: [],
            myPointMessage: [],
            socket: null,
            main: true,
            privateMode: false,
            userList: [],
            currentChatName: "",
            message: "",

        };
  },
  methods: {
        msgTips(mes, type, time = 1500) {
            let {
                isShow,
                color,
                Info
            } = this.alter;
            Info = mes;
            color = type
            isShow = true;
            this.alter = {
                isShow,
                color,
                Info
            }
            setTimeout(() => {
                isShow = false;
                this.alter = {
                    isShow: false,
                    color: 'success',
                    Info: ''
                }
            }, time)
        },
        login() {
            if (this.userInfo.name == "") {
                this.msgTips("请输入名字 ", "alert-danger");
                return;
            }
            this.$socket.emit('login',{name: this.userInfo.name,icon: this.userInfo.icon},(result)=>{
            if(result){
              /* 登录成功的情况下，才修改vuex的数据 */
              this.msgTips("登录成功！", "alert-danger");
              /* 告诉vuex修改个人信息 */
              store.commit('setMyInfo',{
                icon: this.userInfo.icon,
                name: this.userInfo.name,
                status: '在线'
              });
              store.commit('setUserInfo',{name:'聊天室',icon:'https://pic1.zhimg.com/50/v2-adfacac8307b48531d4e341a6090aa03_hd.jpg?source=1940ef5c',status:'在线'});
              this.$router.push("/main");
            }else{
              /* 失败，给出提示！ */
              this.msgTips("登录失败，该用户已经登录！", "alert-danger");
            }
          });
        },
        changeImgColor(i) {
            const newImages = this.images.map(image => {
                image.class = "unActive";
                return image
            })
            newImages[i]["class"] = "active"
            this.images = newImages;
            this.userInfo.icon = newImages[i]["src"];
        }
    },
    mounted() {
      this.$socket.open();
    }
}
</script>

<style scoped>
.form-control {
    display: inline;
}
#oName {
    width: 280px;
}
.login {
  margin-top: -50px;
}
.Row {
    width: 100%;
    height: 70px;
    line-height: 80px;
    border: 1px solid transparent;
}

.Row img {
    height: 60px;
    margin: 0 12px;
}

.active {
    border: 2px solid rgb(101, 115, 248);
}

.unActive {
    border: 1px solid #ddd;
}
</style>
