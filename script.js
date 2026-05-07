const canvas = document.getElementById("diagram");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const C = {
  ink: "#070b2e",
  muted: "#42506f",
  pale: "#f8fbff",
  blue: "#1454d8",
  deepBlue: "#061f47",
  orange: "#ff6416",
  rope: "#c8a878",
  ropeDark: "#8b6a3d",
  ropeLight: "#ead7b5",
};

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function shadow(color = "rgba(10, 24, 60, .12)", blur = 24, x = 0, y = 12) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = x;
  ctx.shadowOffsetY = y;
}

function clearShadow() {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function text(str, x, y, size, color = C.ink, weight = 700, align = "left", lineHeight = size * 1.18) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  String(str).split("\n").forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  ctx.restore();
}

function logo(x, y, scale = 1) {
  text("tyro", x, y, 56 * scale, "#06459c", 900);
  text("desk", x + 116 * scale, y + 2 * scale, 51 * scale, "#284ea5", 300);
  ctx.save();
  ctx.fillStyle = C.orange;
  ctx.beginPath();
  ctx.arc(x + 47 * scale, y + 25 * scale, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  clearShadow();
  ctx.restore();
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.52, "#fbfdff");
  g.addColorStop(1, "#f5f8ff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(18, 84, 216, 0.035)";
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.arc(180 + i * 105, 80 + Math.sin(i) * 28, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ropePath(points, width = 31, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  shadow("rgba(91, 61, 25, .28)", 15, 0, 8);
  ctx.strokeStyle = C.ropeDark;
  ctx.lineWidth = width + 8;
  drawBezier(points);
  clearShadow();
  ctx.strokeStyle = C.rope;
  ctx.lineWidth = width;
  drawBezier(points);
  ctx.strokeStyle = C.ropeLight;
  ctx.lineWidth = 5;
  drawBezier(points);
  ctx.setLineDash([18, 17]);
  ctx.strokeStyle = "rgba(96, 69, 34, .34)";
  ctx.lineWidth = 3;
  drawBezier(points);
  ctx.restore();
}

function drawBezier(points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 3) {
    ctx.bezierCurveTo(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], points[i + 2][0], points[i + 2][1]);
  }
  ctx.stroke();
}

function tangledRope() {
  const centerX = 425;
  const centerY = 650;
  const loops = [
    [260, 645, 245, 520, 420, 500, 548, 565],
    [235, 720, 245, 560, 575, 520, 590, 690],
    [315, 520, 470, 455, 650, 590, 530, 765],
    [235, 780, 295, 630, 500, 590, 650, 735],
    [230, 600, 370, 490, 620, 515, 610, 625],
    [330, 795, 220, 680, 330, 520, 455, 760],
    [520, 505, 635, 590, 535, 815, 360, 790],
    [285, 705, 420, 545, 610, 650, 455, 825],
    [375, 500, 225, 605, 330, 820, 535, 735],
    [600, 570, 480, 480, 255, 640, 410, 825],
    [280, 555, 420, 460, 610, 610, 500, 650],
    [265, 755, 405, 820, 590, 735, 520, 570],
  ];
  loops.forEach((p, i) => ropePath([[p[0], p[1]], [p[2], p[3]], [p[4], p[5]], [p[6], p[7]]], 28 + (i % 2) * 4, 0.96));
  ctx.save();
  shadow("rgba(0,0,0,.16)", 25, 0, 16);
  const radial = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, 250);
  radial.addColorStop(0, "rgba(250, 236, 211, .14)");
  radial.addColorStop(1, "rgba(145, 107, 59, .1)");
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 25, 245, 165, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function connectorLines() {
  ctx.save();
  ctx.strokeStyle = "rgba(9, 18, 54, .28)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  const labels = [
    [155, 450, "Lost\nconversations", 292, 486],
    [150, 555, "Scattered\ntasks", 250, 575],
    [145, 700, "Missing\nfiles", 235, 700],
    [210, 842, "Duplicate\nwork", 235, 770],
    [560, 830, "Delayed\napprovals", 520, 775],
  ];
  labels.forEach(([x, y, label, tx, ty]) => {
    text(label, x, y, 18, C.ink, 800, "center", 22);
    ctx.beginPath();
    ctx.moveTo(x + 50, y + 10);
    ctx.quadraticCurveTo((x + tx) / 2, y - 22, tx, ty);
    ctx.stroke();
  });
  ctx.restore();
}

function iconBadge(x, y, type, size = 74) {
  ctx.save();
  shadow("rgba(11, 27, 70, .16)", 20, 0, 10);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
  clearShadow();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(15, 60, 130, .05)";
  ctx.stroke();
  ctx.translate(x, y);
  if (type === "slack") {
    const colors = ["#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a"];
    [[-8, -18], [12, -8], [5, 15], [-17, 7]].forEach((p, i) => {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(p[0] + (i % 2 ? 0 : 20), p[1] + (i % 2 ? 20 : 0));
      ctx.stroke();
    });
  } else if (type === "whatsapp") {
    ctx.fillStyle = "#25d366";
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    text("☎", -13, -16, 25, "#fff", 900);
  } else if (type === "trello") {
    ctx.fillStyle = "#2877d5";
    roundRect(-19, -20, 38, 40, 5);
    ctx.fill();
    ctx.fillStyle = "#e9f3ff";
    roundRect(-13, -14, 10, 25, 3);
    ctx.fill();
    roundRect(4, -14, 10, 18, 3);
    ctx.fill();
  } else if (type === "gmail") {
    ctx.strokeStyle = "#ea4335";
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-22, -12); ctx.lineTo(0, 6); ctx.lineTo(22, -12); ctx.lineTo(22, 16); ctx.lineTo(-22, 16); ctx.lineTo(-22, -12);
    ctx.stroke();
  } else if (type === "notion") {
    text("N", -13, -19, 36, "#111", 900);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    roundRect(-20, -22, 40, 44, 3);
    ctx.stroke();
  } else if (type === "sheets") {
    ctx.fillStyle = "#16a765";
    roundRect(-18, -22, 36, 44, 4);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    for (let i = -8; i <= 8; i += 8) { ctx.beginPath(); ctx.moveTo(i, -8); ctx.lineTo(i, 12); ctx.stroke(); }
    for (let i = -8; i <= 8; i += 10) { ctx.beginPath(); ctx.moveTo(-10, i); ctx.lineTo(10, i); ctx.stroke(); }
  } else if (type === "dropbox") {
    ctx.fillStyle = "#0061ff";
    [[-12,-10],[10,-10],[-12,10],[10,10]].forEach(([px,py]) => { ctx.save(); ctx.translate(px,py); ctx.rotate(Math.PI/4); ctx.fillRect(-9,-9,18,18); ctx.restore(); });
  } else if (type === "drive") {
    ctx.fillStyle = "#0f9d58";
    ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(24,17); ctx.lineTo(8,17); ctx.lineTo(-15,-24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f4b400"; ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(-24,17); ctx.lineTo(-8,17); ctx.lineTo(15,-24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#4285f4"; ctx.beginPath(); ctx.moveTo(-24,17); ctx.lineTo(24,17); ctx.lineTo(14,34); ctx.lineTo(-14,34); ctx.closePath(); ctx.fill();
  } else if (type === "mail") {
    ctx.fillStyle = "#2f77dc"; roundRect(-22,-16,44,32,5); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(-19,-10); ctx.lineTo(0,6); ctx.lineTo(19,-10); ctx.stroke();
  }
  ctx.restore();
}

function centralLogoNode() {
  ropePath([[590, 650], [690, 640], [740, 650], [802, 650]], 29);
  ropePath([[590, 705], [690, 705], [740, 692], [802, 685]], 29);
  ropePath([[802, 650], [890, 620], [930, 580], [994, 560]], 29);
  ropePath([[802, 685], [895, 690], [928, 690], [994, 690]], 29);
  ropePath([[802, 650], [892, 682], [934, 712], [994, 742]], 29);
  ctx.save();
  shadow("rgba(9, 18, 54, .22)", 22, 0, 12);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(802, 667, 55, 0, Math.PI * 2);
  ctx.fill();
  clearShadow();
  text("t", 768, 626, 72, "#073f90", 900);
  ctx.fillStyle = C.orange;
  ctx.beginPath();
  ctx.arc(829, 653, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  for (let i = 0; i < 5; i++) ropePath([[862 + i * 9, 639], [858 + i * 9, 659], [858 + i * 9, 676], [865 + i * 9, 693]], 6, 1);
}

function dashboard() {
  const x = 990, y = 170, w = 490, h = 780;
  ctx.save();
  shadow("rgba(10, 24, 60, .18)", 35, 0, 18);
  roundRect(x, y, w, h, 25);
  ctx.fillStyle = "#fff";
  ctx.fill();
  clearShadow();
  roundRect(x, y, 165, h, 25);
  const sg = ctx.createLinearGradient(x, y, x + 165, y + h);
  sg.addColorStop(0, "#09224d");
  sg.addColorStop(1, "#041936");
  ctx.fillStyle = sg;
  ctx.fill();
  ctx.save(); ctx.beginPath(); roundRect(x, y, 165, h, 25); ctx.clip(); ctx.fillStyle = "#041936"; ctx.fillRect(x + 145, y, 22, h); ctx.restore();
  text("tyrodesk", x + 20, y + 30, 34, "#fff", 900);
  const nav = ["⌂ Home", "▱ Chats", "▣ Projects", "☑ Tasks", "♙ Clients", "▤ Documents", "✓ Approvals", "✧ AI Assistant", "⚙ Settings"];
  nav.forEach((item, i) => {
    if (i === 0) { ctx.fillStyle = "#1454d8"; roundRect(x + 13, y + 95 + i * 52, 138, 46, 9); ctx.fill(); }
    text(item, x + 25, y + 107 + i * 52, 15, "#eef5ff", 800);
  });
  text("Good morning, Arjun 👋", x + 187, y + 42, 18, C.ink, 900);
  text("⋮", x + 452, y + 39, 32, C.ink, 800);
  card(x + 180, y + 95, 290, 215, "My Tasks", ["Client onboarding        In Progress", "Website redesign        Review", "Monthly report          Completed"]);
  card(x + 180, y + 370, 290, 222, "Recent Conversations", ["# Project Alpha                 2m", "Client - Acme Corp          15m", "Design Team                     1h"], true);
  card(x + 180, y + 650, 290, 110, "AI Assistant", ["What would you like to do?", "Ask anything about projects,"]);
  ctx.restore();
}

function card(x, y, w, h, title, rows, people = false) {
  ctx.save();
  shadow("rgba(10, 24, 60, .08)", 18, 0, 8);
  roundRect(x, y, w, h, 15);
  ctx.fillStyle = "#fff";
  ctx.fill();
  clearShadow();
  text(title, x + 20, y + 20, 15, C.ink, 900);
  rows.forEach((row, i) => {
    const yy = y + 58 + i * 48;
    if (people) {
      ctx.fillStyle = ["#22b8b0", "#ff8a4c", "#4383f4"][i];
      ctx.beginPath(); ctx.arc(x + 28, yy + 8, 12, 0, Math.PI * 2); ctx.fill();
    } else if (title === "My Tasks") {
      ctx.strokeStyle = "#c7d1e5"; ctx.lineWidth = 2; roundRect(x + 20, yy, 13, 13, 3); ctx.stroke();
    } else if (title === "AI Assistant") {
      ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(x + 28, yy + 8, 21, 0, Math.PI * 2); ctx.fill(); text("✧", x + 17, yy - 5, 25, "#fff", 900);
    }
    text(row, x + (people || title === "AI Assistant" ? 58 : 44), yy - 2, 12, C.ink, 800);
  });
  if (title === "Recent Conversations") text("View all", x + w - 62, y + 20, 12, C.blue, 800);
  ctx.restore();
}

function rightFeatureRopes() {
  const baseX = 1480;
  const anchors = [220, 360, 505, 650, 800, 935];
  ropePath([[baseX, 220], [1515, 220], [1523, 219], [1550, 218]], 18);
  ropePath([[1480, 360], [1515, 360], [1518, 360], [1550, 360]], 18);
  ropePath([[1480, 505], [1515, 505], [1518, 505], [1550, 505]], 18);
  ropePath([[1480, 650], [1515, 650], [1518, 650], [1550, 650]], 18);
  ropePath([[1480, 800], [1515, 800], [1518, 800], [1550, 800]], 18);
  ropePath([[1480, 935], [1515, 935], [1518, 935], [1550, 935]], 18);
  ropePath([[1518, 220], [1510, 280], [1510, 315], [1480, 360], [1510, 385], [1510, 470], [1480, 505], [1510, 535], [1510, 620], [1480, 650], [1510, 680], [1510, 770], [1480, 800], [1510, 830], [1510, 905], [1550, 935]], 18);
  anchors.forEach((yy) => {
    for (let i = 0; i < 3; i++) ropePath([[1510 + i * 7, yy - 17], [1508 + i * 7, yy], [1508 + i * 7, yy + 14], [1512 + i * 7, yy + 23]], 4, 1);
  });
}

function squareFeatureIcon(x, y, glyph) {
  ctx.save();
  shadow("rgba(12, 31, 76, .12)", 18, 0, 9);
  roundRect(x - 36, y - 36, 72, 72, 12);
  ctx.fillStyle = "#fff";
  ctx.fill();
  clearShadow();
  text(glyph, x, y - 23, 42, C.blue, 700, "center");
  ctx.restore();
}

function features() {
  rightFeatureRopes();
  const data = [
    [1608, 218, "☏", "Unified Communication", "All conversations in\none place."],
    [1608, 360, "▦", "Projects & Tasks", "Plan, assign and track\neverything."],
    [1608, 505, "♙", "Clients & CRM", "All client info, history &\ninteractions."],
    [1608, 650, "▤", "Documents", "Centralized files.\nAlways accessible."],
    [1608, 800, "☑", "Approvals", "Requests, approvals\nand sign-offs."],
    [1608, 935, "✧", "AI Assistant", "Contextual AI that\nknows your business."],
  ];
  data.forEach(([x, y, glyph, heading, body]) => {
    squareFeatureIcon(x, y, glyph);
    text(heading, x + 58, y - 28, 21, C.ink, 900);
    text(body, x + 58, y + 8, 18, "#233153", 500, "left", 27);
  });
}

function resultStrip() {
  const x = 60, y = 1010, w = 1800, h = 210;
  ctx.save();
  shadow("rgba(10, 24, 60, .1)", 24, 0, 10);
  roundRect(x, y, w, h, 20);
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.fill();
  clearShadow();
  text("THE RESULT", x + 65, y + 35, 22, C.blue, 900);
  const items = [
    ["◷", "Save hours\nevery day", "Find everything.\nWork faster."],
    ["◎", "Better decisions\nwith full context", "All information in\none place."],
    ["ϟ", "Faster execution\nacross teams", "No switching.\nNo delays."],
    ["☻", "Happier clients\n& stronger delivery", "Nothing falls through\nthe cracks."],
  ];
  items.forEach(([glyph, heading, body], i) => {
    const ix = x + 65 + i * 340;
    if (i > 0) { ctx.strokeStyle = "#dfe6f2"; ctx.beginPath(); ctx.moveTo(ix - 58, y + 70); ctx.lineTo(ix - 58, y + h - 45); ctx.stroke(); }
    text(glyph, ix, y + 78, 50, C.blue, 600);
    text(heading, ix + 78, y + 78, 20, C.ink, 900, "left", 28);
    text(body, ix + 78, y + 148, 18, "#233153", 500, "left", 27);
  });
  ctx.fillStyle = "#f8fbff";
  ctx.fillRect(x + 1390, y, w - 1390, h);
  logo(x + 1440, y + 40, 0.82);
  text("One workspace for projects, chat,\njobs, clients, and AI. Built to keep\nyour entire business in context.", x + 1440, y + 110, 18, "#233153", 500, "left", 31);
  ctx.restore();
}

function headings() {
  logo(60, 48, 1);
  text("68%", 60, 138, 85, C.orange, 900);
  text("of work", 305, 150, 72, C.ink, 900);
  text("disappears across apps.", 60, 230, 72, C.ink, 900);
  text("Disorganized tools. Lost context. Slower teams.", 65, 342, 28, "#4b5875", 700);
  text("Bring everything and everyone into one workspace.", 65, 383, 27, "#1554e8", 900);
}

function appBadges() {
  const badges = [
    [305, 535, "slack"], [430, 514, "whatsapp"], [555, 545, "trello"],
    [230, 655, "gmail"], [495, 662, "notion"], [268, 768, "sheets"],
    [392, 797, "dropbox"], [482, 785, "drive"], [393, 735, "mail"],
  ];
  badges.forEach((b) => iconBadge(...b));
}

function draw() {
  ctx.imageSmoothingEnabled = true;
  drawBackground();
  headings();
  connectorLines();
  tangledRope();
  appBadges();
  centralLogoNode();
  dashboard();
  features();
  resultStrip();
}

draw();
