class ThemePark {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        this.gridSize = 40;
        this.player = {
            x: 0,
            y: 0,
            color: 'blue',
            size: 30,
            score: 0,
            sprite: this.createPlayerSprite()
        };
        this.rides = [];
        this.items = [
            { x: 7, y: 4, color: 'gold', collected: false },
            { x: 12, y: 9, color: 'gold', collected: false },
        ];
        this.obstacles = [
            { x: 6, y: 6, color: 'brown' },
            { x: 9, y: 10, color: 'brown' },
        ];
        this.visitors = [];
        this.selectedRide = null;
        this.setupKeyboardListeners();
        this.setupMouseListeners();
        this.draw();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                    this.movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                    this.movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePlayer(1, 0);
                    break;
            }
        });
    }

    setupMouseListeners() {
        this.canvas.addEventListener('click', (e) => {
            if (this.selectedRide) {
                const rect = this.canvas.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / this.gridSize);
                const y = Math.floor((e.clientY - rect.top) / this.gridSize);
                this.addRideAtPosition(this.selectedRide, x, y);
                this.selectedRide = null;
            }
        });
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (newX >= 0 && newX < this.canvas.width / this.gridSize &&
            newY >= 0 && newY < this.canvas.height / this.gridSize &&
            !this.obstacles.some(obstacle => obstacle.x === newX && obstacle.y === newY)) {
            this.player.x = newX;
            this.player.y = newY;
            this.checkInteractions();
            this.draw();
        }
    }

    checkInteractions() {
        this.rides.forEach(ride => {
            if (this.player.x === ride.x && this.player.y === ride.y && !ride.visited) {
                alert(`You have reached the ${ride.name}!`);
                ride.visited = true;
            }
        });

        this.items.forEach(item => {
            if (this.player.x === item.x && this.player.y === item.y && !item.collected) {
                item.collected = true;
                this.player.score += 10;
                this.updateGameStatus();
            }
        });
    }

    updateGameStatus() {
        const status = document.getElementById('gameStatus');
        status.textContent = `Score: ${this.player.score}`;
    }

    drawGrid() {
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            for (let y = 0; y < this.canvas.height; y += this.gridSize) {
                this.context.strokeStyle = '#ccc';
                this.context.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }
    }

    createPlayerSprite() {
        const spriteCanvas = document.createElement('canvas');
        const spriteContext = spriteCanvas.getContext('2d');
        spriteCanvas.width = this.player.size;
        spriteCanvas.height = this.player.size;

        // Draw the player (simplified as a stick figure with shading)
        spriteContext.fillStyle = this.player.color;
        spriteContext.beginPath();
        spriteContext.arc(this.player.size / 2, this.player.size / 2, this.player.size / 4, 0, Math.PI * 2);
        spriteContext.fill();

        spriteContext.strokeStyle = 'black';
        spriteContext.lineWidth = 2;
        spriteContext.beginPath();
        spriteContext.moveTo(this.player.size / 2, this.player.size * 0.75);
        spriteContext.lineTo(this.player.size / 2, this.player.size);
        spriteContext.stroke();

        spriteContext.beginPath();
        spriteContext.moveTo(this.player.size / 2, this.player.size * 0.85);
        spriteContext.lineTo(this.player.size * 0.65, this.player.size * 0.95);
        spriteContext.stroke();

        spriteContext.beginPath();
        spriteContext.moveTo(this.player.size / 2, this.player.size * 0.85);
        spriteContext.lineTo(this.player.size * 0.35, this.player.size * 0.95);
        spriteContext.stroke();

        return spriteCanvas;
    }

    drawPlayer() {
        this.context.drawImage(this.player.sprite, this.player.x * this.gridSize, this.player.y * this.gridSize);
    }

    drawFerrisWheel(x, y) {
        const { context, gridSize } = this;

        // Draw base
        context.fillStyle = 'gray';
        context.fillRect(x * gridSize + gridSize * 0.3, y * gridSize + gridSize * 0.8, gridSize * 0.4, gridSize * 0.2);

        // Draw wheel with 3D effect
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize * 0.4, 0, Math.PI * 2);
        context.stroke();

        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize * 0.38, 0, Math.PI * 2);
        context.stroke();

        // Draw spokes
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            context.beginPath();
            context.moveTo(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2);
            context.lineTo(
                x * gridSize + gridSize / 2 + Math.cos(angle) * gridSize * 0.4,
                y * gridSize + gridSize / 2 + Math.sin(angle) * gridSize * 0.4
            );
            context.stroke();
        }

        // Draw cabins with 3D effect
        context.fillStyle = 'blue';
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            context.beginPath();
            context.arc(
                x * gridSize + gridSize / 2 + Math.cos(angle) * gridSize * 0.4,
                y * gridSize + gridSize / 2 + Math.sin(angle) * gridSize * 0.4,
                gridSize * 0.05,
                0,
                Math.PI * 2
            );
            context.fill();
            context.stroke();
        }
    }

    drawCarousel(x, y) {
        const { context, gridSize } = this;

        // Draw base
        context.fillStyle = 'yellow';
        context.fillRect(x * gridSize + gridSize * 0.3, y * gridSize + gridSize * 0.7, gridSize * 0.4, gridSize * 0.3);

        // Draw roof with 3D effect
        context.fillStyle = 'red';
        context.beginPath();
        context.moveTo(x * gridSize + gridSize * 0.3, y * gridSize + gridSize * 0.7);
        context.lineTo(x * gridSize + gridSize * 0.5, y * gridSize + gridSize * 0.5);
        context.lineTo(x * gridSize + gridSize * 0.7, y * gridSize + gridSize * 0.7);
        context.fill();
        context.stroke();

        // Draw poles with 3D effect
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x * gridSize + gridSize * 0.4, y * gridSize + gridSize * 0.7);
        context.lineTo(x * gridSize + gridSize * 0.4, y * gridSize + gridSize * 0.8);
        context.stroke();

        context.beginPath();
        context.moveTo(x * gridSize + gridSize * 0.6, y * gridSize + gridSize * 0.7);
        context.lineTo(x * gridSize + gridSize * 0.6, y * gridSize + gridSize * 0.8);
        context.stroke();
    }

    drawRollerCoaster(x, y) {
        const { context, gridSize } = this;

        // Draw base with 3D effect
        context.fillStyle = 'blue';
        context.fillRect(x * gridSize + gridSize * 0.2, y * gridSize + gridSize * 0.8, gridSize * 0.6, gridSize * 0.2);

        // Draw tracks with 3D effect
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x * gridSize + gridSize * 0.2, y * gridSize + gridSize * 0.8);
        context.quadraticCurveTo(
            x * gridSize + gridSize * 0.5,
            y * gridSize,
            x * gridSize + gridSize * 0.8,
            y * gridSize + gridSize * 0.8
        );
        context.stroke();

        // Draw supports
        context.strokeStyle = 'gray';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x * gridSize + gridSize * 0.4, y * gridSize + gridSize * 0.8);
        context.lineTo(x * gridSize + gridSize * 0.4, y * gridSize);
        context.stroke();

        context.beginPath();
        context.moveTo(x * gridSize + gridSize * 0.6, y * gridSize + gridSize * 0.8);
        context.lineTo(x * gridSize + gridSize * 0.6, y * gridSize);
        context.stroke();
    }

    drawItems() {
        this.items.forEach(item => {
            if (!item.collected) {
                this.context.fillStyle = item.color;
                this.context.beginPath();
                this.context.arc(
                    item.x * this.gridSize + this.gridSize / 2,
                    item.y * this.gridSize + this.gridSize / 2,
                    this.gridSize / 4,
                    0,
                    Math.PI * 2
                );
                this.context.fill();
            }
        });
    }

    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.context.fillStyle = obstacle.color;
            this.context.fillRect(
                obstacle.x * this.gridSize,
                obstacle.y * this.gridSize,
                this.gridSize,
                this.gridSize
            );
        });
    }

    drawVisitors() {
        this.visitors.forEach(visitor => {
            this.context.fillStyle = 'green';
            this.context.fillRect(
                visitor.x * this.gridSize + this.gridSize / 4,
                visitor.y * this.gridSize + this.gridSize / 4,
                this.gridSize / 2,
                this.gridSize / 2
            );
        });
    }

    drawAttractions() {
        this.rides.forEach(ride => {
            ride.draw(ride.x, ride.y);
        });
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawPlayer();
        this.drawItems();
        this.drawObstacles();
        this.drawVisitors();
        this.drawAttractions();
    }

    addRide(rideType) {
        this.selectedRide = rideType;
    }

    addRideAtPosition(rideType, x, y) {
        if (!this.rides.some(ride => ride.x === x && ride.y === y)) {
            switch (rideType) {
                case 'ferrisWheel':
                    this.rides.push({ x, y, draw: this.drawFerrisWheel.bind(this), name: 'Ferris Wheel' });
                    break;
                case 'carousel':
                    this.rides.push({ x, y, draw: this.drawCarousel.bind(this), name: 'Carousel' });
                    break;
                case 'rollerCoaster':
                    this.rides.push({ x, y, draw: this.drawRollerCoaster.bind(this), name: 'Roller Coaster' });
                    break;
            }
            this.draw();
        }
    }
}

const park = new ThemePark();
