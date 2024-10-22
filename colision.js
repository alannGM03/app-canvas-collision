const canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 

// Obtiene las dimensiones de la pantalla actual 
const window_height = window.innerHeight; 
const window_width = window.innerWidth; 
canvas.height = window_height;
canvas.width = window_width; 

canvas.style.background = "#ff8"; 

class Circle { 
    constructor(x, y, radius, color, text, speed) { 
        this.posX = x; 
        this.posY = y; 
        this.radius = radius; 
        this.color = color;
        this.originalColor = color; // Almacena el color original 
        this.text = text; 
        this.speed = speed; 
        this.dx = 1 * this.speed; 
        this.dy = 1 * this.speed; 
        this.isColliding = false; // Nuevo: bandera para manejar colisiones
    } 

    draw(context) { 
        context.beginPath(); 
        context.strokeStyle = this.color; 
        context.textAlign = "center"; 
        context.textBaseline = "middle"; 
        context.font = "20px Arial"; 
        context.fillText(this.text, this.posX, this.posY); 

        context.lineWidth = 2; 
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); 
        context.stroke(); 
        context.closePath(); 
    } 

    update(context) { 
        this.draw(context); 

        // Actualizar la posición X 
        this.posX += this.dx; 
        // Cambiar la dirección si el círculo llega al borde del canvas en X 
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) { 
            this.dx = -this.dx; 
        }

        // Actualizar la posición Y 
        this.posY += this.dy; 
        // Cambiar la dirección si el círculo llega al borde del canvas en Y 
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) { 
            this.dy = -this.dy; 
        }

        // Restaurar el color si no está colisionando
        if (!this.isColliding) {
            this.color = this.originalColor;
        }
    }

    // Método para detectar colisión con otro círculo
    checkCollision(otherCircle) {
        let dx = otherCircle.posX - this.posX;
        let dy = otherCircle.posY - this.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Si la distancia es menor que la suma de los radios, hay colisión
        if (distance < this.radius + otherCircle.radius) {
            this.color = "#0000FF"; // Cambiar a color azul si hay colisión
            otherCircle.color = "#0000FF"; // Cambiar el color del otro círculo también
            this.isColliding = true; // Marcar ambos círculos como colisionando
            otherCircle.isColliding = true;
            // Rebotar en dirección contraria
            this.dx = -this.dx;
            this.dy = -this.dy;
            otherCircle.dx = -otherCircle.dx;
            otherCircle.dy = -otherCircle.dy;
        } else {
            this.isColliding = false; // Marcar como no colisionando si no hay colisión
            otherCircle.isColliding = false;
        }
    }
} 

// Crear un array para almacenar N círculos 
let circles = [];

// Función para generar círculos aleatorios 
function generateCircles(n) { 
    for (let i = 0; i < n; i++) { 
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50 
        let x = Math.random() * (window_width - radius * 2) + radius; 
        let y = Math.random() * (window_height - radius * 2) + radius; 
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio 
        let speed = Math.random() * 5 + 1; // Velocidad entre 1 y 5 
        let text = `C${i + 1}`; // Etiqueta del círculo 
        circles.push(new Circle(x, y, radius, color, text, speed)); 
    }
}

// Función para animar los círculos 
function animate() { 
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas 

    circles.forEach(circle => { 
        circle.update(ctx); // Actualizar cada círculo
    });

    // Verificar colisiones entre todos los círculos 
    for (let i = 0; i < circles.length; i++) { 
        for (let j = i + 1; j < circles.length; j++) { 
            circles[i].checkCollision(circles[j]); // Detectar colisiones entre cada par de círculos
        }
    }

    requestAnimationFrame(animate); // Repetir la animación 
}

// Generar N círculos y comenzar la animación 
generateCircles(10); // Puedes cambiar el número de círculos aquí 
animate();


