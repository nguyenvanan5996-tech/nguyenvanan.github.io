const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = (Math.random() - 0.5) * 12 - 2;
    this.life = 100;
    this.color = this.getRandomColor();
    this.size = Math.random() * 6 + 2;
    this.gravity = 0.2;
    this.friction = 0.95;
  }

  getRandomColor() {
    const colors = [
      '#FF1744', '#F50057', '#D500F9', '#651FFF',
      '#2196F3', '#00B0FF', '#00E5FF', '#1DE9B6',
      '#00E676', '#76FF03', '#FFEA00', '#FFC400',
      '#FF9100', '#FF3D00', '#FF6E40', '#FFB74D'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1.5;
    this.size *= 0.97;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life / 100;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isAlive() {
    return this.life > 0 && this.size > 0.1;
  }
}

function createExplosion(x, y, count = 50) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.isAlive());

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  if (particles.length > 0) {
    animationId = requestAnimationFrame(animate);
  } else {
    animationId = null;
  }
}

document.getElementById('giftBtn').addEventListener('click', function() {
  const rect = this.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const randomX = Math.random() * canvas.width;
      const randomY = Math.random() * (canvas.height * 0.6);
      createExplosion(randomX, randomY, 40);
    }, i * 100);
  }

  if (!animationId) {
    animate();
  }
});

// Bắt sự kiện click của button id="sendBtn"
document.getElementById('sendBtn').addEventListener('click', function() {
  // Lấy giá trị từ input id="name" và textarea id="message"
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Nếu thiếu thì alert
  if (!name || !message) {
    alert('Vui lòng nhập đầy đủ tên và lời nhắn!');
    return;
  }
  
  // Nếu đủ thì gọi function sendToTelegram(name, message)
  sendToTelegram(name, message);
});

// Function sendToTelegram(name, message)
function sendToTelegram(name, message) {
  // Thông tin TOKEN và CHAT_ID
  const TOKEN = '8649220613:AAFiDXUcg6j6bsPzuLo-xQo54VMEXJQjupc';
  const CHAT_ID = '1174655332';
  
  // Format tin nhắn
  const text = 'Tin nhắn mới:\nTên: ' + name + '\nNội dung: ' + message;
  
  // URL API Telegram
  const url = 'https://api.telegram.org/bot' + TOKEN + '/sendMessage';
  
  // Gửi dữ liệu lên Telegram bằng fetch API
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      // Sau khi gửi thành công: alert "Gửi thành công"
      alert('Gửi thành công! Cảm ơn bạn đã để lại lời nhắn.');
      // reset input
      document.getElementById('name').value = '';
      document.getElementById('message').value = '';
    } else {
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  })
  .catch(error => {
    alert('Không thể kết nối. Vui lòng kiểm tra kết nối Internet!');
    console.error('Error:', error);
  });
}
