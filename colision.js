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
    this.originalColor = color;  // Guardar el color original
    this.text = text;
    this.speed = speed;
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
    this.colorChanged = false; // Para saber si el color ha cambiado
    this.changeColorTimer = 0; // Controlar el tiempo del cambio de color
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

    // Restaurar el color después de un corto periodo
    if (this.colorChanged) {
      this.changeColorTimer--;
      if (this.changeColorTimer <= 0) {
        this.restoreColor();
      }
    }
  }

  // Método para cambiar temporalmente el color en colisión
  changeColor(newColor) {
    this.color = newColor;
    this.colorChanged = true;  // Marcar que se ha cambiado el color
    this.changeColorTimer = 10; // El color permanecerá durante 10 cuadros de animación
  }

  // Método para restaurar el color original
  restoreColor() {
    this.color = this.originalColor;
    this.colorChanged = false;
  }

  // Método para invertir la dirección de movimiento en caso de colisión
  invertDirection() {
    this.dx = -this.dx;
    this.dy = -this.dy;
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
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para detectar colisiones entre dos círculos
function detectCollision(circle1, circle2) {
  let dx = circle2.posX - circle1.posX;
  let dy = circle2.posY - circle1.posY;
  let distance = Math.sqrt(dx * dx + dy * dy); // Cálculo correcto de la distancia
  return distance < (circle1.radius + circle2.radius); // Verifica si la distancia es menor que la suma de los radios
}

// Función para manejar el rebote tras la colisión
function handleCollision(circle1, circle2) {
  // Invertir direcciones
  circle1.invertDirection();
  circle2.invertDirection();

  // Cambiar colores temporalmente
  circle1.changeColor("#0000FF"); // Cambiar a azul
  circle2.changeColor("#0000FF");
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  
  // Verificar colisiones entre todos los círculos
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (detectCollision(circles[i], circles[j])) {
        handleCollision(circles[i], circles[j]);
      }
    }
  }

  // Actualizar la posición de cada círculo
  circles.forEach(circle => {
    circle.update(ctx);
  });

  requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();