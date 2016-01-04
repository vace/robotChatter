'use strict'
require('./assets/base.css');
require('./assets/font/font.css');

//引入头像资源


var Vue = require('vue')
var App = require('./app.vue')

new Vue({
  el: 'body',
  components: {
    app: App
  }
})
