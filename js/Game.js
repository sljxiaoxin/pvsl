var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){
    this.wsFactoryGenerator = this.wsFactory();
};

PlatformerGame.Game.prototype = {
    hideGroup : null,  //底牌组
    hideOne : null,    //第一张底牌背面对象
    hideTwo : null,    //第2张底牌背面对象
    hideThree :null,   //第3张底牌背面对象
    btnGroup : null,   //包括闹钟和所有按钮的组
    jMap : {
        's3' : {idx:0,frame:'cardSpades3'},'h3' : {idx:1,frame:'cardHearts3'},'c3' : {idx:2,frame:'cardClubs3'},'d3' : {idx:3,frame:'cardDiamonds3'},
        's4' : {idx:4,frame:'cardSpades4'},'h4' : {idx:5,frame:'cardHearts4'},'c4' : {idx:6,frame:'cardClubs4'},'d4' : {idx:7,frame:'cardDiamonds4'},
        's5' : {idx:8,frame:'cardSpades5'},'h5' : {idx:9,frame:'cardHearts5'},'c5' : {idx:10,frame:'cardClubs5'},'d5' : {idx:11,frame:'cardDiamonds5'},
        's6' : {idx:12,frame:'cardSpades6'},'h6' : {idx:13,frame:'cardHearts6'},'c6' : {idx:14,frame:'cardClubs6'},'d6' : {idx:15,frame:'cardDiamonds6'},
        's7' : {idx:16,frame:'cardSpades7'},'h7' : {idx:17,frame:'cardHearts7'},'c7' : {idx:18,frame:'cardClubs7'},'d7' : {idx:19,frame:'cardDiamonds7'},
        's8' : {idx:20,frame:'cardSpades8'},'h8' : {idx:21,frame:'cardHearts8'},'c8' : {idx:22,frame:'cardClubs8'},'d8' : {idx:23,frame:'cardDiamonds8'},
        's9' : {idx:24,frame:'cardSpades9'},'h9' : {idx:25,frame:'cardHearts9'},'c9' : {idx:26,frame:'cardClubs9'},'d9' : {idx:27,frame:'cardDiamonds9'},
        's10' : {idx:28,frame:'cardSpades10'},'h10' : {idx:29,frame:'cardHearts10'},'c10' : {idx:30,frame:'cardClubs10'},'d10' : {idx:31,frame:'cardDiamonds10'},
        'sJ' : {idx:32,frame:'cardSpadesJ'},'hJ' : {idx:33,frame:'cardHeartsJ'},'cJ' : {idx:34,frame:'cardClubsJ'},'dJ' : {idx:35,frame:'cardDiamondsJ'},
        'sQ' : {idx:36,frame:'cardSpadesQ'},'hQ' : {idx:37,frame:'cardHeartsQ'},'cQ' : {idx:38,frame:'cardClubsQ'},'dQ' : {idx:39,frame:'cardDiamondsQ'},
        'sK' : {idx:40,frame:'cardSpadesK'},'hK' : {idx:41,frame:'cardHeartsK'},'cK' : {idx:42,frame:'cardClubsK'},'dK' : {idx:43,frame:'cardDiamondsK'},
        'sA' : {idx:44,frame:'cardSpadesA'},'hA' : {idx:45,frame:'cardHeartsA'},'cA' : {idx:46,frame:'cardClubsA'},'dA' : {idx:47,frame:'cardDiamondsA'},
        's2' : {idx:48,frame:'cardSpades2'},'h2' : {idx:49,frame:'cardHearts2'},'c2' : {idx:50,frame:'cardClubs2'},'d2' : {idx:51,frame:'cardDiamonds2'},
        'sjb' : {idx:52,frame:'cardJokerBlack'},'sjr' : {idx:53,frame:'cardJokerRed'},
    },
    arrMap : [

    ],
    data : {
        id : '',
        lId : '',      //左id
        rId : '',      //右id
        info : {
            me    :{name : '', sex : 0, level : 0},
            left  :{name : '', sex : 0, level : 0},
            right :{name : '', sex : 0, level : 0}
        },
        myCards : [],  //本id，服务器下发所有牌['h2','h3'...]
        myCardsStatus : {},  //本id下所有牌状态，各项{}内部需要记录精灵对象

        lCards : [],       //左侧本轮出牌，里面{}记录精灵对象
        lCardsStatus : {}, //左侧本轮出牌状态记录 ，各项{}内部需要记录精灵对象

        rCards : [],       //右侧本轮出牌，里面{}记录精灵对象
        rCardsStatus : {}, //右侧本轮出牌状态记录 ，各项{}内部需要记录精灵对象

        hideCards : [],    //底牌实际牌

        myCardsNowCounts : 0,
        lCardsNowCounts : 0,
        rCardsNowCounts : 0

    },
    wsFactory : function(){
        var self = this;
        return {
            receive : function(oMsg){
                console.log('Game.wsFactory.receive:',oMsg);
                switch (oMsg['act']) {
                  case 'jdz':
                    self.onJDZ(oMsg);
                    break;
                  case 'fp':
                    self.onFp(oMsg);
                    break;
                  case 'loginok':
                    self.onLogged(oMsg);
                    break;
                  case 'leftId':
                    self.onLeftId(oMsg);
                    break;
                  case 'rightId':
                    self.onRightId(oMsg);

                    break;
                }
            },
            send : function(action, oMsg){
                var m = oMsg;
                m.act = action;
                ws.send(m);
            }
        };
    },
    // 左侧用户id
    onLeftId : function(oMsg){
        this.data.lId = oMsg.id;
        this.data.info.left = oMsg.info;
        var farmer = this.game.add.sprite(10, 100, 'farmer');
        var text = this.game.add.text(10,100+108+10, this.data.info.left.name,  { font: "30px Arial", fill: '#ffffff' });
    },
    // 右侧用户id
    onRightId : function(oMsg){
        this.data.rId = oMsg.id;
        this.data.info.right = oMsg.info;
        var farmer = this.game.add.sprite(960-10, 100, 'farmer');
        farmer.scale.setTo(-1,1);
        var text = this.game.add.text(960-108-10,100+108+10, this.data.info.right.name,  { font: "30px Arial", fill: '#ffffff' });
    },
    // 登录成功
    onLogged : function(oMsg){
        this.data.id = oMsg.id;
        this.data.info.me = oMsg.info;
        var farmer = this.game.add.sprite(10, Global.height- 108 - 130, 'farmer');
        var text = this.game.add.text(10,Global.height - 100, this.data.info.me.name,  { font: "30px Arial", fill: '#ffffff' });
        //farmer.scale.setTo(-1,1);翻转
        //console.log("Game.data:",this.data);
    },
    // 发牌
    onFp : function(msgJson){
        var gap = 35, posX = 130;
        for(var i=0;i<msgJson['cards'].length;i++){
          var frame = msgJson['cards'][i];
          var frameName = this.jMap[frame]['frame'];
          var cardSprite = this.game.add.tileSprite(posX, Global.height-190, 140, 190, 'sprites', frameName+'.png');
          cardSprite.tileKey = frame;
          cardSprite.inputEnabled = true;
          cardSprite.events.onInputDown.add(function(sp){
              console.log("you clicked ",sp.tileKey);
          }, this);
          posX += gap;
        }
        this.data.hideCards = msgJson['hideCards'];  //记录底牌
        //放3个背面图到顶部
        this.hideGroup = this.game.add.group();
        this.hideOne = this.hideGroup.create(Global.width/2 - (70/2) - gap - 70, 10, 'sprites','cardBack_red5.png');
        this.hideTwo = this.hideGroup.create(Global.width/2 - (70/2), 10, 'sprites','cardBack_red5.png');
        this.hideThree = this.hideGroup.create(Global.width/2 + (70/2) +gap, 10, 'sprites','cardBack_red5.png');
        this.hideGroup.createMultiple(5,'sprites','cardBack_green5.png');
        //this.hideGroup.setAll('body.immovable', true);
        this.hideOne.scale.setTo(0.5, 0.5);
        this.hideTwo.scale.setTo(0.5, 0.5);
        this.hideThree.scale.setTo(0.5, 0.5);

        this.wsFactoryGenerator.send('fpOver',{});

    },

    onJDZ : function(msgJson){
        //me : var timer = this.game.add.sprite(10+108+100, Global.height- 190 - 128-10, 'timer');
        //left : var timer = this.game.add.sprite(10+108+10, 100, 'timer');
        //right : var timer = this.game.add.sprite(960-10-108-128-10, 100, 'timer');
        this.clearBtnGroup();    //每次服务端发消息过来的时候需要清理按钮
        var self = this;
        this.showClock(msgJson, function(){
            console.log("clock over");
            self.wsFactoryGenerator.send('jdz',{score:0});
            self.clearBtnGroup();
        });
        this.showJdzButton(msgJson);

    },
    showJdzButton : function(oMsg){
        if(oMsg['isSelf'] == '1'){
            //轮到自己
            var self = this;
            var btn1 = this.createButton(10+108+70+100+40, Global.height-190-105, '1分',function(){
                alert("1分");
                self.wsFactoryGenerator.send('jdz',{score:1});
            });
            var btn2 = this.createButton(10+108+70+100+40+120+10, Global.height-190-105, '2分',function(){
                alert("2分");
                self.wsFactoryGenerator.send('jdz',{score:2});
            });
            var btn3 = this.createButton(10+108+70+100+40+120+120+10+10, Global.height-190-105, '3分',function(){
                alert("3分");
                self.wsFactoryGenerator.send('jdz',{score:3});
            });
            var btnNot = this.createButton(10+108+70+100+40+120+120+120+10+10+10, Global.height-190-105, '不叫',function(){
                alert("不叫");
                self.wsFactoryGenerator.send('jdz',{score:0});
            });
            this.btnGroup.addMultiple([btn1.btn,btn1.text,btn2.btn,btn2.text,btn3.btn,btn3.text,btnNot.btn,btnNot.text]);
        }
    },
    createButton : function(x,y,strText,cb){
        var self = this;
        var btn = this.game.add.button(x, y, 'button', function(){
            cb.call(self);
            self.clearBtnGroup();
        }, this);
        //btn.scale.setTo(0.8,0.8);
        var text = this.game.add.text(0, 0, strText,  { font: "40px Arial", fill: '#000000', wordWrapWidth: btn.width, align: "center" });
        text.anchor.set(0.5, 0.5);
        text.x = Math.floor(btn.x + btn.width / 2 );
        text.y = Math.floor(btn.y + btn.height / 2 );
        return {btn:btn,text:text};
    },
    //显示时钟
    showClock : function(oMsg, cb){
        if(oMsg['isSelf'] == '1'){
            //轮到自己
            var timer = this.game.add.sprite(10+108+70, Global.height- 190 - 128-10, 'timer');
        }else{
            //其他人
            if(this.data.lId == oMsg['id']){
                var timer = this.game.add.sprite(10+108+10, 100, 'timer');
            }else if(this.data.rId == oMsg['id']){
                var timer = this.game.add.sprite(960-10-108-128-10, 100, 'timer');
            }
        }
        var text = this.game.add.text(0, 0, '30',  { font: "40px Arial", fill: '#0000FF', wordWrapWidth: timer.width, align: "center" });
        text.anchor.set(0.5, 0.3);
        text.x = Math.floor(timer.x + timer.width / 2 );
        text.y = Math.floor(timer.y + timer.height / 2 );
        var sec = 30;
        var self = this;
        var loopTimer = this.game.time.events.loop(Phaser.Timer.SECOND, function(){
            sec -= 1;
            text.text = sec;
            if(sec == 0){
                self.game.time.events.remove(loopTimer);
                cb.call(self);
            }
        }, this);
        this.btnGroup.addMultiple([timer,text]);
    },
    clearBtnGroup : function(){
        this.btnGroup.removeAll(true);
    },
    create: function() {
        console.log('Game create');
        ws.setStage('Game', this);
        ws.login('17888');  //传home
        this.btnGroup = this.game.add.group();
        //  A simple background for our game
        this.game.add.sprite(0, 0, 'background');
        //发牌
        //this.wsFactoryGenerator.receive({act : 'fp', cards:['sjr','sjb','d2','h2','sA','cQ','hQ','h10','c9','d8','s6','h5','s5','c4','h4','d3','h3']});

        /*
        var data = [{key:'h3',index:'3'},{key:'h1',index:'1'},{key:'h2',index:'2'}];
        console.log(data);
        var compair = function(propertyName){
          return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            if (value1 < value2) {
                return 1;
            }else if (value1 > value2) {
                return -1;
            }else {
                return 0;
            }
        };
        }
        data.sort(compair('index'));
        console.log("compair:",data);
        */
    },

    update : function(){
        //console.log("sprite1.liteKey:",sprite1.liteKey);
        /*
        if (sprite1.input.pointerOver()) {
            //console.log("鼠标放在了大毛上");
        }else{
            //console.log("鼠标移出大毛");
        }
        */
    },

    render: function() {
    }

};
