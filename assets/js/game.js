// 🎮 Space Shooter Game
class SpaceShooterGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        this.gamePaused = false;
        this.isGameOver = false;
        
        // Game state
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.gameSpeed = 0.5;
        
        // Game objects
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];
        this.stars = [];
        this.powerUps = [];
        
        // Input handling
        this.keys = {};
        
        // Game loop
        this.lastTime = 0;
        this.animationId = null;
        this.gameStartTime = 0; // Thời gian bắt đầu game
        this.lastPowerUpSpawnTime = 0; // Thời gian spawn power-up cuối
        this.powerUpCooldown = 30000; // 30 giây cooldown giữa các power-ups
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createStars();
        this.createPlayer();
        this.updateUI();
    }
    
    setupCanvas() {
        // Make canvas responsive
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(800, container.clientWidth - 40);
        this.canvas.width = maxWidth;
        this.canvas.height = Math.floor(maxWidth * 1.0); // 1:1 aspect ratio - vuông
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Game buttons
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        
        // Auto start game when page loads
        this.startGame();
        
        // Click on canvas to restart when game over
        this.canvas.addEventListener('click', (e) => {
            if (this.isGameOver) {
                this.resetGame();
                this.startGame();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    createStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    createPlayer() {
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 60,
            width: 50,
            height: 50,
            speed: 8, // Tăng từ 5 lên 8
            lastShot: 0,
            shootCooldown: 150,
            damage: 1
        };
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.isGameOver = false;
            this.gameStartTime = Date.now(); // Ghi nhận thời gian bắt đầu
            this.createPlayer();
            this.gameLoop();
            this.updateButtons();
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            this.updateButtons();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.isGameOver = false;
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.gameSpeed = 0.5;
        
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];
        this.lastPowerUpSpawnTime = 0; // Reset cooldown
        
        this.createPlayer();
        this.updateUI();
        this.updateButtons();
        this.draw();
    }
    
    updateButtons() {
        const startBtn = document.getElementById('startGame');
        const pauseBtn = document.getElementById('pauseGame');
        const resetBtn = document.getElementById('resetGame');
        
        if (this.gameRunning && !this.gamePaused) {
            startBtn.disabled = true;
            startBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i> Đang chơi';
            pauseBtn.disabled = false;
            pauseBtn.innerHTML = '<i class="bi bi-pause-fill me-2"></i> Tạm dừng';
            resetBtn.disabled = false;
        } else if (this.gameRunning && this.gamePaused) {
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i> Tiếp tục';
            pauseBtn.disabled = false;
            pauseBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i> Tiếp tục';
            resetBtn.disabled = false;
        } else if (this.isGameOver) {
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i> Chơi lại';
            pauseBtn.disabled = true;
            pauseBtn.innerHTML = '<i class="bi bi-pause-fill me-2"></i> Tạm dừng';
            resetBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i> Bắt đầu';
            pauseBtn.disabled = true;
            pauseBtn.innerHTML = '<i class="bi bi-pause-fill me-2"></i> Tạm dừng';
            resetBtn.disabled = true;
        }
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (!this.gamePaused) {
            this.update(deltaTime);
        }
        
        this.draw();
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateParticles();
        this.updateStars();
        this.spawnEnemies();
        this.spawnPowerUps();
        this.updatePowerUps();
        this.checkCollisions();
        this.updateUI();
    }
    
    updatePlayer() {
        if (!this.player) return;
        
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        if (this.keys['ArrowUp'] && this.player.y > 0) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['ArrowDown'] && this.player.y < this.canvas.height - this.player.height) {
            this.player.y += this.player.speed;
        }
    }
    
    shoot() {
        if (!this.gameRunning || this.gamePaused || !this.player) return;
        
        const now = Date.now();
        if (now - this.player.lastShot > this.player.shootCooldown) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 3,
                y: this.player.y,
                width: 6, // Tăng từ 4 lên 6
                height: 12, // Tăng từ 10 lên 12
                speed: 4
            });
            this.player.lastShot = now;
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed;
            
            if (bullet.y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed * this.gameSpeed;
            
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(i, 1);
                this.health -= 10;
                if (this.health <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateStars() {
        for (let star of this.stars) {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }
    
    spawnEnemies() {
        if (Math.random() < 0.01 * this.gameSpeed) { // Giảm spawn rate
            // Kiểm tra thời gian - boss không xuất hiện trong 15s đầu
            const currentTime = Date.now();
            const gameTime = currentTime - this.gameStartTime;
            const bossDelay = 15000; // 15 giây
            
            // 80% chance: Enemy thường (1 máu)
            // 20% chance: Boss enemy (chỉ sau 15s)
            const canSpawnBoss = gameTime > bossDelay;
            const isBoss = canSpawnBoss && Math.random() < 0.2;
            
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: isBoss ? 0.5 + Math.random() * 0.5 : 1 + Math.random() * 1, // Boss chậm hơn
                health: isBoss ? 30 + Math.floor(Math.random() * 20) : 1, // Boss: 30-50 máu, thường: 1 máu
                isBoss: isBoss,
                maxHealth: isBoss ? 30 + Math.floor(Math.random() * 20) : 1
            });
        }
    }
    
    spawnPowerUps() {
        const currentTime = Date.now();
        const timeSinceLastPowerUp = currentTime - this.lastPowerUpSpawnTime;
        
        // Chỉ spawn nếu đã đủ cooldown và random chance
        if (timeSinceLastPowerUp > this.powerUpCooldown && Math.random() < 0.0005) {
            const types = ['health', 'repair'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            this.powerUps.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: 0.2, // Chậm hơn nữa để dễ thu thập
                type: type,
                collected: false
            });
            
            // Cập nhật thời gian spawn cuối
            this.lastPowerUpSpawnTime = currentTime;
        }
    }
    
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;
            
            if (powerUp.y > this.canvas.height || powerUp.collected) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Bullets vs Enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (this.isColliding(bullet, enemy)) {
                    this.bullets.splice(i, 1);
                    // Giảm health của enemy thay vì xóa ngay
                    enemy.health = (enemy.health || 1) - (this.player ? this.player.damage : 1);
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        // Boss cho nhiều điểm hơn
                        this.score += enemy.isBoss ? 50 : 10;
                        this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    }
                    break;
                }
            }
        }
        
        // Player vs Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (this.isColliding(this.player, enemy)) {
                this.enemies.splice(i, 1);
                this.health -= 20;
                this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                if (this.health <= 0) {
                    this.gameOver();
                }
            }
        }
        
        // Player vs Power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (this.isColliding(this.player, powerUp)) {
                this.collectPowerUp(powerUp);
                this.powerUps.splice(i, 1);
            }
        }
        
        // Level up - dễ hơn
        if (this.score > 0 && this.score % 50 === 0) {
            this.levelUp();
        }
    }
    
    isColliding(rect1, rect2) {
        // Tăng hitbox để dễ hit hơn
        const margin = 5; // Thêm 5px margin cho mỗi bên
        return rect1.x - margin < rect2.x + rect2.width + margin &&
               rect1.x + rect1.width + margin > rect2.x - margin &&
               rect1.y - margin < rect2.y + rect2.height + margin &&
               rect1.y + rect1.height + margin > rect2.y - margin;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color: `hsl(${Math.random() * 60 + 20}, 100%, 50%)`
            });
        }
    }
    
    collectPowerUp(powerUp) {
        if (powerUp.type === 'health') {
            this.health = Math.min(100, this.health + 30);
            this.createExplosion(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2);
        } else if (powerUp.type === 'repair') {
            this.health = Math.min(100, this.health + 50);
            this.createExplosion(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2);
        }
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            // Power-up glow effect - mạnh hơn vì hiếm
            this.ctx.shadowColor = powerUp.type === 'health' ? '#ff6b6b' : '#ffa502';
            this.ctx.shadowBlur = 30; // Tăng glow vì hiếm
            
            // Rarity indicator - viền vàng cho hiếm
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(powerUp.x - 2, powerUp.y - 2, powerUp.width + 4, powerUp.height + 4);
            
            if (powerUp.type === 'health') {
                // Vẽ trái tim với gradient
                const heartGradient = this.ctx.createRadialGradient(powerUp.x + 15, powerUp.y + 15, 0, powerUp.x + 15, powerUp.y + 15, 12);
                heartGradient.addColorStop(0, '#ffffff');
                heartGradient.addColorStop(0.5, '#ff6b6b');
                heartGradient.addColorStop(1, '#ff4757');
                
                this.ctx.fillStyle = heartGradient;
                this.ctx.beginPath();
                this.ctx.arc(powerUp.x + 15, powerUp.y + 15, 10, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Heart pulse animation - mạnh hơn
                const time = Date.now() * 0.008;
                const pulse = 1 + Math.sin(time) * 0.3;
                this.ctx.fillStyle = '#ff4757';
                this.ctx.beginPath();
                this.ctx.arc(powerUp.x + 15, powerUp.y + 15, 6 * pulse, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Rarity sparkles
                this.ctx.fillStyle = '#ffd700';
                for (let i = 0; i < 4; i++) {
                    const angle = time * 2 + i * Math.PI / 2;
                    const x = powerUp.x + 15 + Math.cos(angle) * 12;
                    const y = powerUp.y + 15 + Math.sin(angle) * 12;
                    this.ctx.fillRect(x, y, 2, 2);
                }
                
            } else if (powerUp.type === 'repair') {
                // Vẽ búa sửa chữa với gradient
                const repairGradient = this.ctx.createLinearGradient(powerUp.x, powerUp.y, powerUp.x, powerUp.y + powerUp.height);
                repairGradient.addColorStop(0, '#ffd43b');
                repairGradient.addColorStop(0.5, '#ffa502');
                repairGradient.addColorStop(1, '#ff8c00');
                
                this.ctx.fillStyle = repairGradient;
                this.ctx.fillRect(powerUp.x + 5, powerUp.y + 5, 20, 20);
                
                // Hammer head
                this.ctx.fillStyle = '#ff6348';
                this.ctx.fillRect(powerUp.x + 8, powerUp.y + 8, 14, 8);
                
                // Hammer handle
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(powerUp.x + 12, powerUp.y + 16, 6, 8);
                
                // Enhanced sparkle effect
                const time = Date.now() * 0.015;
                this.ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 5; i++) {
                    const angle = time + i * Math.PI * 2 / 5;
                    const x = powerUp.x + 15 + Math.cos(angle) * 10;
                    const y = powerUp.y + 15 + Math.sin(angle) * 10;
                    this.ctx.fillRect(x, y, 3, 3);
                }
            }
            
            // Enhanced pulsing border
            const time = Date.now() * 0.008;
            const alpha = 0.7 + 0.3 * Math.sin(time);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
            
            // Rarity text
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 6px Arial';
            this.ctx.fillText('RARE', powerUp.x + 2, powerUp.y - 5);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        });
    }
    
    levelUp() {
        this.level++;
        // Không tăng gameSpeed nữa để giữ tốc độ ổn định
        if (this.player) {
            this.player.shootCooldown = Math.max(100, this.player.shootCooldown - 10); // Bắn nhanh hơn
            this.player.damage = (this.player.damage || 1) + 0.5; // Tăng sát thương
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.isGameOver = true;
        this.updateButtons();
        // Game over screen will be drawn in the draw() method
    }
    
    updateUI() {
        document.getElementById('health').textContent = this.health;
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        
        // Hiển thị thời gian còn lại trước khi boss xuất hiện
        if (this.gameRunning && !this.isGameOver) {
            const currentTime = Date.now();
            const gameTime = currentTime - this.gameStartTime;
            const bossDelay = 15000; // 15 giây
            const timeLeft = Math.max(0, bossDelay - gameTime);
            
            if (timeLeft > 0) {
                const secondsLeft = Math.ceil(timeLeft / 1000);
                // Có thể thêm indicator ở đây nếu cần
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.drawStars();
        
        // Draw game objects
        this.drawPlayer();
        this.drawBullets();
        this.drawEnemies();
        this.drawPowerUps();
        this.drawParticles();
        
        // Draw game over screen
        if (this.isGameOver) {
            this.drawGameOver();
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let star of this.stars) {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawPlayer() {
        if (!this.player) return;
        
        // Pixel art style - tắt anti-aliasing
        this.ctx.imageSmoothingEnabled = false;
        
        const x = this.player.x;
        const y = this.player.y;
        
        // Pixel art rocket - 16x32 pixels
        // Nose cone (mũi tên lửa)
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(x + 7, y, 2, 1);   // Top point
        this.ctx.fillStyle = '#ff6666';
        this.ctx.fillRect(x + 6, y + 1, 4, 1);
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(x + 5, y + 2, 6, 1);
        this.ctx.fillStyle = '#ff6666';
        this.ctx.fillRect(x + 4, y + 3, 8, 1);
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(x + 3, y + 4, 10, 1);
        
        // Main body (thân tên lửa)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 2, y + 5, 12, 1);
        this.ctx.fillStyle = '#e6f3ff';
        this.ctx.fillRect(x + 2, y + 6, 12, 1);
        this.ctx.fillStyle = '#4dabf7';
        this.ctx.fillRect(x + 2, y + 7, 12, 1);
        this.ctx.fillStyle = '#0d6efd';
        this.ctx.fillRect(x + 2, y + 8, 12, 1);
        this.ctx.fillStyle = '#1c7ed6';
        this.ctx.fillRect(x + 2, y + 9, 12, 1);
        
        // Cockpit window (cửa sổ)
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(x + 6, y + 10, 4, 3);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 7, y + 11, 2, 1);
        
        // Body continuation
        this.ctx.fillStyle = '#0d6efd';
        this.ctx.fillRect(x + 2, y + 13, 12, 1);
        this.ctx.fillStyle = '#1c7ed6';
        this.ctx.fillRect(x + 2, y + 14, 12, 1);
        this.ctx.fillStyle = '#0d6efd';
        this.ctx.fillRect(x + 2, y + 15, 12, 1);
        
        // Rocket stripes (sọc)
        this.ctx.fillStyle = '#ff6666';
        this.ctx.fillRect(x + 2, y + 16, 12, 1);
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillRect(x + 2, y + 18, 12, 1);
        
        // Body bottom
        this.ctx.fillStyle = '#0d6efd';
        this.ctx.fillRect(x + 2, y + 20, 12, 1);
        this.ctx.fillStyle = '#1c7ed6';
        this.ctx.fillRect(x + 2, y + 21, 12, 1);
        this.ctx.fillStyle = '#0d6efd';
        this.ctx.fillRect(x + 2, y + 22, 12, 1);
        
        // Engine nozzle (vòi phun)
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x + 4, y + 23, 8, 2);
        
        // Rocket fins (cánh tên lửa) - 4 cánh
        this.ctx.fillStyle = '#339af0';
        // Fin 1 (trái)
        this.ctx.fillRect(x, y + 20, 2, 4);
        this.ctx.fillRect(x, y + 21, 1, 2);
        // Fin 2 (phải)
        this.ctx.fillRect(x + 14, y + 20, 2, 4);
        this.ctx.fillRect(x + 15, y + 21, 1, 2);
        // Fin 3 (trên)
        this.ctx.fillRect(x + 6, y + 18, 4, 2);
        this.ctx.fillRect(x + 7, y + 17, 2, 1);
        // Fin 4 (dưới)
        this.ctx.fillRect(x + 6, y + 26, 4, 2);
        this.ctx.fillRect(x + 7, y + 28, 2, 1);
        
        // Engine flame animation (lửa tên lửa)
        const time = Date.now() * 0.01;
        const flameFrame = Math.floor(time * 4) % 4; // 4 frame animation
        
        // Flame colors
        const flameColors = ['#ff4444', '#ff6666', '#ffaa00', '#ffaa00'];
        const flameColor = flameColors[flameFrame];
        
        // Outer flame
        this.ctx.fillStyle = flameColor;
        this.ctx.fillRect(x + 5, y + 25, 6, 2);
        this.ctx.fillRect(x + 6, y + 27, 4, 1);
        
        // Inner flame
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillRect(x + 6, y + 26, 4, 1);
        
        // Core flame
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 7, y + 26, 2, 1);
        
        // Rocket glow effect
        this.ctx.shadowColor = '#00bfff';
        this.ctx.shadowBlur = 8;
        this.ctx.fillStyle = 'rgba(0, 191, 255, 0.3)';
        this.ctx.fillRect(x, y, 16, 32);
        this.ctx.shadowBlur = 0;
        
        // Reset image smoothing
        this.ctx.imageSmoothingEnabled = true;
    }
    
    drawBullets() {
        for (let bullet of this.bullets) {
            // Bullet glow effect - mạnh hơn vì to hơn
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 15;
            
            // Bullet gradient
            const bulletGradient = this.ctx.createLinearGradient(bullet.x, bullet.y, bullet.x, bullet.y + bullet.height);
            bulletGradient.addColorStop(0, '#ffffff');
            bulletGradient.addColorStop(0.5, '#00ff00');
            bulletGradient.addColorStop(1, '#00cc00');
            
            this.ctx.fillStyle = bulletGradient;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // Bullet trail effect - dài hơn
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
            this.ctx.fillRect(bullet.x, bullet.y + bullet.height, bullet.width, 5);
            
            // Hitbox indicator - viền mờ để hiển thị hitbox
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(bullet.x - 5, bullet.y - 5, bullet.width + 10, bullet.height + 10);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawEnemies() {
        for (let enemy of this.enemies) {
            // Enemy glow effect - Boss có glow mạnh hơn
            this.ctx.shadowColor = enemy.isBoss ? '#ff6600' : '#ff0000';
            this.ctx.shadowBlur = enemy.isBoss ? 25 : 15;
            
            if (enemy.isBoss) {
                // Boss enemy - to hơn và đặc biệt
                const bossSize = 1.5;
                const scaledWidth = enemy.width * bossSize;
                const scaledHeight = enemy.height * bossSize;
                const offsetX = (enemy.width - scaledWidth) / 2;
                const offsetY = (enemy.height - scaledHeight) / 2;
                
                // Boss gradient - màu cam đỏ
                const bossGradient = this.ctx.createLinearGradient(enemy.x, enemy.y, enemy.x, enemy.y + enemy.height);
                bossGradient.addColorStop(0, '#ff6600');
                bossGradient.addColorStop(0.5, '#ff3300');
                bossGradient.addColorStop(1, '#cc0000');
                
                this.ctx.fillStyle = bossGradient;
                this.ctx.fillRect(enemy.x + offsetX, enemy.y + offsetY, scaledWidth, scaledHeight);
                
                // Boss crown
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(enemy.x + 10, enemy.y + 5, 10, 5);
                this.ctx.fillRect(enemy.x + 8, enemy.y + 3, 14, 3);
                
                // Boss eyes - đỏ sáng
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(enemy.x + 12, enemy.y + 12, 3, 3);
                this.ctx.fillRect(enemy.x + 15, enemy.y + 12, 3, 3);
                
                // Boss wings - to hơn
                this.ctx.fillStyle = '#ff4400';
                this.ctx.fillRect(enemy.x + 3, enemy.y + 25, 12, 8);
                this.ctx.fillRect(enemy.x + 15, enemy.y + 25, 12, 8);
                
                // Boss health bar - luôn hiển thị
                this.ctx.fillStyle = '#333333';
                this.ctx.fillRect(enemy.x - 1, enemy.y - 8, enemy.width + 2, 6);
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(enemy.x, enemy.y - 7, enemy.width, 4);
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(enemy.x, enemy.y - 7, enemy.width * (enemy.health / enemy.maxHealth), 4);
                
                // Boss label
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 8px Arial';
                this.ctx.fillText('BOSS', enemy.x + 5, enemy.y - 10);
                
            } else {
                // Enemy thường - nhỏ và đơn giản
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Enemy cockpit
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.fillRect(enemy.x + 10, enemy.y + 10, 10, 10);
                
                // Enemy eyes
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(enemy.x + 12, enemy.y + 12, 3, 3);
                this.ctx.fillRect(enemy.x + 15, enemy.y + 12, 3, 3);
                
                // Enemy wings
                this.ctx.fillStyle = '#cc0000';
                this.ctx.fillRect(enemy.x + 5, enemy.y + 25, 8, 5);
                this.ctx.fillRect(enemy.x + 17, enemy.y + 25, 8, 5);
            }
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawParticles() {
        for (let particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game Over title with gradient effect
        this.ctx.font = 'bold 64px Arial';
        this.ctx.textAlign = 'center';
        
        // Create gradient for title
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.5, '#4ecdc4');
        gradient.addColorStop(1, '#45b7d1');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 80);
        
        // Score and level info
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`Level Reached: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Restart instruction
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#ffc107';
        this.ctx.fillText('Click anywhere to restart', this.canvas.width / 2, this.canvas.height / 2 + 80);
        
        // Additional instruction
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#adb5bd';
        this.ctx.fillText('Game will auto-start when you click', this.canvas.width / 2, this.canvas.height / 2 + 110);
        
        // Draw some decorative elements
        this.drawGameOverDecorations();
    }
    
    drawGameOverDecorations() {
        // Draw some stars around the text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 3 + 1;
            
            this.ctx.fillRect(x, y, size, size);
        }
        
        this.ctx.globalAlpha = 1;
        
        // Draw border around the game over area
        this.ctx.strokeStyle = '#0d6efd';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(50, this.canvas.height / 2 - 120, this.canvas.width - 100, 200);
        
        // Add pulsing effect to indicate clickable area
        const time = Date.now() * 0.005;
        this.ctx.strokeStyle = `rgba(13, 110, 253, ${0.5 + 0.3 * Math.sin(time)})`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.strokeRect(50, this.canvas.height / 2 - 120, this.canvas.width - 100, 200);
        this.ctx.setLineDash([]);
        
        // Add cursor pointer effect
        this.canvas.style.cursor = this.isGameOver ? 'pointer' : 'default';
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    const game = new SpaceShooterGame();
    
    // Auto-start game after 2 seconds
    setTimeout(() => {
        if (!game.gameRunning) {
            game.startGame();
        }
    }, 2000);
});
