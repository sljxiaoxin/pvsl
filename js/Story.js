var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.Story = function(){};

PlatformerGame.Story.prototype = {
  create: function() {

    this.game.stage.backgroundColor = "#000";
    this.music_mood_intro = this.game.add.audio('music-mood-intro');
    this.music_mood_intro.play();

    this.music_leitmotif = this.game.add.audio('music-leitmotif');


    this.text1 = "Captain's log, stardate 218636.2\n\n";
    this.text2 = "I'm on my way to the planet Zebes, but here's something that might be interesting:\n";
    this.text3 = "The computer is telling me there is a power source hidden in a meteor nearby.\n";
    this.text4 = "I've got a hunch there's some treasure or perhaps some technology to loot here!\n";
    this.text5 = "Will make a quick stop to take a look.\n";
    this.text6 = "Looks like the source is located deep inside the meteor.\n";
    this.text7 = "It's kind of like a cave but it's way too cylindrical to be natural.\n";
    this.text8 = "\n";
    this.text9 = "I have landed and will go have a look.\n";
    this.text10 = "There's even a local atmosphere inside this cave, I won't be needing my space suit.\n";
    this.text11 = "I will bring my laser pistol, though.\n";
    this.text12 = "Be back in a sec (famous last words, eh?)\n\n";
    this.text13 = "Signing off, \nCaptain Lance Harding.";


    this.animationTimer = 0;
    this.fontStyle = { font: "13px", fill: "#76428a", align: "center" };
    this.text = this.game.add.text(20, 20, 'hallo', this.fontStyle);
    this.text.style.align = "left";
    this.textVar = "";

    this.game.input.keyboard.addCallbacks(this, this.skip, null, null);
    this.pressed = false;


  },

  
  update: function() {
    this.animationTimer++;

    if (this.animationTimer == 2000 && !this.pressed) {
        this.pressed = true;   
        this.state.start('Game');
    }
    else if (this.animationTimer >= 1300) {
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

  skip : function() {
    if (!this.pressed && this.animationTimer > 100) {
        this.pressed = true;
        this.state.start('Game');
    }
  },

};
