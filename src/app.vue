<template>
  <div class="container">
    <div class="chat-app">
      <status-box :user="user"></status-box>
      <friend-box :friends="friends"></friend-box>
      <message-box :inputing="inputing" :messages="messages" :type="message_type"></message-box>
    </div>
  </div>
    
</template>

<script>
import {Message,MSG_TYPE} from './model/message.ts'
import FriendBox from './brick/friend.vue'
import MessageBox from './brick/message.vue'
import statusBox from './brick/status.vue'

var messageControl = new Message();

//创建自己
var me = Message.markUser();
//创建三名机器人
var robots = [
  Message.markRebot('哆啦A梦'),
  Message.markRebot('野比大雄'),
  Message.markRebot('源静香'),
  Message.markRebot('骨川小夫')
];

//开场白
let randomSay = ['大河向东流啊，姑娘你单身何时休啊','你是风儿我是沙','神仙姐姐，我找你找的好苦','如何评价我这句开场白','你吃饭了没','小生这厢有礼了.','同志们辛苦了','初次见面，请多多关照！','上网新手，请多多关照。','有缘网上来相会'];

me.speak(randomSay[ Math.floor(Math.random() * randomSay.length) ]);

export default {
  data () {
    return {
      user:me.user,
      talker:false,
      friends: Message.friends,
      messages:Message.messages,
      message_type:MSG_TYPE,
      inputing:Message.inpitingUserInfo
    }
  },
  events:{
    speak:function(msg){
      me.speak(msg);
    },
    send:function(type){
      me.send(type);
      //加个抖动窗口动画,TODO
      if(type === MSG_TYPE.SHAKE){

      }
    },
    leave:function(uid){
      Message.leaveRebot(uid);
    },
    /**
     * [createRebot 创建一个新的机器人]
     * @param  {[type]} name [好友名称]
     * @return {[type]}      [description]
     */
    createRebot:function(name){
      Message.markRebot(name);
    }
  },
  components: {
    FriendBox,
    MessageBox,
    statusBox
  }
}
</script>

<style lang="less">
  body{

  }
  .container{
    width:100%;height: 100%;
    background:#fff url(./assets/backgroud.jpg) no-repeat 100% 100%;
    background-size:100% 100%;
    box-sizing: border-box;
  }
  .chat-app{
    width: 960px;
    height:700px;
    // border:1px solid rgba(255,255,255,0.4);
    border-radius: 4px;
    margin: 0 auto;
    top:0px;
    position: relative;
    // background-color: #eee;
  }
</style>
