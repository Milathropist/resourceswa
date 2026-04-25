/**
 * Interactive Background: Dots connecting to cursor with lines.
 * Implemented using HTML5 Canvas.
 */
(function() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouse = { x: null, y: null, radius: 150 }; // Radius for dots to connect to mouse

  // Configuration
  const config = {
    dotColor: 'rgba(144, 238, 144, 0.8)',
    lineColor: 'rgba(144, 238, 144, 0.1)', // Fades out with distance to cursor
    dotMinSize: 1,
    dotMaxSize: 3,
    dotSpeed: 0.5, // Max speed for dot movement
    dotDensityFactor: 9000, // Smaller number means more dots
    connectionRadius: 150 // How far from the mouse dots will connect
  };

  // 1. Setup Canvas
  function setupCanvas() {
    // Hide the theme's default background element to ensure the canvas is visible
    const defaultBg = document.getElementById('bg');
    if (defaultBg) defaultBg.style.display = 'none';

    canvas.id = 'interactive-background-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.backgroundColor = '#0d100d';
    canvas.style.zIndex = '0'; // Place behind UI elements but above the base background
    canvas.style.pointerEvents = 'none'; // Allow mouse events to pass through to elements below
    document.body.appendChild(canvas);
    resizeCanvas();
  }

  // 2. Handle Canvas Resizing
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots(); // Re-initialize dots on resize to adapt to new dimensions
  }

  // 3. Mouse Tracking
  function handleMouseMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }

  // 4. Dot Object Class
  class Dot {
    constructor(x, y, dx, dy, size, color) {
      this.x = x;
      this.y = y;
      this.dx = dx; // velocity x
      this.dy = dy; // velocity y
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off canvas edges
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;

      this.draw();
    }
  }

  // 5. Initialize Dots Array
  function initDots() {
    dots = [];
    const numberOfDots = (canvas.width * canvas.height) / config.dotDensityFactor;
    for (let i = 0; i < numberOfDots; i++) {
      const size = Math.random() * (config.dotMaxSize - config.dotMinSize) + config.dotMinSize;
      const x = Math.random() * (canvas.width - 2 * size) + size;
      const y = Math.random() * (canvas.height - 2 * size) + size;
      const dx = (Math.random() - 0.5) * config.dotSpeed;
      const dy = (Math.random() - 0.5) * config.dotSpeed;
      dots.push(new Dot(x, y, dx, dy, size, config.dotColor));
    }
  }

  // 6. Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for redraw

    for (let i = 0; i < dots.length; i++) {
      dots[i].update();

      // Connect dots to mouse if within connectionRadius
      if (mouse.x !== null && mouse.y !== null) {
        const distance = Math.sqrt(
          (mouse.x - dots[i].x) ** 2 + (mouse.y - dots[i].y) ** 2
        );

        if (distance < config.connectionRadius) {
          // Line opacity decreases with distance from mouse
          ctx.strokeStyle = `rgba(144, 238, 144, ${1 - distance / config.connectionRadius})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // 7. Event Listeners
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', handleMouseMove);
  // Reset mouse position when leaving the window to stop drawing lines
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // 8. Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    setupCanvas();
    initDots();
    animate();
  });

})();