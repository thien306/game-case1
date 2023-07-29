class Sprite {
    constructor({
                    position,
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offset = {x: 0, y: 0},

                }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framasElapsed = 0;
        this.framesHold = 15;
        this.offset = offset

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax, this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale,
        )
    }

    animateFrame() {
        this.framasElapsed++

        if (this.framasElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
       this.animateFrame()
    }
}

class Fighter extends Sprite {
    constructor({
                    position,
                    velocity,
                    color = 'red',
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offset = {x: 0, y: 0},
                    sprites

                }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey = null;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color;
        this.isAttacking = false;
        this.height = 100;
        this.health = 100; // Định nghĩa máu cho player và enemy
        this.framesCurrent = 0;
        this.framasElapsed = 0;
        this.framesHold = 15;
        this.sprites = sprites
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }


    update() {
        this.draw();
        this.animateFrame()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function- hàm trọng lực
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 380;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    switchSprite(Sprite) {
        if (this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        ) return;

        switch (Sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent= 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent= 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    player.image = player.sprites.jump.image;
                    player.framesMax = player.sprites.jump.framesMax;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    player.image = player.sprites.fall.image;
                    player.framesMax = player.sprites.fall.framesMax;
                    this.framesCurrent= 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    player.image = player.sprites.attack1.image;
                    player.framesMax = player.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }

    handleCollision(otherSprite) {
        if (
            rectangularCollision({
                rectangle1: this,
                rectangle2: otherSprite,
            }) &&
            this.isAttacking &&
            this.type !== otherSprite.type // Kiểm tra loại của đối tượng
        ) {
            this.isAttacking = false;
            // Giảm máu của đối tượng bị tấn công
            otherSprite.health -= 20;
            document.querySelector(`#${otherSprite.type}Health`).style.width = otherSprite.health + '%';
        }
    }

}