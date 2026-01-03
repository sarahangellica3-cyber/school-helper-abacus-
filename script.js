const COLUMNS = 9;
const soroban = document.getElementById("soroban");
const values = document.getElementById("values");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const resetBtn = document.getElementById("resetBtn");
const proModeBtn = document.getElementById("proModeBtn");

let state = [];
let undoStack = [];
let redoStack = [];

function saveHistory() {
  undoStack.push(JSON.stringify(state));
  redoStack = [];
}

function restoreState(data) {
  state = JSON.parse(data);
  render();
}

function render() {
  soroban.innerHTML = "";
  values.innerHTML = "";

  state.forEach((col, i) => {
    const column = document.createElement("div");
    column.className = "column";

    const rod = document.createElement("div");
    rod.className = "rod";
    column.appendChild(rod);

    const divider = document.createElement("div");
    divider.className = "divider";
    column.appendChild(divider);

    /* bead atas */
    const topBead = document.createElement("div");
    topBead.className = "bead";
    topBead.style.top = col.top ? "100px" : "30px";
    if (col.top) topBead.classList.add("active");

    topBead.onclick = () => {
      saveHistory();
      col.top = !col.top;
      render();
    };

    column.appendChild(topBead);

    /* bead bawah — MODIFIKASI: Klik untuk naikkan/turunkan dengan cascading */
    col.bottom.forEach((b, idx) => {
      const bead = document.createElement("div");
      bead.className = "bead";
      bead.style.top = b ? `${170 + idx * 40}px` : `${210 + idx * 40}px`;
      if (b) bead.classList.add("active");

      bead.onclick = () => {
        saveHistory();
        if (!b) {
          // Jika tidak aktif, naikkan range dari 0 sampai idx
          for (let j = 0; j <= idx; j++) {
            col.bottom[j] = true;
          }
        } else {
          // Jika aktif
          // Cari idx paling atas yang aktif
          let topActiveIdx = -1;
          for (let j = 0; j < col.bottom.length; j++) {
            if (col.bottom[j]) {
              topActiveIdx = j;
              break;
            }
          }
          if (idx === topActiveIdx) {
            // Jika ini adalah bead paling atas yang aktif, turunkan semua dari idx ke bawah
            for (let j = idx; j < col.bottom.length; j++) {
              col.bottom[j] = false;
            }
          } else {
            // Jika tidak, turunkan hanya bead ini
            col.bottom[idx] = false;
          }
        }
        render();
      };

      column.appendChild(bead);
    });

    soroban.appendChild(column);

    let val = (col.top ? 5 : 0) + col.bottom.filter(Boolean).length;
    const v = document.createElement("div");
    v.textContent = val;
    values.appendChild(v);
  });
}

/* init */
for (let i = 0; i < COLUMNS; i++) {
  state.push({ top: false, bottom: [false, false, false, false] });
}
render();

/* tombol */
undoBtn.onclick = () => {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(state));
  restoreState(undoStack.pop());
};

redoBtn.onclick = () => {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(state));
  restoreState(redoStack.pop());
};

resetBtn.onclick = () => {
  saveHistory();
  state = state.map(() => ({ top: false, bottom: [false, false, false, false] }));
  render();
};

/* ===============================
   EMOJI HIASAN LUAR ANGKASA (DITAMBAHKAN LEBIH BANYAK UNTUK HIASAN)
   =============================== */
const bg = document.querySelector(".space-bg");

const emojis = ["🪐", "🚀", "🌌", "☄️", "🌙", "⭐", "🌠", "🛰️", "🌍", "🌑", "✨", "🌟"];

for (let i = 0; i < 12; i++) {
  const e = document.createElement("span");
  e.textContent = emojis[i % emojis.length];
  e.style.left = Math.random() * 90 + "vw"; // Posisi acak di seluruh layar
  e.style.top = Math.random() * 90 + "vh";
  e.style.animationDuration = (8 + Math.random() * 8) + "s"; // Durasi acak untuk variasi gerakan
  e.style.animationDelay = Math.random() * 5 + "s"; // Delay acak
  bg.appendChild(e);
}

/* ===============================
   FITUR PRO MENTAL FLASH MODE
   =============================== */
const proOverlay = document.getElementById("proOverlay");
const modeOverlay = document.getElementById("modeOverlay");
const flashOverlay = document.getElementById("flashOverlay");
const payBtn = document.getElementById("payBtn");
const adBtn = document.getElementById("adBtn");
const closeOverlay = document.getElementById("closeOverlay");
const startBtn = document.getElementById("startBtn");
const closeModeOverlay = document.getElementById("closeModeOverlay");
const numberDisplay = document.getElementById("numberDisplay");
const answerSection = document.getElementById("answerSection");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");
const closeFlashOverlay = document.getElementById("closeFlashOverlay");

let isProUnlocked = false;
let numbers = [];
let correctAnswer = 0;

proModeBtn.onclick = () => {
  proOverlay.classList.remove("hidden");
};

closeOverlay.onclick = () => {
  proOverlay.classList.add("hidden");
};

payBtn.onclick = () => {
  // Simulasi pembayaran
  alert("Pembayaran 20.000 Rupiah berhasil! Mode Pro dibuka sementara.");
  isProUnlocked = true;
  proOverlay.classList.add("hidden");
  modeOverlay.classList.remove("hidden");
};

adBtn.onclick = () => {
  // Simulasi nonton iklan
  alert("Menonton 5 iklan... (simulasi selesai). Mode Pro dibuka sementara.");
  isProUnlocked = true;
  proOverlay.classList.add("hidden");
  modeOverlay.classList.remove("hidden");
};

closeModeOverlay.onclick = () => {
  modeOverlay.classList.add("hidden");
};

startBtn.onclick = () => {
  if (!isProUnlocked) return;
  const operation = document.querySelector('input[name="operation"]:checked').value;
  const level = parseFloat(document.querySelector('input[name="level"]:checked').value);
  modeOverlay.classList.add("hidden");
  flashOverlay.classList.remove("hidden");
  startFlash(operation, level);
};

function startFlash(operation, level) {
  numbers = [];
  for (let i = 0; i < 10; i++) {
    numbers.push(Math.floor(Math.random() * 10) + 1); // Angka 1-10
  }
  correctAnswer = calculateAnswer(operation, numbers);
  let index = 0;
  numberDisplay.textContent = "";
  answerSection.classList.add("hidden");
  const interval = setInterval(() => {
    if (index < numbers.length) {
      numberDisplay.textContent = numbers[index];
      index++;
    } else {
      clearInterval(interval);
      answerSection.classList.remove("hidden");
    }
  }, level * 1000); // Durasi dalam ms
}

function calculateAnswer(operation, nums) {
  let result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    switch (operation) {
      case "addition":
        result += nums[i];
        break;
      case "subtraction":
        result -= nums[i];
        break;
      case "multiplication":
        result *= nums[i];
        break;
      case "division":
        result /= nums[i];
        break;
    }
  }
  return Math.round(result * 100) / 100; // Bulatkan ke 2 desimal
}

submitBtn.onclick = () => {
  const userAnswer = parseFloat(answerInput.value);
  if (userAnswer === correctAnswer) {
    result.textContent = "Benar! Jawaban: " + correctAnswer;
  } else {
    result.textContent = "Salah! Jawaban benar: " + correctAnswer;
  }
};

closeFlashOverlay.onclick = () => {
  flashOverlay.classList.add("hidden");
};