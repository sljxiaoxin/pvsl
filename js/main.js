var Global = {
    width : 960,
    height : 720,
    direction : '1'
};
function getDirection() {
    switch (window.orientation) {
        case 0:
        case 180:
            Global.direction = '1';
            break;
        case -90:
        case 90:
            Global.direction = '一';
            break;
    }
}

getDirection();



var PlatformerGame = PlatformerGame || {};

PlatformerGame.game = new Phaser.Game(Global.width, Global.height, Phaser.AUTO, '', null, false, false);
/*
Phaser.World.prototype.displayObjectUpdateTransform = function () {
    if (Global.direction == '1') {
        PlatformerGame.game.scale.setGameSize(Global.height, Global.width)
        this.x = PlatformerGame.game.camera.y + PlatformerGame.game.width;
        this.y = -PlatformerGame.game.camera.x;
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
    } else {
        PlatformerGame.game.scale.setGameSize(Global.width, Global.height)
        this.x = -PlatformerGame.game.camera.x;
        this.y = -PlatformerGame.game.camera.y;
        this.rotation = 0;
    }
    PIXI.DisplayObject.prototype.updateTransform.call(this);
}
*/
//, '', { preload: preload, create: cr4ate, update: update });

PlatformerGame.game.state.add('Boot', PlatformerGame.Boot);
PlatformerGame.game.state.add('Preload', PlatformerGame.Preload);
PlatformerGame.game.state.add('Game', PlatformerGame.Game);

PlatformerGame.game.state.start('Boot');
