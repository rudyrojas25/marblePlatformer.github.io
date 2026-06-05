class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 600; //600
        this.NORMALACCELERATION = 600;
        this.MARBLEACCELERATION = 750;
        this.velocityCap = 250; //idk how itll be implemented yet
        this.marbleVelocitycap = 500;

        this.DRAG = 500;//500    // DRAG < ACCELERATION = icy slide //500
        this.NORMALDRAG = 500;
        this.MARBLEDRAG = 250; //250
        this.physics.world.gravity.y = 1500; //1500, alt 1200

        this.JUMP_VELOCITY = -500; //-600
        this.NORMALJUMP_VELOCITY = -500; //-310
        this.MARBLEJUMP_VELOCITY = -420; //-700

        this.PARTICLE_VELOCITY = 50;

        this.SCALE = 3.0; // 2.0
    }

    create() {
        //very important go to section thurs in order to get code for completing section
        //added audio
        //this.load.audio('jetpackJump', 'explosionCrunch_000.ogg');
        //this.load.audio('hover', 'assets/spaceEngineLow_000.ogg');


        //State machine variables
        this.state = Object ({
            Idle: 'Idle',
            Running: 'Running',
            Jumping: 'Jumping',
            Falling: 'Falling',
            Hovering: 'Hovering'
        });

        this.playerState = this.state.Idle;
        this.prevState = this.state.Idle;
        this.landed = false;
        this.jumped = false;

        this.marbleActive = false;

        this.label = this.add.text(100, 100, this.hasJetpack, {  //this.playerState
        fontFamily: 'Arial', 
        fontSize: '12px', 
        color: '#ffffff' 
        });

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here //for coins
        
        

        // TODO: Add turn into Arcade Physics here //for coins also
        

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setDepth(2);
        //const playerColorMatrix = my.sprite.player.filters.internal.addColorMatrix();
        //playerColorMatrix.colorMatrix.sepia();


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //marble sprite
        my.sprite.marble = this.add.sprite(30, 347, "kenny-particles", "circle_01.png");
        my.sprite.marble.setScale(0.08);

        // TODO: Add coin collision handler
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.cKey = this.input.keyboard.addKey('C');

        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');

        // debug key listener (assigned to D key)
        //this.input.keyboard.on('keydown-C', () => {
        //    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        //    this.physics.world.debugGraphic.clear()
        //}, this);
        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();

        //this.input.keyboard.on('keydown-S', () => {
        //    this.hasJetpack = this.hasJetpack ? false : true
        //}, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            //random: true,
            scale: {start: 0.03, end: 0.1}, //0.03, 0.1
            // TODO: Try: maxAliveParticles: 8,
            //maxAliveParticles: 8,
            lifespan: 250, //350
            // TODO: Try: gravityY: -400,
            gravityY: -50,
            frequency: 75,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.setDepth(-1);

        my.vfx.walking.stop();

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        let camera = this.cameras.main;
        const camFX = camera.filters.internal.addPixelate(0.5);

        this.facingLeft = false;

        //this.playerAndJetpack.add([my.sprite.player, my.sprite.jetpack]) //(for moving both without delay)


        this.events.on('prerender', this.preRender, this); //used for syncing jetpack and player
                                                            //https://phaser.io/sandbox/XuEw4pCW


        //make a group of boxes with similar logic to coins except can only be collected at high speeds
        //when collision not at high speeds, block player movement (use physics engine?)
                            
    }
    //for water, add a water property to water tiles in tiled

    update(time, delta) {
        this.label.x = my.sprite.player.x + 15;
        this.label.y = my.sprite.player.y - 30;
        this.label.setText('');

        
        //when player dies, launch sprite in opposite direction, rotate sprite similar to minecraft death anim


        if (my.sprite.player.body.blocked.down) {
            if (my.sprite.player.flipX == true) { //was my.sprite.player.body.velocity.x > 0
                this.facingLeft = true;
            } else if (my.sprite.player.flipX == false) {
                this.facingLeft = false;
            }
        }
        if (this.marbleActive == true) {
            my.sprite.player.body.velocity.x = Phaser.Math.Clamp(my.sprite.player.body.velocity.x, -this.marbleVelocitycap, this.marbleVelocitycap);
        } else {
            my.sprite.player.body.velocity.x = Phaser.Math.Clamp(my.sprite.player.body.velocity.x, -this.velocityCap, this.velocityCap);
        }

        //if player is next to jetpack (and on ground), allow sKey press switch jetpack
        //if player is on ground and has jetpack, allow sKey press switch jetpack
            //place jetpack object on players location
        if (Phaser.Input.Keyboard.JustDown(this.sKey)) {
            this.marbleActive = this.marbleActive ? false : true
        }

        if (this.marbleActive == true) {
            this.ACCELERATION = this.MARBLEACCELERATION;
            this.JUMP_VELOCITY = this.MARBLEJUMP_VELOCITY;
            if (!my.sprite.player.body.blocked.down) {
                this.DRAG = 0;
            } else {
                this.DRAG = this.MARBLEDRAG;
            }
            my.vfx.walking.frequency = 200;
            my.sprite.player.body.offset.y = 3
            //marbleAcceleration
            //marbleJumpVelocity
            my.sprite.player.angle += my.sprite.player.body.velocity.x * 0.08;
        } else if (this.marbleActive == false) {
            this.ACCELERATION = this.NORMALACCELERATION;
            this.JUMP_VELOCITY = this.NORMALJUMP_VELOCITY;
            this.DRAG = this.NORMALDRAG;
            my.vfx.walking.frequency = 75;
            my.sprite.player.angle = my.sprite.player.body.velocity.x * 0.06;
            my.sprite.player.body.offset.y = 0

        }

        if (((cursors.left.isDown) || (this.aKey.isDown)) && ((cursors.right.isDown) || (this.dKey.isDown))) {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            // TODO: have the vfx stop playing
            my.sprite.player.anims.timeScale = 0.5;
            my.vfx.walking.stop();

        } else if ((cursors.left.isDown) || (this.aKey.isDown)) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.timeScale = 1;
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if ((my.sprite.player.body.blocked.down) && (my.sprite.player.body.velocity.x != 0)){
                my.vfx.walking.start();
            } else {
                my.vfx.walking.stop();
            }
        } else if ((cursors.right.isDown) || (this.dKey.isDown)) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.timeScale = 1;
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if ((my.sprite.player.body.blocked.down) && (my.sprite.player.body.velocity.x != 0)) {
                my.vfx.walking.start();
            } else {
                my.vfx.walking.stop();
            }
        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            // TODO: have the vfx stop playing
            my.sprite.player.anims.timeScale = 0.5;
            my.vfx.walking.stop();
        }

        //rework animations so that if player is on floor and velocity x is not 0, play run anim
        if((my.sprite.player.body.blocked.down) && (my.sprite.player.body.velocity.x != 0)){
            //this.playerState = this.state.Running;
            this.setState(this.state.Running);
            if (this.marbleActive == false) {
                my.sprite.player.anims.play('walk', true);
            } else {
                my.sprite.player.anims.play('jump');
            }
        }
        if (my.sprite.player.body.velocity.x == 0) {
            my.sprite.player.anims.play('idle');
            if(my.sprite.player.body.blocked.down) {
                //this.playerState = this.state.Idle;
                this.setState(this.state.Idle);
            }
                //this.playerState = this.state.Idle;
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && ((Phaser.Input.Keyboard.JustDown(cursors.up)) || (Phaser.Input.Keyboard.JustDown(this.wKey)))) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            //this.playerState = this.state.Jumping;
            this.setState(this.state.Jumping);
            if (this.marbleActive == false) {
                this.tweens.add({
                    targets: my.sprite.player,
                    scaleY: 1.2,     
                    scaleX: 0.8,      
                    duration: 125,
                    yoyo: true,
                    ease: 'Power1'       // Reverses the animation back to normal
                });
            }
            my.vfx.walking.explode(3);
        }
        

        
        if (my.sprite.player.body.velocity.y > 0) {
            //this.playerState = this.state.Falling;
            this.setState(this.state.Falling);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
    setState(newState){
        this.prevState = this.playerState;
        this.playerState = newState;
    }
    preRender(){
        if (this.marbleActive == true) {
            my.sprite.marble.y = my.sprite.player.y;
            my.sprite.marble.x = my.sprite.player.x;
        }
    }
}