'use-strict';

// Cria o objeto que vai conter todo o jogo
var mainState = {
	


	// preload dos itens
	preload : function() {
	    game.load.image('sky', 'assets/sky.png');
	    game.load.image('ground', 'assets/platform.png');
	    game.load.image('star', 'assets/star.png');
	    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	},

	// onde cria o jogo
	create : function(){
		
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0, 0, 'sky');
		
		platforms = game.add.group();
		platforms.enableBody = true;
		
		var ground = platforms.create(0, game.world.height - 64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		var ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;

    	ledge = platforms.create(-150, 250, 'ground');
    	ledge.body.immovable = true;
		
		player = game.add.sprite(32, game.world.height - 150, 'dude');
		game.physics.arcade.enable(player);

		player.body.bounce.y = 0.2;
	    player.body.gravity.y = 300;
	    player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);

		cursors = game.input.keyboard.createCursorKeys();
		
		stars = game.add.group();
		stars.enableBody = true;

		this.makeStars();

		score = 0;
		scoreText = "";

		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	},

	// atualizar o jogo
	update : function() {
		game.physics.arcade.collide(player, platforms);

		player.body.velocity.x = 0;
		


	    if (cursors.left.isDown)
	    {
	        //  Move to the left
	        player.body.velocity.x = -300;

	        player.animations.play('left');
	    }
	    else if (cursors.right.isDown)
	    {
	        //  Move to the right
	        player.body.velocity.x = 300;

	        player.animations.play('right');
	    }
	    else
	    {
	        //  Stand still
	        player.animations.stop();

	        player.frame = 4;
	    }

	    //  Allow the player to jump if they are touching the ground.
	    if (cursors.up.isDown && player.body.touching.down)
	    {
	        player.body.velocity.y = -350;
	    }
	    
	    game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.overlap(player, stars, this.collectStar, null, this);

		if ( stars.total == 0 ) {
			this.makeStars();
		}

	},
	
	makeStars : function() {
	    for (var i = 0; i < 12; i++)
	    {
	        var x_pos = Math.floor((Math.random() * 800) + 1);
	        var y_pos = Math.floor((Math.random() * 500) + 1);

	        var star = stars.create(x_pos, y_pos, 'star');

	        //  Let gravity do its thing
	        star.body.gravity.y = 3000;

	        //  This just gives each star a slightly random bounce value
	        star.body.bounce.y = 0.2;
	    }
	},

	collectStar: function (player, star) {

	    // Removes the star from the screen
	    star.kill();

		score += 10;
		scoreText.text = 'Score: ' + score;
	},

};

// inicia o jogo
var game = new Phaser.Game(800,600,Phaser.AUTO);

game.state.add('main',mainState);
game.state.start('main');