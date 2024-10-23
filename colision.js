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
    this.dx = Math.random() * 2 - 1;  // Movimiento lateral aleatorio
    this.dy = -1 * this.speed;  // Movimiento hacia arriba inicialmente
    this.colorChanged = false;
    this.changeColorTimer = 0;
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

  changeColor(newColor) {
    this.color = newColor;
    this.colorChanged = true;
    this.changeColorTimer = 10;
  }

  restoreColor() {
    this.color = this.originalColor;
    this.colorChanged = false;
  }

  invertDirection() {
    this.dx = -this.dx;
    this.dy = -this.dy;
  }

  isClicked(mouseX, mouseY) {
    const distance = Math.sqrt((this.posX - mouseX) ** 2 + (this.posY - mouseY) ** 2);
    return distance <= this.radius;
  }
}

let circles = [];

function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = window_height - radius;  // Comienza justo antes del borde inferior
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

function detectCollision(circle1, circle2) {
  let dx = circle2.posX - circle1.posX;
  let dy = circle2.posY - circle1.posY;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (circle1.radius + circle2.radius);
}

function handleCollision(circle1, circle2) {
  circle1.invertDirection();
  circle2.invertDirection();

  circle1.changeColor("#0000FF");
  circle2.changeColor("#0000FF");
}

// Evento para eliminar un círculo con clic
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Buscar y eliminar el círculo que fue clicado
  circles = circles.filter(circle => !circle.isClicked(mouseX, mouseY));
});

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);

  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (detectCollision(circles[i], circles[j])) {
        handleCollision(circles[i], circles[j]);
      }
    }
  }

  circles.forEach(circle => {
    circle.update(ctx);
  });

  requestAnimationFrame(animate);
}

generateCircles(10);
animate();
