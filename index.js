const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position:{
        x: 0, y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position:{
        x: 600,
        y: 128,
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})


const player = new Fighter({
    position: {
        x: 100,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset1 : {
        x: 0,
        y: 0,
    },
    type: 'player',
    imageSrc: './img/nhanvat1/idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 215,
        y: 145
    },
    sprites: {
        idle: {
            imageSrc: './img/nhanvat1/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/nhanvat1/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/nhanvat1/jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/nhanvat1/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/nhanvat1/Attack1.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y:50,
        },
        width: 160,
        height: 50,
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset1 : {
        x: -50,
        y: 0,
    },
    type: 'enemy',
    imageSrc: './img/nhanvat2/idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './img/nhanvat2/idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/nhanvat2/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/nhanvat2/jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/nhanvat2/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/nhanvat2/Attack1.png',
            framesMax: 4,
        }
    },
    attackBox: {
        offset: {
            x: 0,
            y:0,
        },
        width: 100,
        height: 50,
    }
});

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
};

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement-chuyển động của người chơi
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run');
    } else {
        player.switchSprite('idle')
    }

    //jumping-nhảy
    if(player.velocity.y < 0) {
      player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement-chuyển động của kẻ thù
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && !keys.ArrowRight.pressed) {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && !keys.ArrowLeft.pressed) {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //jumping-nhảy
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');

    }

    // detect for collision-phát hiện va chạm

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }


    // detect for collision and handle attacks-phát hiện va chạm và xử lý các cuộc tấn công
    player.handleCollision(enemy);
    enemy.handleCollision(player);

    //end game based on health-kết thúc trò chơi dựa trên sức khỏe
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player,enemy, timerId})
    }
}

animate();

// player movement-chuyển động của người chơi
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -10;
            break;
        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -10;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
});
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            if (!keys.ArrowRight.pressed) {
                keys.ArrowLeft.pressed = false;
            }
            break;
        case 'ArrowDown':
            enemy.isAttacking = false;
            break;
    }
});


