class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.setPath("./assets/menu");
        this.load.image('window1', 'bar_square_gloss_large_square.png')
        this.load.image('button1', 'bar_square_gloss_large.png')


    }

    create() {
        this.titleText = this.add.text(600, 150, 'Unidentified Flying Marble', {
            fontSize: '64px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.howToPlay = this.add.text(800, 300, 'Controls: WASD\n A-move left, D-move right\n W-jump, S-enter/exit marble\n break boxes at high speeds', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.startButton = this.add.image(200, 300, 'button1');
        this.startButton.setScale(2);
        this.startButton.setInteractive();

        this.startText = this.add.text(200, 300, 'Test Level', {
            fontSize: '32px',
            fill: '#2c2c2c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.startButton.on('pointerdown', () => {
            this.scene.start('loadScene');
        });

        this.startButton.on('pointerover', () => {
            this.startButton.setScale(2.5);
        });

        this.startButton.on('pointerout', () => {
            this.startButton.setScale(2);
        });
    }
}

