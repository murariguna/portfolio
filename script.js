const bootScreen   = document.getElementById("boot-screen");
const terminalWrap = document.getElementById("terminal-wrapper");
const asciiBanner  = document.getElementById("ascii-banner");
const outputEl     = document.getElementById("output");
const inputEl      = document.getElementById("terminal-input");
const promptEl     = document.getElementById("prompt");
const cursorEl     = document.getElementById("cursor");
const USER = {
  name: "Murari Guna",
  title: "Cybersecurity Student & Developer",
  location: "India",
  email: "murariguna3939@gmail.com",       
  github: "https://github.com/murariguna",
  linkedin: "https://www.linkedin.com/in/gunasatyamurari/", 
  resumeUrl: "assets/GSM_RESUME.pdf",                      
  prompt: "murari@portfolio:~$"
};

promptEl.textContent = USER.prompt;

const PROJECTS = [
  
   {
    id: "ssh-honeypot",
    name: "SSH Honeypot",
    role: "Security Developer",
    stack: "Python, Paramiko, Cryptography, Sockets",
    description:
      "Developed a lightweight SSH honeypot that simulates a Linux shell to analyze attacker behavior. Captures brute-force attempts, logs commands, and generates structured reports useful for SOC analysis.",
    link: "https://github.com/murariguna/honeypot.git"
  },

  {
    id: "med-hub",
    name: "MedHub — Hospital Communication App",
    role: "Android Developer",
    stack: "Android Studio, Java, Flask",
    description:
      "Built a mobile app improving communication between patients and medical staff. Includes secure authentication, Flask API backend, and reduced response delays through real-time updates.",
    link: "https://github.com/murariguna/hackthon.git"
  },

  {
    id: "steganography-tool",
    name: "Steganography Tool",
    role: "Python Developer",
    stack: "Python, PIL (Pillow)",
    description:
      "Created an image-based steganography system that hides and extracts secret messages using LSB encoding techniques. Processes images using Python's PIL library.",
    link: "https://github.com/murariguna/IBMSKILLBUILD_steganography.git"
  },

  {
    id: "web-vulnerability-scanner",
    name: "Web Vulnerability Scanner",
    role: "Security Developer",
    stack: "Python, Requests, HTML Parsing",
    description:
      "Developed a Python scanner for detecting SQLi, XSS, missing security headers, insecure server configs, and crawling targets. Generates a structured HTML report of findings.",
    link: "https://github.com/murariguna/cybersecurity_basics.git"
  },

  {
    id: "encryption-suite",
    name: "AES & RSA Encryption Suite",
    role: "Security Developer",
    stack: "Python, Cryptography",
    description:
      "Developed an encryption toolkit implementing AES symmetric encryption and RSA public-key cryptography. Supports key generation, message encryption, and secure workflows.",
    link: "https://github.com/murariguna/cybersecurity_basics.git"
  },

  {
    id: "phishing-detector",
    name: "Phishing Email Detector",
    role: "Security Researcher",
    stack: "Python, Regex, NLP Basics",
    description:
      "Created a phishing detection script that analyzes email patterns, malicious links, and suspicious keywords using rule-based heuristics and lightweight NLP.",
    link: "https://github.com/murariguna/cybersecurity_basics.git"
  },

  {
    id: "firewall-monitor",
    name: "Firewall Monitor & Rule Deletion Tool",
    role: "Security Automation",
    stack: "Python, System Utilities",
    description:
      "Monitors firewall rules, detects unwanted entries, and performs automated cleanup actions. Useful for hardening systems and improving firewall hygiene.",
    link: "https://github.com/murariguna/cybersecurity_basics.git"
  },

  {
    id: "keylogger-detection",
    name: "Keylogger Detection Script",
    role: "Security Automation",
    stack: "Python, OS Internals",
    description:
      "Detects potential keylogger processes by scanning active system processes and checking suspicious signatures. Alerts users on detection.",
    link: "https://github.com/murariguna/cybersecurity_basics.git"
  },

  {
    id: "password-strength-checker",
    name: "Password Strength Checker",
    role: "Python Developer",
    stack: "Python, Regex",
    description:
      "Analyzes password entropy, common patterns, dictionary matches, and length to classify password strength. Helps users avoid weak or guessable passwords.",
    link: "https://github.com/murariguna/cybersecurity_basics.git"
  }
];

const ASCII = [
    "   ____    ____   ___  ___ ",
    "  / ___|  / ___|  |  \\/  |",
    " | |  _   \\___ \\  | |\\/| |",
    " | |_| |   ___) | | |  | |",
    "  \\____|  |____/  |_|  |_|",
"",
"  Loading runtime environment modules....................... OK",
"  Verifying system integrity and security parameters........ OK",
"  Initiating secure interactive interface................... READY",
`  Welcome to ${USER.name}'s terminal -- Type 'help' to display the full list of supported commands.`


].join("\n");


let history = [];
let historyIndex = -1;

let isBusy = false;

function focusInput() {
  inputEl.focus();
}

function printLine(text = "", cssClass = "") {
  const line = document.createElement("div");
  line.classList.add("output-line");
  if (cssClass) line.classList.add(cssClass);
  line.textContent = text;
  outputEl.appendChild(line);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printHTML(html, cssClass = "") {
  const line = document.createElement("div");
  line.classList.add("output-line");
  if (cssClass) line.classList.add(cssClass);
  line.innerHTML = html;
  outputEl.appendChild(line);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printCard(title, bodyLines, footer = "") {
  const card = document.createElement("div");
  card.classList.add("terminal-card");

  const heading = document.createElement("div");
  heading.style.fontWeight = "600";
  heading.style.marginBottom = "4px";
  heading.textContent = title;

  const body = document.createElement("div");
  body.textContent = bodyLines.join("\n");

  card.appendChild(heading);
  card.appendChild(body);

  if (footer) {
    const small = document.createElement("small");
    small.innerHTML = footer;
    card.appendChild(small);
  }

  outputEl.appendChild(card);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function echoCommand(cmd) {
  printHTML(`<span class="prompt">${USER.prompt}</span> ${escapeHTML(cmd)}`);
}

function escapeHTML(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const COMMAND_NAMES = [
  "help",
  "about",
  "skills",
  "projects",
  "project",
  "education",
  "experience",
  "contact",
  "clear",
  "banner",
  "theme",
  "scan",
  "sudo",
  "resume"
];

function autocomplete(currentValue) {
  const trimmed = currentValue.trim();
  if (!trimmed) return;

  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) return; 

  const matches = COMMAND_NAMES.filter(cmd => cmd.startsWith(trimmed));

  if (matches.length === 1) {
    inputEl.value = matches[0] + " ";
  }
}

async function handleCommand(rawInput) {
  const input = rawInput.trim();
  if (!input) return;

  history.push(input);
  historyIndex = history.length;

  echoCommand(input);

  const [command, ...args] = input.split(/\s+/);
  const argStr = args.join(" ");

  const cmd = command.toLowerCase();

  if (COMMANDS[cmd]) {
    await COMMANDS[cmd](args, argStr);
  } else {
    printLine(`Command not found: ${cmd}. Type 'help' to see available commands.`, "error");
  }
}

const COMMANDS = {
  help: async () => {
  printLine("Available commands:", "notice");

  const commands = [
    ["help", "Show this help menu"],
    ["about", "Who am I?"],
    ["skills", "What can I do?"],
    ["projects", "Show all projects"],
    ["project", "Details of a specific project"],
    ["education", "Academic background"],
    ["experience", "Internships / training"],
    ["contact", "How to reach me"],
    ["resume", "Open resume link"],
    ["banner", "Show ASCII banner again"],
    ["theme", "Switch theme (default, matrix)"],
    ["scan", "Fake security scan (for fun)"],
    ["sudo", "Try elevated access 😉"],
    ["clear", "Clear terminal output"]
  ];

  commands.forEach(([cmd, desc]) => {
    const left = cmd.padEnd(16, " ");   // ← PERFECT alignment
    printLine(`  ${left} - ${desc}`, "success");
  });
},

about: async () => {
  printCard(
    "About Me",
    [
      `${USER.name}`,
      `${USER.title}`,
      "",
      "I'm a cybersecurity student with a strong interest in ethical hacking, digital forensics, and Python-based security tools.",
      "I enjoy building things that behave like real-world systems — interactive terminals, scanners, honeypots, and automation scripts.",
      "My learning approach is hands-on: break it, fix it, automate it, secure it.",
      "",
      "Current focus areas:",
      "• Offensive security basics (CTFs, web vulns, scanning tools)",
      "• SOC workflows, log analysis, honeypots",
      "• Python automation for security tasks",
      "• Understanding how systems behave under attack"
    ],
    "Type 'skills' for my technical abilities or 'projects' to explore what I've built."
  );
},

skills: async () => {
  printCard(
    "Skills",
    [
      "Programming Languages:",
      "• Python  |  C  |  Java  |  Bash",

      "",
      "Cybersecurity:",
      "• Network Security  |  IAM  |  Cryptography",
      "• Linux Security (Basics)  |  Threat & Log Analysis",
      "• Incident Response (Basics)",
      "• Vulnerability Assessment (Beginner)  |  Secure Coding",

      "",
      "Web & Development:",
      "• HTML  |  CSS  |  JavaScript",
      "• Flask (Basics)  |  Flutter (Basics)  |  Dart",

      "",
      "Tools & Platforms:",
      "• Git  |  UNIX / Linux  |  Kali Linux",
      "• Nmap  |  Wireshark  |  OpenSSL",
      "• VirtualBox  |  VMware",

      "",
      "Soft Skills:",
      "• Problem-Solving  |  Critical Thinking",
      "• Communication  |  Leadership",
      "• Time Management  |  Teamwork  |  Adaptability"
    ],
    "Type 'projects' to see what I’ve built using these skills."
  );
},


projects: async () => {
  printLine("Projects:", "notice");

  PROJECTS.forEach(p => {
    printCard(
      `${p.name}  [id: ${p.id}]`,
      [
        `Role: ${p.role}`,
        `Stack: ${p.stack}`,
        "Description:",
        
        ...String(p.description || "").split("\n")
      ],
      p.link && p.link !== "#"
        ?`Project link:<br><a href="${p.link}" target="_blank" style="color:var(--accent-2); text-decoration:none;">🔗 ${p.link}</a>`
        : "Use: project " + p.id + " for more details."
    );
  });
},

project: async (args, argStr) => {
  const target = String(argStr || "").trim().toLowerCase();

  if (!target) {
    printLine("Usage: project <id>", "notice");
    printLine("Tip: type 'projects' to see all projects and their IDs.", "notice");
    return;
  }

  const proj = PROJECTS.find(p => String(p.id || "").toLowerCase() === target);

  if (!proj) {
    printLine(`No project found with id: ${target}`, "error");
    return;
  }

  printCard(
    `${proj.name}`,
    [
      `ID: ${proj.id}`,
      `Role: ${proj.role}`,
      `Tech Stack: ${proj.stack}`,
      "Description:",
      ...String(proj.description || "").split("\n")
    ],
    proj.link && proj.link !== "#"
      ? `Project link:<br><a href="${proj.link}" target="_blank" style="color:var(--accent-2); text-decoration:none;">🔗 ${proj.link}</a>`
      : "Link will be added soon."
  );
},



education: async () => {
  printCard(
    "Education",
    [
      "B.Tech in Computer Science & Engineering",
      "Specialization: Cybersecurity, IoT & Blockchain",
      "SRKR Engineering College (CIC Branch)",
      "Duration: 2023 – 2027 (Expected)",
      "",
      "Core focus areas:",
      "• Cybersecurity fundamentals & Network Security",
      "• Operating Systems, Linux, and Networking concepts",
      "• Cryptography, Digital Forensics & Secure Coding",
      "• IoT Security & Blockchain basics",
      "• Hands-on practice through labs, tools, and CTF platforms",
      ""
    ],
    "Actively strengthening cybersecurity skills through real-world projects, tools, labs, and continuous learning."
  );
},


experience: async () => {
  printCard(
    "Experience / Internships",
    [
      "IBM — Introduction to Cybersecurity Intern (Virtual)",
      "Jan 2025 – Feb 2025",
      "• Completed hands-on secure configuration labs on IBM SkillBuild.",
      "• Improved understanding of access control & reduced misconfiguration risks in simulated environments by ~30%.",
      "• Practiced basic threat analysis, Linux security, and system hardening through guided labs.",
      "",
      "1M1B Foundation — Green Internship (Virtual)",
      "May 2025 – Jul 2025",
      "• Built a data-driven 'Carbon Footprint Calculator' to help users reduce energy consumption by up to 20%.",
      "• Delivered project presentations to 100+ participants, promoting sustainability and eco-friendly practices.",
      "",
      "Self-driven Cybersecurity Practice:",
      "• Active on TryHackMe — completing beginner & intermediate labs.",
      "• Linux security, networking fundamentals, and command-line workflows.",
      "• Building personal security tools (honeypots, scanners, log analyzers).",
      "",
    ],
    "Constantly improving through labs, internships, and building real cybersecurity projects."
  );
},

  contact: async () => {
    printHTML(
      [
        "You can reach me at:",
        "",
        `• Email: <a href="mailto:${USER.email}" target="_blank">${USER.email}</a>`,
        `• GitHub: <a href="${USER.github}" target="_blank">${USER.github}</a>`,
        `• LinkedIn: <a href="${USER.linkedin}" target="_blank">${USER.linkedin}</a>`
      ].join("<br>"),
      "success"
    );
  },

  clear: async () => {
    outputEl.innerHTML = "";
  },

banner: async () => {
  const asciiBanner = [
    "   ____    ____   ___  ___ ",
    "  / ___|  / ___|  |  \\/  |",
    " | |  _   \\___ \\  | |\\/| |",
    " | |_| |   ___) | | |  | |",
    "  \\____|  |____/  |_|  |_|",
    ""
  ].join("\n");

  printLine(""); 
  printHTML(`<pre>${asciiBanner}</pre>`, "success");
},

  theme: async (args, argStr) => {
    const theme = argStr.trim().toLowerCase();
    if (!theme) {
      printLine(
        "Usage: theme <name>. Available: default, matrix",
        "notice"
      );
      return;
    }

    if (theme === "default") {
      document.documentElement.removeAttribute("data-theme");
      printLine("Theme set to: default", "success");
    } else if (theme === "matrix") {
      document.documentElement.setAttribute("data-theme", "matrix");
      printLine("Theme set to: matrix", "success");
    } else {
      printLine(
        `Unknown theme: ${theme}. Try: default, matrix`,
        "error"
      );
    }
  },

  scan: async () => {
    if (isBusy) {
      printLine("Scan already running. Please wait.", "notice");
      return;
    }
    isBusy = true;

    printLine("Initializing security scan...", "notice");
    await wait(400);
    printLine("Target: localhost (127.0.0.1)", "notice");
    await wait(400);
    printLine("Scanning open ports [1-65535]...", "notice");
    await wait(600);
    printLine(" - Port 22   open   (ssh)           (secured)", "success");
    await wait(300);
    printLine(" - Port 80   open   (http)          (dev server)", "success");
    await wait(300);
    printLine(" - Port 443  open   (https)         (production)", "success");
    await wait(500);
    printLine("No critical vulnerabilities found.", "success");
    printLine("Reminder: Real security starts with curiosity and practice. 🛡️", "notice");

    isBusy = false;
  },
  sudo: async (_args, argStr) => {
    const reason = argStr || "portfolio";
    printLine(`sudo: permission denied for '${reason}'`, "error");
    printLine("Nice try. Root access is only for the real system, not this portfolio 😄", "notice");
  },

resume: async () => {
  if (!USER.resumeUrl || USER.resumeUrl === "#") {
    printLine("Resume link not configured yet. Coming soon.", "notice");
    return;
  }

  printHTML(
    `Opening resume: <a href="${USER.resumeUrl}" target="_blank" rel="noopener noreferrer">Having trouble? Click here to open the resume manually</a>`,
    "success"
  );

  window.open(USER.resumeUrl, "_blank", "noopener");
}
};


async function bootSequence() {
  await wait(1600);
  bootScreen.remove();   
  terminalWrap.classList.remove("hidden");
  asciiBanner.textContent = ASCII;
  printLine("System ready. Type 'help' to begin.", "notice");
  printLine("");
  await COMMANDS.help();

  focusInput();
}
document.addEventListener("DOMContentLoaded", () => {
  bootSequence();

  terminalWrap.addEventListener("click", focusInput);

  inputEl.addEventListener("keydown", async (event) => {
    const key = event.key;

    if (key === "Enter") {
      const value = inputEl.value;
      inputEl.value = "";
      await handleCommand(value);
      focusInput();
    } else if (key === "ArrowUp") {
      if (history.length && historyIndex > 0) {
        historyIndex--;
        inputEl.value = history[historyIndex];
        setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
      }
      event.preventDefault();
    } else if (key === "ArrowDown") {
      if (history.length && historyIndex < history.length - 1) {
        historyIndex++;
        inputEl.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        inputEl.value = "";
      }
      setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
      event.preventDefault();
    } else if (key === "Tab") {
      event.preventDefault();
      autocomplete(inputEl.value);
    }
  });
});

