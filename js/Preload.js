var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.game.load.atlasXML('sprites', 'assets/images/sprites.png', 'assets/images/sprites.xml');
    //this.game.load.atlasXML('cards', 'assets/images/cards.png', 'assets/images/cards.xml');
    this.game.load.image('background', 'assets/images/background.png');
    this.game.load.image('landlords', 'assets/images/landlords.png');
    this.game.load.image('farmer', 'assets/images/farmer.png');
    this.game.load.image('timer', 'assets/images/timer.png');
    this.game.load.image('button', 'assets/images/button.png');


  },
  create: function() {
    var colour = "000";
    var timeout = 2;
    var self = this;
    console.log("Preload create func");

    ///*
    ws.connect(function(status){
      //  alert("ws connect ："+status);
        if(status == 'open'){
            console.log("ws.connect callback");
            //PlatformerGame.game.state.add('Game', PlatformerGame.Game);
            self.state.start('Game', true, false, colour, timeout);
        }
    });
    //*/
    // armour, boots, mask, springBoots
    //this.state.start('Ending', true, false, false, false, false, false);
  }
};
