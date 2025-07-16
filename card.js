let swingAngle = 0; // radians
let swingVelocity = 0;
const swingDamping = 0.98;
const swingStrength = 0.002;
const maxSwingDeg = 25; // 🔥 control swing limit here
const swingSpring = 0.012;      // pull to center strength

const canvas = document.getElementById('stripCanvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('card');

const hanger = document.querySelector('.hanger');
// canvas.width = window.innerWidth;
canvas.width = hanger.offsetWidth;
// canvas.height = window.innerHeight;
canvas.height = hanger.offsetHeight;

const origin = { x: canvas.width / 2, y: 0 };
let pos = { x: origin.x + 100, y: 220 }; // starts slightly offset to swing
let vel = { x: 0, y: 0 };
let acc = { x: 0, y: 0 };

let isDragging = false;

// CONFIGURABLE PARAMETERS
let maxStretch; // maximum pixels the user can pull from the top

function setmaxStretch() {
  if (window.innerWidth <= 768) {
    maxStretch= 330; // or a value that looks better on mobile
  } else {
    maxStretch = 400; // desktop default
  }
}

window.addEventListener('resize', setmaxStretch);
setmaxStretch();

let restY; // how low the card naturally hangs

function setRestY() {
  if (window.innerWidth <= 768) {
    restY = 130; // or a value that looks better on mobile
  } else {
    restY = 230; // desktop default
  }
}

window.addEventListener('resize', setRestY);
setRestY(); // Call once on load    


const springK = 0.01;      // spring stiffness (elastic pull)
const damping = 0.96;      // motion slowdown over time
const stopThreshold = 0.02; // how slow it must be to stop

function drawStrip() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cardTopX = pos.x;
  const cardTopY = pos.y - card.offsetHeight / 2 - 7;

  const dx = cardTopX - origin.x;
  const dy = cardTopY - origin.y;

  const distFromTop = Math.min(Math.sqrt(dx * dx + dy * dy), maxStretch);
  const straightness = distFromTop / maxStretch; // 0 = twisted, 1 = straight
  const twistAmount = (1 - straightness) * 5;   // max 10px wave when near top

  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);

  if (twistAmount > 0.1) {
    // Wavy rope at start, straightens as pulled down
    const segments = 30;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const wave = Math.sin(t * Math.PI * 4) * twistAmount; // 4 waves
      const x = origin.x + dx * t + wave;
      const y = origin.y + dy * t;
      ctx.lineTo(x, y);
    }
  } else {
    // Fully straight (or close enough) - use a clean curve
    const curveDepth = Math.min(Math.abs(dx) * 0.5, 100);
    const controlX = origin.x + dx / 2;
    const controlY = origin.y + curveDepth + dy * 0.05;
    ctx.quadraticCurveTo(controlX, controlY, cardTopX, cardTopY);
  }

  // Color blend based on twistiness
  const colorStrength = 1 - straightness; // 1 = start (pink), 0 = fully stretched
  const base = 0;
  const light = 68;

  const red = Math.round(base + (light - base) * (1 - colorStrength));
  const green = Math.round(base + (light - base) * (1 - colorStrength));
  const blue = Math.round(base + (light - base) * (1 - colorStrength));
  ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;

  // Line width taper
  ctx.lineWidth = 6 * colorStrength + 0.5; // 6px thick at top, 2px at bottom


  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.stroke();
}

function updateCard() {
  if (!isDragging) {
    // Spring motion toward rest point
    const dx = pos.x - origin.x;
    const dy = pos.y - restY;

    const forceX = -springK * dx;
    const forceY = -springK * dy;

    acc.x = forceX;
    acc.y = forceY;

    vel.x += acc.x;
    vel.y += acc.y;

    vel.x *= damping;
    vel.y *= damping;
    // Bounce tweak:
    // If near restY and velocity Y almost zero, add small upward velocity for bounce
    if (Math.abs(dy) < 2 && Math.abs(vel.y) < 0.05 && !isDragging) {
      vel.y = -1.5; // tweak bounce strength here
    }

    pos.x += vel.x;
    pos.y += vel.y;

    // 🌟 Pendulum-like swing behavior
    const swingAccel = -swingSpring * Math.sin(swingAngle); // pull toward center
    swingVelocity += swingAccel;
    swingVelocity *= swingDamping; // damping
    swingAngle += swingVelocity;


  } else {
    // Lock angle during drag
    swingAngle = 0;
    swingVelocity = 0;
  }

  // 🌐 Apply rotation from top center
  card.style.transform = `translate(${pos.x - card.offsetWidth / 2}px, ${pos.y - card.offsetHeight / 2}px) rotate(${swingAngle}rad)`;


  // 🎯 Keep clip at correct angle (visual only)
  const dxClip = pos.x - origin.x;
  const dyClip = (pos.y - card.offsetHeight / 2 - 7) - origin.y;
  const angle = Math.atan2(dyClip, dxClip);
  const clip = document.querySelector('.clip-icon');
  if (clip) {
    clip.style.transform = `translateX(-50%) rotate(${angle * 15}deg)`;
  }

  drawStrip();
  requestAnimationFrame(updateCard);
}



// Mouse dragging
card.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.cursor = 'grabbing';

  function onMouseMove(e) {
    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxStretch) {
      // Normalize and clamp to maxStretch
      const angle = Math.atan2(dy, dx);
      pos.x = origin.x + maxStretch * Math.cos(angle);
      pos.y = origin.y + maxStretch * Math.sin(angle);
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }

    vel.x = 0;
    vel.y = 0;
  }

  function onMouseUp() {
    // Inject horizontal motion into angular swing
    const dx = pos.x - origin.x;
    swingVelocity = dx * 0.001; // Inject swing based on drag displacement

    isDragging = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
// Load sound
const snapSound = new Audio('https://freesound.org/data/previews/82/82694_634166-lq.mp3'); // example elastic snap sound

// Play on mouseup
card.addEventListener('mouseup', () => {
  if (!isDragging) return; // avoid multiple plays
  snapSound.currentTime = 0;
  snapSound.play();
});
// Touch dragging
card.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];

  function onTouchMove(e) {
    const touch = e.touches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxStretch) {
      const angle = Math.atan2(dy, dx);
      pos.x = origin.x + maxStretch * Math.cos(angle);
      pos.y = origin.y + maxStretch * Math.sin(angle);
    } else {
      pos.x = touch.clientX;
      pos.y = touch.clientY;
    }

    vel.x = 0;
    vel.y = 0;
  }

  function onTouchEnd() {
    const dx = pos.x - origin.x;
    swingVelocity = dx * 0.001;

    isDragging = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }

  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
});


// Initial draw + start animation
drawStrip();
updateCard();