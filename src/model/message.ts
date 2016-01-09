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

		private $http:any;
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

			this.$http = (new XHR()).exec;
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

		//机器人回复
		protected robotReply(){
			if (!Message.inputingUser){
				return false;
			}
			// return false;

			var robot = Message.inputingUser;
			let content: string;
			let lastmsg:string = Message.messages[Message.messages.length-1].content;

			this.$http({
			    method: "POST",
				url: "http://www.tuling123.com/openapi/api",
			    headers: {
			        "Content-Type": "application/x-www-form-urlencoded",
			    },
				data: "userid=" + Message.msgid + "&key=" + NOW_USED + "&info=" + lastmsg
			}).success((data) => {
				data = JSON.parse(data);
				if (data.code === 100000){
					content = data.text;
				} else if (data.code === 200000){
					content = '<a href="'+data.url+'">'+data.text+'</a>';
				}else{
					//TODO 解析更多消息类型
					content = '----- 暂不支持解析此消息 -----';
				}
				//用户昵称替换
				content = content.replace(/__NAME__/g, robot.user.name);
				robot.speak(content);
			}).error(function (data) {
			    console.log(data);
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

	}

	/**
	 * 对象池
	 */
	// class RebotPool {
	// 	private static _cache: Rebot[] = [];

	// 	public static create(robotName: string): Rebot {
	// 		var result: Rebot;
	// 		if (RebotPool._cache.length) {
	// 			result = RebotPool._cache.shift();
	// 		}else{
	// 			result = new Rebot(robotName);
	// 		}
	// 		return result;
	// 	}

	// 	public static destory(){

	// 	}
	// }

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

// }



//todo: include all the media types.
var MEDIA_TYPES: string[] = ["application/json", "application/x-www-form-urlencoded", "text/plain", "text/html"];
var ALLOWED_METHODS: string[] = ["get", "post", "put", "delete"];

var JSSON: Function = json => {
	var sson = json;

	sson.forEach = (fun, newThis?: Object) => {
		var self = newThis || sson;

		if (self == null)
			throw new TypeError('this is null or not defined');
		if (typeof fun !== "function")
			throw new TypeError(fun + " is not a function");
		for (var property in self) {
			if (self.hasOwnProperty(property) && typeof self[property] !== "function")
				fun.call(self, self[property], property, self);
		}
	};

	sson.map = (fun, newThis?: Object): Array<any> => {
		var self = newThis || sson,
			arr: Array<any> = [],
			temp;

		if (self == null)
			throw new TypeError('this is null or not defined');
		if (typeof fun !== "function")
			throw new TypeError(fun + " is not a function");
		for (var property in self) {
			if (self.hasOwnProperty(property) && typeof self[property] !== "function") {
				temp = fun.call(self, self[property], property, self);
				if (temp !== undefined)
					arr.push(temp);
			}
		}
		return arr;
	};

	return sson;
};

class XHR {
	private xhr: XMLHttpRequest;

	public exec:any;
	constructor() {
		var self = this;
		this.xhr = new XMLHttpRequest();

		var executer = (json) => self.call(json.method, json.url, json.data, json.headers);

		executer["call"] = self["call"];
		executer["buildURL"] = self["buildURL"];
		executer["get"] = self["get"];
		executer["post"] = self["post"];
		executer["put"] = self["put"];
		executer["delete"] = self["delete"];
		executer["xhr"] = new XMLHttpRequest();
		this.exec = executer;
		//Dirty but powerful.
		// return executer;
	}

	private call(method: string, url: string, data?: any, dataType?: Object, async: boolean = true): Object {
		var self = this;
		self.xhr.open(method, url, async);

		if (ALLOWED_METHODS.indexOf(method.toLowerCase()) < 0)
			throw TypeError("Method not supported:\n" + "The call " + method + " is not supported");

		//todo: test consistency in the header set by the user.
		if (dataType) JSSON(dataType).forEach((val, pro) => {
			self.xhr.setRequestHeader(pro, val);
		});

		//For a succeeded query.
		return {
			"success": (successCallback: Function): Object => {

				self.xhr.onreadystatechange = () => {
					if (self.xhr.status === 200 && self.xhr.readyState === 4) {
						successCallback.call(this, self.xhr.response, self.xhr.getAllResponseHeaders());
					} else if (self.xhr.status !== 200 && self.xhr.readyState === 4) {
						throw Error("Data not received:\n" + "Details: " + self.xhr.statusText);
					}
				};

				//If the data passed is a JSON and the dataType is an x-www ... convert the json to a string
				//Todo: needs improvement for arrays, objects and others.
				if (data.constructor.name === "Object" &&
					dataType["Content-Type"] === "application/x-www-form-urlencoded") {
					data = JSSON(data)
						.map((value: any, key: string) =>
							key.concat("=").concat(value))
						.join("&");
				} else if (data.constructor.name === "Object" &&
					dataType["Content-Type"] === "application/json") {
					data = JSON.stringify(data);
				}

				//If data was passed send it, some people use get, put, delete to send data...:(
				data ? self.xhr.send(data) : self.xhr.send();

				//If error is present
				return {
					"error": (errorCallback: Function): void => {
						self.xhr.onreadystatechange = () => {
							if (self.xhr.status === 200 && self.xhr.readyState === 4) {
								successCallback.call(this, self.xhr.response, self.xhr.getAllResponseHeaders());
							} else if (self.xhr.status !== 200 && self.xhr.readyState === 4) {
								errorCallback.call(this, self.xhr.statusText, self.xhr.getAllResponseHeaders())
							}
						};
					}
				};
			}
		};
	}

	public get(url: string, parameters: Object, data?: any, dataType?: Object, async: boolean = true): Object {
		return this.call("GET", this.buildURL(url, parameters), data, dataType, async);
	}

	public post(url: string, data?: any, dataType?: Object, async: boolean = true): Object {
		var DEFAULT_POST_HEADER: Object = {
			"Content-Type": "application/json"
		};

		return this.call("POST", url, data, dataType || DEFAULT_POST_HEADER, async);
	}

	public put(url: string, parameters: Object, data?: any, dataType?: Object, async: boolean = true): Object {
		return this.call("PUT", this.buildURL(url, parameters), data, dataType, async);
	}

	public delete(url: string, parameters: Object, data?: any, dataType?: Object, async: boolean = true): Object {
		return this.call("DELETE", this.buildURL(url, parameters), data, dataType, async);
	}

	//This call receives a object and writes the parameters from it.
	private buildURL = (baseURI: string, params: Object): string => baseURI + "?" + JSSON(params).map((value, att) => att + "=" + (value.constructor === Array ? value.join(",") : value)).join("&")

}


