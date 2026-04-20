document.addEventListener('DOMContentLoaded', () => {
    /* =========================================================================
       Mobile Hamburger Menu
       ========================================================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }


    /* =========================================================================
       Magnetic Button Hover Effect
       ========================================================================= */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const intensity = 0.3; 
            btn.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });


    /* =========================================================================
       Shooting Stars Background Animation (Canvas)
       ========================================================================= */
    const canvas = document.getElementById('starsCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let shootingStars = [];

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        }

        // Static stars for depth
        function initStars() {
            stars = [];
            for(let i=0; i<150; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        }

        // Shooting star object
        class ShootingStar {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * width * 1.5; // Start horizontally spread out
                this.y = 0; // Start at top
                this.len = (Math.random() * 80) + 20;
                this.speed = (Math.random() * 15) + 5;
                this.size = (Math.random() * 1) + 0.5;
                // Determine if we show a star based on randomness (don't show constantly)
                this.active = false;
                this.waitTime = Math.random() * 300;
            }

            update() {
                if(this.active) {
                    this.x -= this.speed;
                    this.y += this.speed;
                    
                    if(this.x < -this.len || this.y > height + this.len) {
                        this.reset();
                    }
                } else {
                    this.waitTime--;
                    if(this.waitTime <= 0) {
                        this.active = true;
                    }
                }
            }

            draw() {
                if(!this.active) return;
                
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.len, this.y - this.len);
                
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.len, this.y - this.len);
                
                // Always use light mode accent blue
                gradient.addColorStop(0, 'rgba(66, 129, 255, 0.8)'); 
                gradient.addColorStop(1, 'rgba(66, 129, 255, 0)');
                
                ctx.strokeStyle = gradient;
                ctx.stroke();
            }
        }

        for(let i=0; i<3; i++) {
            shootingStars.push(new ShootingStar());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw static stars
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                // Faint blue stars for light mode
                ctx.fillStyle = `rgba(66, 129, 255, ${s.alpha * 0.3})`;
                ctx.fill();
            });

            // Draw shooting stars
            shootingStars.forEach(ss => {
                ss.update();
                ss.draw();
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

});
