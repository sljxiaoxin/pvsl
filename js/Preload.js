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
    this.game.load.atlasXML('cards', 'assets/images/cards.png', 'assets/images/cards.xml');
    this.game.load.image('background', 'assets/images/background.png');


  },
  create: function() {
    var colour = "000";
    var timeout = 2;
    this.state.start('Game', true, false, colour, timeout);
                                          // armour, boots, mask, springBoots
    //this.state.start('Ending', true, false, false, false, false, false);
  }
};
