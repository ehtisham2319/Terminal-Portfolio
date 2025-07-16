const terminal = document.getElementById("terminal");
const history = [];
let historyIndex = -1;
const typeSound = document.getElementById("typeSound");


window.addEventListener('DOMContentLoaded', async () => {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const alertShown = sessionStorage.getItem('mobileAlertShown');

  if (isMobile && !alertShown) {
    alert("📱 For the best experience, please view this portfolio on a laptop or desktop 💻.");
    sessionStorage.setItem('mobileAlertShown', 'true');
  }

  const inputField = terminal.querySelector(".terminal-input");

  if (inputField) {
    inputField.value = "welcome";       // Set the input as if user typed it
    inputField.disabled = true;       // Disable typing while handling
    await handleCommand("welcome");     // Run the command
    createInputLine();                // Prepare next input line
  }
});

const commands = {
  welcome: "👋 Hi, I'm Ehtsham Arshad — a Full-Stack Web Developer & 🤖 AI Enthusiast.\n\nWelcome to my interactive terminal-style portfolio 🚀 — enjoy exploring! 😎\nType 'help' to see all commands",
  about: "👋 Hi, I'm Ehtsham Arshad — a Full-Stack Web Developer specializing in the MERN stack (MongoDB, Express, React, Node.js). I build production-ready applications with modern UI, scalable backend logic, and seamless API integrations.\n\nWith a passion for clean code and performance, I create powerful tools and interactive experiences that solve real-world problems. 🚀 From dynamic dashboards to full-featured platforms, I turn ideas into fast, functional code. Let’s build something epic. 💥",
  experience: "💼 Experience - \n\n💻 3+ Years of Hands-on Web Development Experience\n🧪 Built 8+ full-featured React applications with real-world functionality\n🚀 Deployed production-ready apps using Vercel, GitHub Pages, and Netlify\n🎯 Specialized in responsive UI design, API integration, and MERN stack logic\n🛠️ Completed 3 industry-level certifications (Google & Meta - AI, React, Git)\n🌐 Delivered polished landing pages and tools for real users\n👨‍💻 Active GitHub portfolio with live demos and source code",
  education: "🎓 Education -\n\n1.\n📘 BS Information Technology\n🏫 Govt Graduate College, Jhelum\n📅 2022 – Present\n\n2.\n📘 FSC Pre-Engineering\n🏫 Govt Graduate College, Jhelum\n📅 2020 – 2022",
  help: "Available commands:\n- welcome\n- about\n- skills\n- projects\n- certificates\n- experience\n- education\n- clear\n- help",
  skills: "🚀 Top Skills - \n\n💻 Languages: JavaScript (ES6+), HTML5, CSS3\n⚛️ Frameworks: React, Node.js, Express\n🎨 Styling: Tailwind CSS, Bootstrap\n🗃️ Database: MongoDB\n🛠️ Tools: Git, GitHub, VS Code, Postman, Thunderclient\n🤖 AI: OpenAI API, Prompt Engineering",
  projects: [
    {
      text: "🧠 1. Typing Master - ",
      link: { label: "Try Now", href: "https://ehtisham2319.github.io/typing-master/" },
      description: "React app for typing practice with real-time WPM, accuracy, and mistake tracking."
    },
    {
      text: "🧩 2. Card Puzzle Game - ",
      link: { label: "Play Now", href: "https://ehtisham2319.github.io/cardpuzzle/" },
      description: "A memory puzzle game built with React, featuring interactive card flips and logic handling."
    },
    {
      text: "✍️ 3. TextUtils App - ",
      link: { label: "Use Tool", href: "https://ehtisham2319.github.io/app1/" },
      description: "React text utility tool for case conversion, space trimming, copy, and word/char counting."
    },
    {
      text: "📓 4. Notebook App - ",
      link: { label: "View Code", href: "https://github.com/ehtisham2319/mynotebook" },
      description: "A secure notes management app built with React. Each user has their own private dashboard, enabling them to add, edit, delete, and search notes. Includes authentication and local storage for a personalized experience."
    },
    {
      text: "📰 5. News App - ",
      link: { label: "View Code", href: "https://github.com/ehtisham2319/chamyan-news" },
      description: "News app powered by React and News API with categories, pagination, and responsive layout."
    },
    {
      text: "💼 6. Portfolio Website - ",
      link: { label: "Visit Portfolio", href: "https://ehtisham2319.github.io/portfolio/" },
      description: "A personal portfolio website showcasing my skills and projects. Built with HTML, CSS, and JavaScript."
    }
  ],
  certificates: [
    {
      text: "🧠 1. Google - AI Essentials",
      link: {
        label: "View Certificate",
        href: "https://www.coursera.org/account/accomplishments/verify/QPPVW5UGZUQJ"
      },
      description: "Fundamentals of Artificial Intelligence including ethical use, capabilities, and applications across industries."
    },
    {
      text: "💻 2. Google - Build Dynamic User Interfaces",
      link: {
        label: "View Certificate",
        href: "https://www.coursera.org/account/accomplishments/verify/6MLXVF56LKHC"
      },
      description: "Learned how to build fast, responsive UIs using React components, hooks, and state management."
    },
    {
      text: "🔧 3. Google - Introduction to Git and GitHub",
      link: {
        label: "View Certificate",
        href: "https://www.coursera.org/account/accomplishments/verify/T7D8EBI4BXZB"
      },
      description: "Mastered version control fundamentals, collaboration workflows, and repository management using Git and GitHub."
    }
  ]


};

function playSound() {
  if (typeSound) {
    typeSound.currentTime = 0;
    typeSound.play().catch(() => { });
  }
}

function printLine(content, isElement = false) {
  const line = document.createElement("div");
  line.className = "terminal-line";
  if (isElement) {
    line.appendChild(content);
  } else {
    line.textContent = content;
  }
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function printTyping(content) {
  return new Promise((resolve) => {
    let i = 0;
    const line = document.createElement("div");
    line.className = "terminal-line";
    const span = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    line.appendChild(span);
    line.appendChild(cursor);
    terminal.appendChild(line);

    function typeChar() {
      if (i < content.length) {
        span.textContent += content.charAt(i++);
        playSound();
        terminal.scrollTop = terminal.scrollHeight;
        setTimeout(typeChar, 3);
      } else {
        cursor.remove();
        resolve();
      }
    }

    typeChar();
  });
}

function printProjectTyping(projects, index = 0) {
  return new Promise((resolve) => {
    function typeNext(i) {
      if (i >= projects.length) {
        resolve();
        return;
      }

      const item = projects[i];

      // 1. Print title (item.text)
      const titleLine = document.createElement("div");
      titleLine.className = "terminal-line";
      terminal.appendChild(titleLine);

      let titleTyped = "";
      let titleIndex = 0;

      function typeTitleChar() {
        if (titleIndex < item.text.length) {
          titleTyped += item.text.charAt(titleIndex++);
          titleLine.textContent = titleTyped;
          playSound();
          terminal.scrollTop = terminal.scrollHeight;
          setTimeout(typeTitleChar, 10);
        } else {
          // 2. Print link
          const linkLine = document.createElement("div");
          linkLine.className = "terminal-line";
          const a = document.createElement("a");
          a.href = item.link.href;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = item.link.label;
          linkLine.appendChild(a);
          terminal.appendChild(linkLine);
          terminal.scrollTop = terminal.scrollHeight;

          // 3. Print description with typing effect
          const descLine = document.createElement("div");
          descLine.className = "terminal-line";
          terminal.appendChild(descLine);

          let descTyped = "";
          let descIndex = 0;

          function typeDescChar() {
            if (descIndex < item.description.length) {
              descTyped += item.description.charAt(descIndex++);
              descLine.textContent = descTyped;
              playSound();
              terminal.scrollTop = terminal.scrollHeight;
              setTimeout(typeDescChar, 10);
            } else {
              setTimeout(() => typeNext(i + 1), 400);
            }
          }

          typeDescChar();
        }
      }

      typeTitleChar();
    }

    typeNext(index);
  });
}


async function handleCommand(cmd) {

  if (!history.includes(cmd)) {
    history.push(cmd);
  }
  historyIndex = -1;

  if (cmd.toLowerCase() === "clear") {
    terminal.innerHTML = "";
    return;
  }

  const response = commands[cmd.toLowerCase()];
  if (!response) {
    await printTyping(`Command not found: ${cmd}`);
    return;
  }

  if (Array.isArray(response)) {
    await printProjectTyping(response);
  } else {
    await printTyping(response);
  }
}

function createInputLine() {
  const inputLine = document.createElement("div");
  inputLine.className = "terminal-input-line";

  const prompt = document.createElement("span");
  prompt.textContent = "ehtsham@portfolio:~$";

  const inputField = document.createElement("input");
  inputField.className = "terminal-input";
  if (window.innerWidth > 768) {
  inputField.focus(); // Only autofocus on desktop
}

  inputLine.appendChild(prompt);
  inputLine.appendChild(inputField);
  terminal.appendChild(inputLine);
  terminal.scrollTop = terminal.scrollHeight;

  inputField.focus();

  // ✅ Make input focusable when clicking anywhere on the terminal
  terminal.addEventListener("click", () => {
    inputField.focus();
  });

  inputField.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const value = inputField.value.trim();
      inputField.disabled = true;
      await handleCommand(value);
      createInputLine();
    } else if (e.key === "ArrowUp") {
      if (history.length > 0) {
        historyIndex = historyIndex <= 0 ? history.length - 1 : historyIndex - 1;
        inputField.value = history[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      if (history.length > 0) {
        historyIndex = historyIndex >= history.length - 1 ? 0 : historyIndex + 1;
        inputField.value = history[historyIndex] || "";
      }
    }
  });
}

// Start terminal
createInputLine();

// Theme toggle
const toggleBtn = document.getElementById("themeToggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "light") {
  document.body.classList.add("light-mode");
  toggleBtn.textContent = "🌞";
} else {
  document.body.classList.remove("light-mode");
  toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  toggleBtn.textContent = isLight ? "🌞" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
