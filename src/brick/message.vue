<template>
	<div class="box-bar">
        <div class="box-top">
            <div class="chat-title">多啦A梦的圈子 <small class="robot">{{inputing.name}} 输入中...</small></div>
            <div class="chat-operate">
                <a href="https://github.com/vace/robotChatter" title="访问源代码地址" class="iconfont">&#xe735;</a>
                <!-- <a class="iconfont">&#xe641;</a> -->
                <a href="http://www.5u55.cn/20151231-chat-with-robots.html" class="iconfont">&#xe647;</a>
            </div>
        </div>
        <div class="box-message" v-el:msgbox>
            <template v-for="mess in messages" track-by="id">
            <div v-if="mess.type===type.USER || mess.type===type.FACE" class="msg-box me">
                <div class="head">
                    <span class="time">{{mess.time}}</span>
                    <span class="nickname">{{mess.name}}</span>
                    <img class="sm-headimg" :src="mess.head" alt="">
                </div>
                <div class="content">
                    <i class="biu"></i>
                    {{mess.content}}
                </div>
            </div>

            <div v-if="mess.type===type.IMAGE" class="msg-box me">
                <div class="head">
                    <span class="time">{{mess.time}}</span>
                    <span class="nickname">{{mess.name}}</span>
                    <img class="sm-headimg" :src="mess.head" alt="">
                </div>
                <div class="content">
                    <i class="biu"></i>
                    {{{mess.content}}}
                </div>
            </div>

            <div v-if="mess.type===type.REBOT" class="msg-box you">
                <div class="head">
                    <img class="sm-headimg" :src="mess.head" alt="">
                     <span class="nickname">{{mess.name}}</span>
                     <span class="time">{{mess.time}}</span>
                </div>
                <div class="content">
                    <i class="biu"></i>
                    {{mess.content}}
                </div>
            </div>
            
            <div v-if="mess.type===type.NOTIFY" class="msg-box notify">
                <p>{{{mess.content}}}</p>
            </div>

            <div v-if="mess.type===type.SYSTEM" class="msg-box system">
                <p>{{{mess.content}}}</p>
            </div>



            </template>
        </div>
        <div class="box-send">
            <div class="tool-bar">
                <a @click="send(type.FACE)" class="iconfont">&#xe613;</a>
                <a @click="send(type.IMAGE)" class="iconfont">&#xe604;</a>
                <a @click="send(type.SHAKE)" class="iconfont">&#xe66c;</a>
                <a @click="send(type.SYSTEM)" class="iconfont">&#xe646;</a>
            </div>
            <div class="input">
                <textarea v-model="words" @keyup.enter="reply" placeholder="说点什么吧,按Enter发送消息"></textarea>
            </div>
        </div>
      </div>
</template>

<script>
    export default{
        props:['messages','type','inputing'],
        data:function(){
            return {
               words:''
            }
        },
        methods:{
            reply:function(){
                if(!this.words.length) return;
                // console.log(this.words);
                this.$dispatch('speak',this.words);
                this.words = '';
                this.scorllBottom();
            },
            send:function(type){
                this.$dispatch('send',type);
                this.scorllBottom();
            },


            scorllBottom:function(){
                var scroll = this.$els.msgbox ;
                this.$nextTick(()=>{
                    scroll.scrollTop = scroll.scrollHeight - scroll.clientHeight;
                });
            }
        }
    }
</script>

<style lang="less">
    .biu{
        width:0;
        height:0;
        display:inline-block;
        border:12px solid #D4EDF4;
        position:absolute;
        border-color: transparent transparent #D4EDF4 transparent;
        top:-24px;
    }
    .xs-head{
        width:16px;height:16px;border-radius: 12px;margin-right: 10px;
    }
    .msg-image{
        max-width: 400px;
        border-radius: 10px;
        box-shadow: 0 0 3px #ccc;
    }
    .box-bar{
        background-color: #eee;
        border-radius: 0 4px 4px 0;
        width: 660px;
        height:100%;
        margin-left: 300px; 
    }
    .box-top{
        height:80px;
        box-shadow: 0 1px 2px #ccc;
        display:flex;
        justify-content:space-between;
        align-content:center;
        align-items:center;
        .chat-title{
            margin-left: 20px;
            font-size: 20px;
        }
        .chat-operate{
            margin-right: 20px;
            .iconfont{
                font-size: 35px;
                color:#21b2dc;
                margin-right: 20px;
                line-height: 40px;
                font-weight: 400;
            }
        }
        .robot{
            margin:0 20px;
            color:#aaa;
        }
    }
    .box-message{
        height:470px;
        overflow:scroll;
        &::-webkit-scrollbar{
            display: none;
        }

    }
    

    .msg-box{
        &:first-child{
            margin-top: 10px;
        }
        margin-bottom: 10px;
        overflow: hidden;
        .head{
            margin: 0 20px 10px;
        }
        .time,.nickname{
            line-height: 32px;
        }
        .time{
            color:#999;
            padding: 0 10px;
        }
        .sm-headimg{
            width:30px;
            height:30px;
            border-radius: 100%;
            vertical-align: middle;
        }
        .content{
            display:inline-block;
            background-color:rgb(212,237,244);
            position: relative;
            padding:10px;
            line-height: 18px;
            border-radius: 4px;
            margin:0 20px;
            color:#333;
        }
    }
    

    .me{
        .head{
            display:flex;
            flex-direction:row;
            justify-content:flex-end;
            padding:5px;
        }
        .content{
            float:right;
            background-color:rgb(241,221,222);
        }
        .biu{
            border-color: transparent transparent #f1ddde transparent;
            right:10px;
        }
    }

    .system{
        text-align: center;
        color:#aaa;
    }
    .notify{
        text-align: left;
        width:90%;margin:5px auto;
        font-size: 10px;
        p{
            color:#fff;
            background-color: rgba(0,0,0,0.2);
            padding:5px 10px;
            border-radius: 5px; 
        }
        a{
            color:#555;margin-right: 10px;
        }
        
    }

    .tool-bar{
        height:40px;
        line-height: 40px;
        .iconfont{
            font-weight: 400;
            font-size: 23px;
            margin:3px 10px;
            color:#777;

        }
    }

    .box-send{
        height:150px;
        box-shadow: 0 -1px 2px #ccc;
        box-sizing: border-box;
    }
    .input{
        max-height:100%;
        height:110px;
        textarea{
            border:none;
            width:100%;
            height:100%;
            outline: none;
            padding:5px;
            box-sizing: border-box;
            background-color: #eee;
            resize: none;
            border-bottom-right-radius: 4px;
        }
    }
</style>