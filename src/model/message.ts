// module Message{
let KEYS = '267c28b2e8bd9c90604b1e8eda3b716f,bb30a49f87c6bc07c23da70f70669af1,b5d8399fcb182eaabdd9b39c8937e821'.split(',');

let NOW_USED = KEYS[Math.floor(Math.random() * KEYS.length)];

	export class Message{
		public static messages: MessageContent[] = [];

		public static friends: UserStruct[] = [];

		public static friendModel: Rebot[] = [];

		//正在输入的机器人
		public static inputingUser: Rebot;

		public static inpitingUsername: string;

		public static msgid: number = Date.now();

		private static _instance:Message;

		public static get instance():Message{
			if(!(Message._instance instanceof Message)){
				Message._instance = new Message();
			}
			return Message._instance;
		}

		private _nextreply: number = -1;
		private _replyinterval: number = 3000;
		private _intvalid: number;

		public constructor(){
			this._intvalid = setInterval(() => {
				var _time: number = Date.now();
				if (this._nextreply >= 0 && this._nextreply < _time) {
					//触发回复消息
					this.robotReply();
					//设置下次交流时间
					this._nextreply = _time + this._replyinterval;
				}
			},200);
		}

		//设置当前回复周期为下一个周期
		public setIntervalNext(){
			//切换回复人
			let input = Message.inputingUser;
			let robots = Message.friendModel;
			let index = -1;
			if (input) {
				//找到当前发言人索引
				index = robots.indexOf(input);
			}
			var shuffle:number[] = [];
			for (var i = 0; i < robots.length;i++){
				if (i !== index) shuffle.push(i);
			}

			shuffle.sort(function(){
				return Math.random() < 0.5 ? 1 : -1;
			});

			Message.inputingUser = robots[shuffle[0]];
			Message.inpitingUsername = Message.inputingUser.user.name;
			this._nextreply = Date.now() + this._replyinterval;
		}

		/**
		 * [_repeatTime 机器回复重复语句次数]
		 * @type {number}
		 */
		private _repeatTime: number = 0;
		//机器人回复
		protected robotReply(){
			if (!Message.inputingUser){
				return false;
			}
			// return false;

			var robot = Message.inputingUser;
			let content: string;
			let lastmsg:string = Message.messages[Message.messages.length-1].content;

			var key = NOW_USED;

			this.http({ key, lastmsg },(data)=>{
				console.log(data);
				if (data.code === 100000 || data.code === 40002) {
					content = data.text;
				} else if (data.code === 200000){
					content = '<a href="'+data.url+'">'+data.text+'</a>';
				}else{
					//TODO 解析更多消息类型
					content = '----- 暂不支持解析此消息 -----';
				}
				//用户昵称替换
				content = content.replace(/__NAME__/g, robot.user.name);

				var isRepeat = false;
				//如果上一句话===回复的话可能进入死循环了,转移话题
				if (content === lastmsg){
					//如果大于三次,切开话题
					if(++this._repeatTime > 2){
						this._repeatTime = 0;
						isRepeat = true;
						
					}
				}
				//竟然在重复,需要我打乱他们的谈话
				if(isRepeat){
					content = Message.randomSpeek;
					User.getInstance().speak(content);
				}else{
					robot.speak(content);
				}
				
			});
		}

		public static markUser():User{

			return User.getInstance();
		}

		//每1s随机选择当前机器人以外的机器人回复上一条消息


		public static markRebot(robotName:string):Rebot{

			var robot = new Rebot(robotName); //RebotPool.create(robotName);

			Message.friends.push(robot.user);
			Message.friendModel.push(robot);

			robot.enter();
			return robot;
		}

		public static leaveRebot(robotUid:number){
			var friends = Message.friends;
			let removeid;
			for (let i = 0, _len = friends.length; i < _len;i++){
				if(friends[i].uid === robotUid){
					removeid = i;
					break;
				}
			}

			if(removeid > -1){
				friends.splice(removeid, 1);
				Message.friendModel[removeid].leave();
				Message.friendModel.splice(removeid, 1);
			}
		}

		public http({key, lastmsg}, onload): XMLHttpRequest {
			var xhr = new XMLHttpRequest();
			
			var fd = [];
			fd.push('userid=' + Message.msgid);
			fd.push('key='+ key);
			fd.push('info='+ encodeURIComponent( lastmsg) );


			xhr.open('GET', 'http://www.tuling123.com/openapi/api?' + fd.join('&'));
			xhr.onload = function(e){
				console.log(xhr)
				onload(xhr.response)
			};
			
			xhr.send(null);
			xhr.responseType = 'json';
			return xhr;
		}

		private static _randomStr:string[] = [
			'世界那么大能认识你，我觉得好不幸', 
			'每当半夜的时候，打电话叫谁起床上厕所是一个很纠结的问题。',
			'我5分钟还没回消息，请再读一遍此消息.',
			'水清则无鱼，人贱则无敌。',
			'你没有猪的形象，但是你有猪的气质。',
			'没有嫁不到男人的女人，只有娶不到女人的男人。', 
			'大河向东流啊，姑娘你单身何时休啊',
			'神仙姐姐，我找你找的好苦',
			'如何评价我这句开场白',
			'你吃饭了没', 
			'小生这厢有礼了.', 
			'同志们辛苦了', 
			'上网新手，请多多关照。', 
			'有缘网上来相会'
		];
		public static get randomSpeek():string{
			var len = Message._randomStr.length;
			return Message._randomStr[Math.ceil(Math.random() * len)];
		}

	}

	interface MessageContent{
		// 消息唯一编号
		id:number,
		// 发送者id
		uid:number,
		// 消息类型
		type:number,
		// 发送人名字
		name:string,
		// 发送时间
		time:Date,
		// 发送者头像
		head:string,
		// 发送内容
		content:string
	}

	/**
	 * 用户结构体
	 */
	interface UserStruct{
		//用户编号
		uid:number,
		//用户名称
		name:string,
		//用户类型
		type:number,
		//用户头像
		head:string,
		//用户消息统计
		count:number,
		//用户加入时间
		enter:Date,
		//用户离开时间
		leave:Date
	}

	export enum MSG_TYPE { USER, REBOT, NOTIFY, SYSTEM, SHAKE, IMAGE ,FACE };

	let uid: number = 0;
	let msgid: number = 0;
	let cdnhost: string = 'http://cdn.5u55.cn/face/';
	function wrap_user(user:UserStruct){
		return '<img src="'+user.head+'" class="xs-head" /><a title="'+user.name+'">' + user.name + '</a>';
	}
	/**
	 * 聊天人物基类
	 */
	class Talker{
		public user: UserStruct;

		public constructor(name:string,isRebot:boolean=false){
			let _uid: number = uid++;
			this.user = {
				uid: _uid,
				name:name,
				type: isRebot ? MSG_TYPE.REBOT : MSG_TYPE.USER,
				head: cdnhost + 'u' + _uid % 10 + '.jpg',
				count:0,
				enter:new Date(),
				leave:new Date(0)
			};

		}

		/**
		 * [speak 说话]
		 * @param {string} content [description]
		 */
		public speak(content:string){
			this.user.count++;
			this.newmsg(this.user.type, content);

			//滚动当前对话框
			var scroll = document.querySelector('.box-message');

			if (scroll){
				scroll.scrollTop = scroll.scrollHeight - scroll.clientHeight;
			}
		}

		/**
		 * [newmsg 新消息]
		 * @param {number} type    [消息类型]
		 * @param {string} content [消息内容]
		 */
		protected newmsg(type:number,content:string){
			var newMsg: MessageContent = {
				id: msgid++,
				uid:this.user.uid,
				type: type,
				name: this.user.name,
				time: new Date(),
				head: this.user.head,
				content: content
			};

			Message.messages.push(newMsg);
			//设置下次回复周期
			if([MSG_TYPE.FACE,MSG_TYPE.IMAGE,MSG_TYPE.USER,MSG_TYPE.REBOT].indexOf(type) > -1){
				Message.instance.setIntervalNext();
			}
		}
		/**
		 * [enter 加入聊天室]
		 */
		public enter(){
			let msg: string = wrap_user(this.user) + '加入了讨论组,' + this.user.name + '与其他人都不是朋友关系,请注意隐私安全';
			this.newmsg(MSG_TYPE.NOTIFY, msg);
		}
		/**
		 * [leave 离开房间]
		 */
		public leave(){
			this.newmsg(MSG_TYPE.SYSTEM, wrap_user(this.user) + '离开了房间...');
		}

		private get uid():number{
			return this.user.uid;
		}
	}


	class Rebot extends Talker{

		public constructor(robotName:string){
			super(robotName,true);
		}

	}

	class User extends Talker{
		public constructor(){
			super('我');
		}

		public send(type:number){
			let content:string;
			switch (type){
				case MSG_TYPE.FACE:
					content = '😄';
					break;
				case MSG_TYPE.IMAGE:
					content = '<img class="msg-image" src="' + cdnhost + Math.floor(Math.random() * 5) + '.jpg">';
					break;
				case MSG_TYPE.SHAKE:
					content = '发送了一个窗口抖动';
					break;
				default:
					//拦截非法消息类型
					type = MSG_TYPE.NOTIFY;
					content = '未识别您的消息';
			}

			this.newmsg(type, content);
		}

		private static _instance: User;

		public static getInstance():User{
			if(!(User._instance instanceof User)){
				User._instance = new User();
			}
			return User._instance;
		}
	}



