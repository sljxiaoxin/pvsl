var ws = {
    _ws : null,
    status : 'close',  //open
    stageInstance : {
        Game : null
    },
    connect : function(cb){
        this._ws = new WebSocket("ws://10.190.19.140:8000");
        var self = this;
        this._ws.onopen = function() {
        		console.log("连接成功");
            self.status = 'open';
            cb.call(self, self.status);
      	};
      	this._ws.onmessage = function(e) {
          self.dispatchMsg(e.data);
      	};
      	this._ws.onclose = function(e) {
        		console.log("[连接关闭]：" + e);
            self.status = 'close';
            cb.call(self, self.status);
      	};
        this._ws.onerror = function(e) {
        		console.log("[连接错误]：" + e);
            self.status = 'error';
            cb.call(self, self.status);
      	};
      	setInterval(function(){
      		self.send({act:'heartcheck'});
      	}, 1000*60);
    },
    setStage : function(key,obj){
        this.stageInstance[key] = obj;
    },
    login : function(home){
        console.log("send login begin");
        this.send({act :'login', home : home});
    },
    dispatchMsg : function(strMsg){
        //{stage:'xxx', act : '动作', data:''/{}/[]}
        console.log("[收到服务端的消息]：" + strMsg);
        var oMsg = JSON.parse(strMsg);//$.parseJSON(strMsg); JSON.parse(strMsg)
        var stage = "Game";
        if(oMsg && typeof oMsg.act != 'undefined'){
            if(typeof oMsg.stage != 'undefined'){
                stage = oMsg.stage;
            }
            this.stageInstance[stage].wsFactoryGenerator.receive(oMsg);
        }

    },
    send : function(oMsg){
        //{act : '动作', data:''/{}/[]}
        //{act :'login', home:'xxx-xxx'}
        if(this.status == 'close'){
            return;
        }
        var strMsg = JSON.stringify(oMsg);
        console.log("[发送服务器消息]：",strMsg);
        this._ws.send(strMsg);
    }

};
