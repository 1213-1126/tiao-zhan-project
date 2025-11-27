// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

// 初始化游戏画布
function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    canvas.width = 400;
    canvas.height = 400;
    
    // 初始化球体数据
    window.balls = [
        { x: 100, y: 100, color: '#c41e3a', radius: 15, type: 'red', isDragging: false },
        { x: 300, y: 300, color: '#3498db', radius: 15, type: 'blue', isDragging: false }
    ];
    
    // 绘制初始状态
    drawField();
}

// 绘制场地和球体
function drawField() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制场地边界
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 300, 300);
    
    // 绘制中心圆
    ctx.beginPath();
    ctx.arc(200, 200, 30, 0, Math.PI * 2);
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();
    
    // 绘制中线
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 350);
    ctx.stroke();
    
    // 绘制球体
    window.balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制球体标识
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ball.type === 'red' ? '红' : '蓝', ball.x, ball.y);
    });
}

// 设置事件监听器
function setupEventListeners() {
    const canvas = document.getElementById('gameCanvas');
    
    // 鼠标事件监听
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    // 触摸事件监听（移动端支持）
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
}

// 鼠标按下事件
function handleMouseDown(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    startDrag(x, y);
}

// 开始拖拽
function startDrag(x, y) {
    window.balls.forEach(ball => {
        const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        if (distance < ball.radius) {
            ball.isDragging = true;
        }
    });
}

// 鼠标移动事件
function handleMouseMove(e) {
    if (!window.balls.some(ball => ball.isDragging)) return;
    
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    dragBall(x, y);
}

// 拖拽球体
function dragBall(x, y) {
    // 确保在场地范围内
    x = Math.max(65, Math.min(335, x));
    y = Math.max(65, Math.min(335, y));
    
    window.balls.forEach(ball => {
        if (ball.isDragging) {
            ball.x = x;
            ball.y = y;
        }
    });
    
    drawField();
}

// 鼠标释放事件
function handleMouseUp() {
    window.balls.forEach(ball => {
        ball.isDragging = false;
    });
}

// 触摸事件处理
function handleTouchStart(e) {
    e.preventDefault();
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    startDrag(x, y);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!window.balls.some(ball => ball.isDragging)) return;
    
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    dragBall(x, y);
}

function handleTouchEnd(e) {
    e.preventDefault();
    window.balls.forEach(ball => {
        ball.isDragging = false;
    });
}

// 模拟碰撞
function simulateCollision() {
    const redBall = window.balls.find(ball => ball.type === 'red');
    const blueBall = window.balls.find(ball => ball.type === 'blue');
    
    const dx = blueBall.x - redBall.x;
    const dy = blueBall.y - redBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 简单碰撞模拟
    if (distance < 100) {
        // 计算碰撞后的位置
        const force = 50;
        const angle = Math.atan2(dy, dx);
        
        blueBall.x += Math.cos(angle) * force;
        blueBall.y += Math.sin(angle) * force;
        
        // 确保不超出边界
        blueBall.x = Math.max(65, Math.min(335, blueBall.x));
        blueBall.y = Math.max(65, Math.min(335, blueBall.y));
        
        drawField();
        
        // 显示碰撞结果
        showMessage('碰撞成功！蓝球被击退', 'success');
    } else {
        showMessage('距离过远，未发生碰撞', 'warning');
    }
}

// 重置球体位置
function resetBalls() {
    window.balls = [
        { x: 100, y: 100, color: '#c41e3a', radius: 15, type: 'red', isDragging: false },
        { x: 300, y: 300, color: '#3498db', radius: 15, type: 'blue', isDragging: false }
    ];
    drawField();
    showMessage('位置已重置', 'info');
}

// 显示/隐藏规则面板
function showRules() {
    const rulesPanel = document.getElementById('rulesPanel');
    rulesPanel.style.display = rulesPanel.style.display === 'none' ? 'block' : 'none';
}

// 显示消息
function showMessage(message, type) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // 根据类型设置背景色
    const colors = {
        success: '#27ae60',
        warning: '#f39c12',
        info: '#3498db',
        error: '#e74c3c'
    };
    
    messageEl.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(messageEl);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// 滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // 考虑导航栏高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(44, 62, 80, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});