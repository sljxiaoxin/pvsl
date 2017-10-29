var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game
        this.game.add.sprite(0, 0, 'background');
        ///*
        sprite1 = this.game.add.tileSprite(0, Global.height-190, 140, 190, 'sprites', 'cardJokerRed.png');
        sprite1.inputEnabled = true;
        //sprite1.scale.setTo(0.5);
        //sprite1.liteKey = "cardJokerRed";
        sprite2 = this.game.add.tileSprite(35, Global.height-190, 140, 190, 'sprites', 'cardClubs2.png');
        sprite3 = this.game.add.tileSprite(70, Global.height-190, 140, 190, 'sprites', 'cardClubs3.png');
        sprite4 = this.game.add.tileSprite(105, Global.height-190, 140, 190, 'sprites', 'cardClubs4.png');
        sprite5 = this.game.add.tileSprite(140, Global.height-190, 140, 190, 'sprites', 'cardClubs5.png');
        var xx = 140;
        for(var i=0;i<12;i++){
            xx += 35;
            this.game.add.tileSprite(xx, Global.height-190, 140, 190, 'sprites', 'cardHearts7.png');
        }


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
      //  */
    },

    update : function(){
        //console.log("sprite1.liteKey:",sprite1.liteKey);
        if (sprite1.input.pointerOver()) {
            console.log("鼠标放在了大毛上");
        }else{
            //console.log("鼠标移出大毛");
        }
    },

    render: function() {
    }

};
