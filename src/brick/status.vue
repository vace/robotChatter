<template>
	<div class="left-bar">
        <div class="row-ctrl">
          <span class="close"></span>
          <span class="minimize"></span>
          <span class="magnify"></span>
        </div>
        
        <div class="head-ctrl">
          <img :src="user.head" alt="">

          <div class="status">
            <span></span>
          </div>
        </div>

      </div>
</template>

<script>
  export default{
    props:['user']
  }
</script>
<style lang="less">
	.left-bar{
    float:left;
    width:90px;
    background-color: rgb(33,178,220);
    height:100%;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .row-ctrl{
    height:36px;
    line-height: 36px;
    text-align: center;
    span{
      height:16px;
      width:16px;
      display: inline-block;
      border-radius: 100%;
      margin:10px 4px;
      box-shadow: 0 0 5px rgba(0,0,0,0.1);
    }
    .close{
      background-color: rgb(257,98,92);
    }
    .minimize{
      background-color: rgb(253,188,65);
    }
    .magnify{
      background-color: rgb(52,201,74);
    }
  }

  .head-ctrl{
    text-align: center;
    margin-top: 30px;
    img{
      width:60px;
      height:60px;
      border-radius: 100%;
      border:1px solid rgb(94,198,227);
      background-color: #fff;
    }

    .status{
      margin-top: 20px;
      display:block;
      span{
        width:12px;height:12px;
        display:inline-block;
        background-color: rgb(113,227,73);
        border-radius: 100%;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
      }
    }
  }
</style>