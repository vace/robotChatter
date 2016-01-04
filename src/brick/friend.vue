<template>
  <div class="friend-bar">
      <div class="head">
        <a title="添加讨论组成员" class="add-friend" @click.prevent="addNewUser">+</a>
        <span>讨论组成员 ( {{friends.length}} )</span>
      </div>
      <div class="list">
        <div class="item" v-for="friend in friends">
          <i @click="leave(friend.uid)" class="close">×</i>
          <img :src="friend.head" alt="" class="head-img">
          <span class="nickname">{{friend.name}}</span>
          <span class="msg-count">{{friend.count}}</span>
        </div>
      </div>
  </div>
</template>

<script>
  export default{
    props:['friends'],
    methods:{
      leave:function(uid){
        this.$dispatch('leave',uid);
      },
      addNewUser:function(){
        var name = prompt('请输入好友昵称');
        if(name){
          this.$dispatch('createRebot',name);
        }
      }
    },
    events:{
    }
  }
</script>
<style lang="less">
  .friend-bar{
    width:210px;
    height:100%;
    background-color: rgba(209,214,212,0.9);
    float: left;
    .head-img{
      width:50px;
      height:50px;
      background-color: #fff;
      border-radius: 100%;
      margin-right: 10px;
    }
    .head{
      height:80px;
      background-color: rgba(209,214,212,0.5);
      display:flex;
      justify-content:flex-start;
      align-content:center;
      align-items:center;
      box-shadow: 0 1px 3px #ccc;
      .add-friend{
        width:60px;height:60px;line-height: 60px;
        color:#fff;
        font-weight: bolder;
        font-size: 30px;text-align: center;
      }
    }
    .list{
      height:620px;
      overflow-x:hidden;
      overflow-y: scroll;
    }
    .item{
      padding: 10px 10px 10px 2px;
      display: flex;
      justify-content:flex-start;
      align-content:center;
      align-items:center;
      position: relative;
      transition: all 0.2s;
      .close{
        font-style: normal;font-size: 10px;
        margin-right: 2px;
         display:none;
        &:hover{
          border-radius: 100%;
          background-color: #ccc;
          color:#fff;

        }
      }
      span{
        line-height: 64px;
        font-size: 18px;
        font-weight:400;
      }
      .msg-count{
        position:absolute;
        right:5px;
        width: 30px;
        height:30px;
        background-color: rgb(245,98,90);
        border-radius: 100%;
        line-height: 34px;
        font-size: 10px;
        text-align: center;
        color:#fff;
        font-weight: bolder;
        top:25px;
      }

      &:hover{
        background-color: rgba(255,255,255,0.3);
        .head-img{
          transition: all 0.8s;
          transform: rotate(360deg);
        }
        .close{
          display:inline-block;
        }
      }

    }
  }
</style>