const incidents = [
  {
    name: "Impossible travel from privileged account",
    severity: "critical",
    owner: "SOC Tier 2",
    status: "open",
    age: "18m",
  },
  {
    name: "Malware beaconing on finance endpoint",
    severity: "critical",
    owner: "Endpoint IR",
    status: "contained",
    age: "42m",
  },
  {
    name: "Suspicious PowerShell execution",
    severity: "high",
    owner: "Threat Hunt",
    status: "open",
    age: "1h 12m",
  },
  {
    name: "Excessive VPN failures",
    severity: "medium",
    owner: "Identity Ops",
    status: "open",
    age: "2h 05m",
  },
];

const alerts = [
  {
    title: "Brute-force pattern detected",
    detail: "109 failed attempts against admin portal from 3 source ASNs.",
    time: "1 min ago",
    icon: "key-round",
  },
  {
    title: "Outbound anomaly",
    detail: "Database subnet sent unusual traffic volume to external host.",
    time: "6 min ago",
    icon: "radio-tower",
  },
  {
    title: "Endpoint isolation completed",
    detail: "FIN-LAP-044 moved to containment after malicious hash match.",
    time: "13 min ago",
    icon: "monitor-x",
  },
  {
    title: "New high-risk vulnerability",
    detail: "Patch SLA breached on 14 public-facing Linux hosts.",
    time: "27 min ago",
    icon: "bug",
  },
];

const incidentRows = document.querySelector("#incidentRows");
const alertFeed = document.querySelector("#alertFeed");
const threshold = document.querySelector("#threshold");
const thresholdValue = document.querySelector("#thresholdValue");

incidentRows.innerHTML = incidents
  .map(
    (incident) => `
      <tr>
        <td><strong>${incident.name}</strong></td>
        <td><span class="severity ${incident.severity}">${incident.severity}</span></td>
        <td>${incident.owner}</td>
        <td><span class="status ${incident.status}">${incident.status}</span></td>
        <td>${incident.age}</td>
      </tr>
    `
  )
  .join("");

alertFeed.innerHTML = alerts
  .map(
    (alert) => `
      <li class="feed-item">
        <div class="feed-icon"><span data-lucide="${alert.icon}"></span></div>
        <div>
          <strong>${alert.title}</strong>
          <span>${alert.detail}</span>
          <small>${alert.time}</small>
        </div>
      </li>
    `
  )
  .join("");

threshold.addEventListener("input", () => {
  thresholdValue.value = threshold.value;
});

function drawThreatChart() {
  const canvas = document.querySelector("#threatChart");
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  context.scale(scale, scale);

  const width = rect.width;
  const height = rect.height;
  const padding = 36;
  const labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  const critical = [18, 24, 21, 38, 31, 46, 42];
  const suspicious = [42, 48, 56, 62, 68, 74, 81];
  const max = 90;

  context.clearRect(0, 0, width, height);
  context.lineWidth = 1;
  context.strokeStyle = "#dce4ee";
  context.fillStyle = "#64728a";
  context.font = "12px Inter, sans-serif";

  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    context.beginPath();
    context.moveTo(padding, y);
    context.lineTo(width - padding, y);
    context.stroke();
    context.fillText(String(max - (max / 4) * i), 6, y + 4);
  }

  labels.forEach((label, index) => {
    const x = padding + ((width - padding * 2) / (labels.length - 1)) * index;
    context.fillText(label, x - 15, height - 10);
  });

  function plot(values, color, fill) {
    const points = values.map((value, index) => ({
      x: padding + ((width - padding * 2) / (values.length - 1)) * index,
      y: height - padding - (value / max) * (height - padding * 2),
    }));

    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.stroke();

    if (fill) {
      context.lineTo(points[points.length - 1].x, height - padding);
      context.lineTo(points[0].x, height - padding);
      context.closePath();
      context.fillStyle = fill;
      context.fill();
    }

    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 4, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.fill();
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
    });
  }

  plot(suspicious, "#078b8f", "rgba(7, 139, 143, 0.12)");
  plot(critical, "#d92d20", "rgba(217, 45, 32, 0.1)");

  const legend = [
    ["Critical", "#d92d20"],
    ["Suspicious", "#078b8f"],
  ];

  legend.forEach(([label, color], index) => {
    const x = width - 180 + index * 90;
    context.fillStyle = color;
    context.fillRect(x, 14, 12, 12);
    context.fillStyle = "#162033";
    context.fillText(label, x + 18, 24);
  });
}

window.addEventListener("resize", drawThreatChart);
drawThreatChart();

if (window.lucide) {
  window.lucide.createIcons();
}
