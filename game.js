const game = Modu.createGame();

// Add auto renderer plugin
game.addPlugin(Modu.AutoRenderer, document.getElementById('game'));

// Define player entity
game.defineEntity('player')
    .with(Modu.Transform2D, { x: 400, y: 300 })
    .with(Modu.Sprite, { shape: 'circle', radius: 20, color: '#00ff88' })
    .with('velocity', { vx: 0, vy: 0 })
    .with('playerController', { speed: 200 })
    .register();

// Track input state
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Spawn the player
const player = game.spawn('player');

// Game update loop
game.onUpdate((dt) => {
    const entities = game.query('playerController', 'velocity', Modu.Transform2D);
    
    entities.forEach((entity) => {
        const controller = entity.get('playerController');
        const velocity = entity.get('velocity');
        const transform = entity.get(Modu.Transform2D);
        
        // Reset velocity
        velocity.vx = 0;
        velocity.vy = 0;
        
        // Handle input
        if (keys['w'] || keys['arrowup']) velocity.vy = -controller.speed;
        if (keys['s'] || keys['arrowdown']) velocity.vy = controller.speed;
        if (keys['a'] || keys['arrowleft']) velocity.vx = -controller.speed;
        if (keys['d'] || keys['arrowright']) velocity.vx = controller.speed;
        
        // Normalize diagonal movement
        if (velocity.vx !== 0 && velocity.vy !== 0) {
            velocity.vx *= 0.707;
            velocity.vy *= 0.707;
        }
        
        // Apply velocity
        transform.x += velocity.vx * dt;
        transform.y += velocity.vy * dt;
        
        // Keep player in bounds
        transform.x = Math.max(20, Math.min(780, transform.x));
        transform.y = Math.max(20, Math.min(580, transform.y));
    });
});

// Start the game
game.start();