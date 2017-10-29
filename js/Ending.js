var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.Ending = function(){};

PlatformerGame.Ending.prototype = {
  init: function(boots, armour, mask, springBoots) { 
    this.boots = boots;
    this.armour = armour;
    this.mask = mask;
    this.springBoots = springBoots;
  },

  create: function() {

    this.game.stage.backgroundColor = "#000";
    this.music_mood_intro = this.game.add.audio('music-mood-intro');
    this.music_mood_intro.play();

    this.music_leitmotif = this.game.add.audio('music-leitmotif');


    this.text1 = "\"Greetings Mortal\n\n";
    this.text2 = "I thank thee; I have been awaiting a new vessel for some time now\n";
    this.text3 = "I am old beyond years; spirit is weak and will not last forever\n";
    this.text4 = "I have been sleeping here in hope of a new spirit to devour\n\n";
    this.text5 = "Your feeble attempts to deny me are useless\n";
    this.text6 = "You are wearing my armour; you are wearing my boots\n";
    if (this.boots) {
        if (!this.armour) {
            this.text6 = "You are wearing my boots\n";
        }
    }
    else {
        if(!this.armour) {
            this.text6 = "\n";
        }
        else {
            this.text6 = "You are wearing my armour\n";
        }
    }
    if (this.mask) {
        this.text7 = "You are wearing my mask; you are mine.\"\n";
    }
    else {
        this.text7 = "You are mine.\"\n";
    }
    this.text8 = "\n";
    this.text9 = "\n";
    this.text10 = "And that's the end of Lance Harding.\n";
    this.text11 = "Let's just say he won't be back in a sec.\n\n";
    this.text12 = "Thanks for playing!\n";
    this.text13 = "Press X to try again";

    if (!this.boots && !this.armour && !this.mask) {

        this.text1 = "Captain's log, stardate 218636.2";
        this.text2 = " - second entry.\n";
        this.text3 = "Well, that was a waste of time.\n";
        this.text4 = "No treasure or technology to speak off, and not much to see either!\n";

        this.text5 = "\n";
        if (this.springBoots) {
            this.text5 = "Atleast I found myself some new springboots.\n\n";
        }
        this.text6 = "Next stop is the planet Zebes.\n";
        this.text7 = "I hope it will prove more interesting!\n";
        this.text8 = "\n";
        this.text9 = "Signing off, \nCaptain Lance Harding.";
        this.text10 = "\n";
        this.text11 = "---\n\n";
        this.text12 = "Thank you for playing The Sleeper!\n";
        this.text13 = "You've beaten the game - well done!\n";

    }


    this.animationTimer = 0;
    this.fontStyle = { font: "13px", fill: "#76428a", align: "center" };
    this.text = this.game.add.text(20, 20, 'hallo', this.fontStyle);
    this.text.style.align = "left";
    this.textVar = "";


    this.key_X = this.input.keyboard.addKey(Phaser.Keyboard.X);
    this.key_X.onDown.add(this.retry, this);

  },

  
  update: function() {
    this.animationTimer++;

    if (this.animationTimer >= 1300) {
        this.graduallyDisplayText(1300, this.text13);
    }
    else if (this.animationTimer >= 1200) {
        this.graduallyDisplayText(1200, this.text12);
    }
    else if (this.animationTimer >= 1100) {
        this.graduallyDisplayText(1100, this.text11);
    }
    else if (this.animationTimer >= 1000) {
        this.graduallyDisplayText(1000, this.text10);
    }
    else if (this.animationTimer >= 900) {
        this.graduallyDisplayText(900, this.text9);
    }
    else if (this.animationTimer >= 800) {
        this.graduallyDisplayText(800, this.text8);
        this.music_leitmotif.play();
    }
    else if (this.animationTimer >= 700) {
        this.graduallyDisplayText(700, this.text7);
    }
    else if (this.animationTimer >= 600) {
        this.graduallyDisplayText(600, this.text6);
    }
    else if (this.animationTimer >= 500) {
        this.graduallyDisplayText(500, this.text5);
    }
    else if (this.animationTimer >= 400) {
        this.graduallyDisplayText(400, this.text4);
    }
    else if (this.animationTimer >= 300) {
        this.graduallyDisplayText(300, this.text3);
    }
    else if (this.animationTimer >= 200) {
        this.graduallyDisplayText(200, this.text2);
    }
    else if (this.animationTimer >= 100) {
        this.graduallyDisplayText(100, this.text1);
    }
    this.text.text = this.textVar;

  },

  graduallyDisplayText: function(start, textPart) {
    if (textPart.length > (this.animationTimer - start)) {
        this.textVar = this.textVar + textPart[this.animationTimer - start];
    }
  },

  retry : function() {
    if (!this.pressed && this.animationTimer > 1300) {
        this.pressed = true;
        this.state.start('Game');
    }
  },

};
