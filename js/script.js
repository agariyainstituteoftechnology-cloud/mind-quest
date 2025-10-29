/* == FULL GAME SCRIPT == */
//  Yeh pura code game ke logic aur levels ko control karta hai

$(document).ready(function () {
  //  Yeh tab run hota hai jab page completely load ho jata hai

  // === CONSTANT VALUES (fixed rehne wale data) ===
  const STORAGE_KEY = "mind_quest_v4"; // Local storage key jahan game data save hota hai
  const LEVEL_TIMER = 20; // Har level ke liye total time (seconds)
  const COLOR_TIMER = 5; // Color challenge ke liye short timer

  // === GAME LEVELS KE DETAIL ===
  // Har object ek level represent karta hai
  const LEVELS = [
    {
      id: 1, // Level number
      name: "Logic Gate (The Logic Door)", // Level ka naam
      hint: "Answer all the quiz questions correctly.", // Hint for player
      gradient: "gradient-1", // Background color class for this level
    },
    {
      id: 2,
      name: "Word Temple (The Word Shrine)",
      hint: "Arrange the letters in the correct sequence.",
      gradient: "gradient-2",
    },
    {
      id: 3,
      name: "Color Cave (The Color Den)",
      hint: "Click the target color quickly. Time is short!",
      gradient: "gradient-3",
    },
    {
      id: 4,
      name: "Memory Portal (The Memory Gate)",
      hint: "Find the matching pairs before time runs out.",
      gradient: "gradient-4",
    },
  ];

  // === QUIZ QUESTIONS DATA ===
  // Har object ek riddle (puzzle) hai jisme question, options, aur correct answer index hota hai
  const QUIZZES = [
    {
      q: "What has hands but can’t clap?",
      opts: ["Monkey 🐒", "Clock ⏰", "Robot 🤖", "Baby 👶"],
      a: 1, // Correct answer ka index (0 se start hota hai)
      hint: "Whisper of Time: Its hands chase every moment, yet never touch a thing.",
    },
    {
      q: "I’m tall when I’m young and short when I’m old. What am I?",
      opts: ["Candle 🕯️", "Tree 🌳", "Pencil ✏️", "Shadow 🌑"],
      a: 0,
      hint: "🔥 Flame’s Secret: I glow with life, yet vanish as I give my light away.",
    },
    {
      q: "What can travel around the world while staying in one corner?",
      opts: ["Airplane ✈️", "Stamp 💌", "Compass 🧭", "Globe 🌍"],
      a: 1,
      hint: "Traveler’s Mark: I wander across oceans, yet never move an inch.",
    },
    {
      q: "Which room has no doors or windows?",
      opts: ["Bedroom 🛏️", "Mushroom 🍄", "Bathroom 🚿", "Classroom 🏫"],
      a: 1,
      hint: "Forest Whisper: I bloom in shadows where sunlight never enters.",
    },
    {
      q: "What gets wetter as it dries?",
      opts: ["Sponge 🧽", "Rain 🌧️", "Towel 🩵", "Soap 🫧"],
      a: 2,
      hint: "💧 Paradox of Water: I dry others, yet soak myself with every touch.",
    },
    {
      q: "What has many keys but can’t open a single door?",
      opts: ["Keyboard ⌨️", "Piano 🎹", "Keychain 🔑", "Safe 🧰"],
      a: 1,
      hint: "🎵 Keeper of Melodies: My keys unlock hearts, not doors.",
    },
    {
      q: "What kind of tree can you carry in your hand?",
      opts: ["Palm tree 🌴", "Apple tree 🍎", "Bonsai 🌱", "Christmas tree 🎄"],
      a: 0,
      hint: "Whisper of Earth: Its name rests upon the hand that bears it.",
    },
  ];

  // === WORD, COLOR aur MEMORY game ke data ===
  const WORDS = ["QUEST", "TEMPLE", "LOGIC", "SHINE", "SUCCESS", "CODE"];
  const COLORS = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];
  const MEMORY_SYMBOLS = ["🦋", "🌙", "🌸", "🌈"];

  // === GAME KA CURRENT STATE (player progress, level, etc.) ===
  let state = {
    name: null, // Player ka naam
    level: 1, // Current level number
    unlocked: 1, // Kitne levels unlock hue hain
    score: 0, // Player ka total score
    completed: [], // Completed levels list
    music: false, // Background music (abhi disabled)
    started: false, // Game start hua ya nahi
  };

  // Timers aur retry ka setup
  let timerInterval = null; // Level timer ke liye
  let typingTimer = null; // Narration typing effect ke liye
  let totalRetries = 0; // Player ne kitni baar galti ki
  const maxTotalRetries = 2; // Maximum retries allowed

  // === PLAYER NAME SHOW FUNCTION (jQuery Version) ===
function showPlayerName() {
  // Player ka naam top bar par dikhata hai
  const $playerNameDisplay = $("#playerNameDisplay");
  if ($playerNameDisplay.length) {
    $playerNameDisplay.text(
      `Welcome, ${state.name || ""}`.trim() + (state.name ? "!" : "")
    );
  }
}

  // === DOM ELEMENTS (HTML ke important parts ka reference) ===
  const container = document.getElementById("gameContainer");
  const progressFill = document.getElementById("progressFill");
  const narratorEl = document.getElementById("narrator");
  const stage = document.getElementById("stage");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const playerNameDisplay = document.getElementById("playerNameDisplay");
  const resetBtn = document.getElementById("resetBtn");

  // === AUDIO HANDLING (sound remove kiya gaya) ===
  function setupTone() {
    
  }
  function handleFirstInteraction() {
   
  }
  function playClick() {
    
  }
  function playWin() {
    
  }
  function playErr() {
    
  }

  // === HELPER FUNCTIONS ===
  // Random number generate karne ke liye
  const rand = (n) => Math.floor(Math.random() * n);

  // Array shuffle karne ke liye (random order mein kar deta hai)
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // === GAME SAVE / LOAD ===
  // Local storage mein data save karta hai
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Local storage se data wapas load karta hai
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load state", e);
    }
  }

  // Score update karne ka function
  function updateScore(points) {
    state.score += points;
    scoreDisplay.textContent = `Score: ${state.score}`;
    save();
  }

  // === TEXT NARRATION (Typewriter effect) ===
  function narrate(text, speed = 25) {
    if (typingTimer) clearInterval(typingTimer);
    narratorEl.textContent = "";
    let i = 0;
    const final =
      text +
      (text.endsWith(".") || text.endsWith("!") || text.endsWith("?")
        ? ""
        : "...");
    typingTimer = setInterval(() => {
      narratorEl.textContent += final[i++] || "";
      if (i > final.length) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }, speed);
  }

  // === PROGRESS BAR UPDATE ===
  function setProgress() {
    const totalLevels = LEVELS.length;
    const progress = (state.level - 1) / totalLevels;
    const pct = progress * 100;
    progressFill.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }

  // === LEVEL GRADIENT SETTER ===
  // Har level ka background color badalta hai
  function setGradient(levelId) {
    LEVELS.forEach((l) => container.classList.remove(l.gradient));
    container.classList.remove("gradient-victory");
    const level = LEVELS.find((l) => l.id === levelId);
    if (level) container.classList.add(level.gradient);
    else if (levelId === 6) container.classList.add("gradient-victory");
  }

  // === BODY BACKGROUND CHANGE (Level ke hisaab se) ===
  function setLevelBackground(levelId) {
    const body = document.body;
    // Pehle purani background classes hatao
    body.classList.remove(
      "level-1",
      "level-2",
      "level-3",
      "level-4",
      "victory"
    );

    // Phir current level ke liye nayi class lagao
    if (levelId >= 1 && levelId <= 4) {
      body.classList.add(`level-${levelId}`);
    } else if (levelId === 6 || levelId === "victory") {
      body.classList.add("victory");
    }
  }

  // ----------  Ye function kisi bhi selector (element type) par clicks disable karta hai ----------
  function disableClicksOn(selector) {
    if (!selector) return; // agar selector nahi mila to kuch mat karo
    document.querySelectorAll(selector).forEach((el) => {
      el.style.pointerEvents = "none"; // click karne ki permission band kar do
      el.style.opacity = "0.55"; // thoda transparent bana do (visual feedback)
    });
  }

  // ----------  Ye function clicks ko dobara enable karta hai ----------
  function enableClicksOn(selector) {
    if (!selector) return;
    document.querySelectorAll(selector).forEach((el) => {
      el.style.pointerEvents = ""; // clicks wapas allow karo
      el.style.opacity = ""; // opacity wapas normal kar do
    });
  }

  // ----------  Ye function batata hai kis level me kaun se buttons disable karne hain ----------
  function getDisableSelectorForLevel(levelId) {
    switch (levelId) {
      case 1:
        return ".option-btn"; // Level 1 me quiz options disable karne hain
      case 2:
        return "#tiles .tile"; // Level 2 me word tiles disable karne hain
      case 3:
        return ".color-box"; // Level 3 me color boxes disable karne hain
      case 4:
        return ".mem-card"; // Level 4 me memory cards disable karne hain
      default:
        return null; // agar level match na kare to kuch mat disable karo
    }
  }

  // ----------  Ye function ek single "Try Again" button screen par show karta hai ----------
  function showSingleRetry(levelId, message) {
    // pehle se koi retry button ho to use remove kar do
    const old = stage.querySelector(".retry-area");
    if (old) old.remove();

    // naya retry area banate hain
    const retryWrap = document.createElement("div");
    retryWrap.className =
      "retry-area text-center w-full flex flex-col items-center justify-center space-y-3";

    // --- Upar wali info line (mistake count + message) ---
    const infoWrap = document.createElement("div");
    infoWrap.className = "text-center";

    const mistakeLine = document.createElement("div");
    mistakeLine.className = "text-sm font-bold";
    mistakeLine.style.color = "#ffd166"; // halka yellow color
    mistakeLine.textContent = `Mistake ${totalRetries}/${maxTotalRetries}`;

    const msg = document.createElement("div");
    msg.className = "small-muted";
    msg.textContent = message || "Time is up!"; // agar message na mila to default likho

    infoWrap.appendChild(mistakeLine);

    // --- Neeche Try Again button ---
    const btn = document.createElement("button");
    btn.className = "retry-btn mt-4";
    btn.textContent = "Try Again";
    btn.onclick = () => {
      playClick(); 
      retryWrap.remove(); // retry area hatao
      goto(levelId); // usi level par wapas jao
    };

    // sab elements ko combine karke stage me show karte hain
    retryWrap.appendChild(infoWrap);
    retryWrap.appendChild(btn);
    stage.appendChild(retryWrap);
  }

  // ----------  Ye main function level change karne ka kaam karta hai ----------
  function goto(n) {
    clearTimer(); // timer reset karo
    state.level = n; // current level update karo
    save(); // data local storage me save karo
    setProgress(); // progress bar update karo
    setGradient(n); // background gradient change karo
    setLevelBackground(n); // background color set karo

    const level = LEVELS[n - 1]; // current level ka data array se lo
    if (level) {
      narrate(`Entering ${level.name}. Challenge: ${level.hint}`); // narrator text show karo
      stage.innerHTML = ""; // purani screen saaf karo
      setTimeout(() => {
        // thoda delay dekar sahi level ka function chalao
        if (n === 1) levelLogic();
        else if (n === 2) levelWord();
        else if (n === 3) levelColor();
        else if (n === 4) levelMemory();
      }, 500);
    } else if (n === 4) {
      victory(); // agar last level complete ho gaya to victory show karo
    }
  }

  // ---------- Jab player fail ho jaye to ye function chalta hai ----------
  function handleFailure(hintText, currentLevelId) {
    clearTimer(); // timer band karo
    playErr(); // error sound bajao
    totalRetries++; // total mistakes count badhao

    // agar limit se zyada mistakes ho gayi to Game Over screen dikhao
    if (totalRetries >= maxTotalRetries + 1) {
      stage.innerHTML = `
      <div class="text-center text-white p-8">
        <h2 class="text-3xl text-red-400 mb-4 bold-text">😢 You failed!</h2>
        <p class="text-lg mb-4">You made ${maxTotalRetries} mistakes in total.</p>
        <button onclick="restartGame()" class="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition">
          Restart Game
        </button>
      </div>
    `;
      return; // yahin se function khatam
    }

    // jis level me fail hua uske clickable items disable karo
    const sel = getDisableSelectorForLevel(currentLevelId);
    if (sel) disableClicksOn(sel);

    // narrator se message aur "Try Again" button show karo
    narrate(hintText || "Time is up! Try again.");
    showSingleRetry(currentLevelId, hintText || "Time is up! Try again.");
  }

  // ---------- 🔹 Jab time khatam ho jaye to direct Restart screen dikhata hai ----------
  function handleTimerExpire(levelId, hintText) {
    clearTimer(); // timer band karo
    playErr(); // error sound

    stage.innerHTML = `
    <div class="text-center text-white p-8">
      <h2 class="text-3xl text-red-400 mb-4 bold-text">⏰ Time's up!</h2>
      <p class="text-lg mb-4">${hintText || "You ran out of time!"}</p>
      <button onclick="restartGame()" class="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition">
        Restart Game
      </button>
    </div>
  `;

    // baaki clickable items disable kar do (optional)
    const sel = getDisableSelectorForLevel(levelId);
    if (sel) disableClicksOn(sel);
  }

  // ----------  Ye function game ko completely restart karta hai ----------
  function restartGame() {
    totalRetries = 0; // retries reset
    state.level = 1; // level wapas 1 par
    state.unlocked = 1; // sirf first level unlock
    state.score = 0; // score reset
    state.completed = []; // completed levels empty
    save(); // localStorage me save karo
    scoreDisplay.textContent = "Score: 0"; // UI update karo

    // player name ke sath message dikhana
    const playerName = state.name || "Explorer";
    narrate(`Game restarted! Let's begin again, ${playerName} 💪`);

    // thoda delay dekar level 1 start karo
    setTimeout(() => goto(1), 1200);
  }

  // ----------  Ye line restartGame function ko global scope me available banati hai ----------
  window.restartGame = restartGame;

  // ----------  Ye function level complete hone ke baad next level par le jata hai ----------
  function advanceFrom(levelId) {
    // completed levels ka record update karo
    state.completed = Array.from(new Set(state.completed.concat(levelId)));

    // next level unlock karo agar pehle unlock nahi hua
    if (state.unlocked < levelId + 1) state.unlocked = levelId + 1;

    save(); // sab data save karo
    setProgress(); // progress bar update karo

    // agar next level hai to wahan jao, warna victory dikhado
    if (levelId < LEVELS.length) setTimeout(() => goto(levelId + 1), 500);
    else setTimeout(() => victory(), 500);
  }

  // ----------  LEVEL 1: Logic Gate (Quiz Game) ----------
  function levelLogic() {
    // Stage (main game area) par quiz layout set kar rahe hain
    stage.innerHTML = `
    <h2 class="text-3xl font-extrabold mb-4">Logic Gate 🧩</h2>
    <p class="mb-6 opacity-80">Answer all ${QUIZZES.length} questions correctly.</p>
    <div id="quizArea" class="w-full max-w-sm mx-auto p-4 bg-gray-800 rounded-xl shadow-2xl"></div>
    <div id="quizStatus" class="mt-4 text-xl font-bold">Progress: 0/${QUIZZES.length}</div>
  `;

    let qIndex = 0, // current question ka index
      correctCount = 0; // sahi answers ka count

    const shuffledQuizzes = shuffle(QUIZZES.slice()); // questions ko random order me la rahe hain
    const quizArea = document.getElementById("quizArea");
    const quizStatus = document.getElementById("quizStatus");

    // --- Ye function ek ek karke quiz render karega ---
    function renderQuiz() {
      // Agar saare questions complete ho gaye
      if (qIndex >= QUIZZES.length) {
        updateScore(40 + correctCount * 10); // score badhao
        narrate(
          `Logic Gate passed! You answered ${correctCount} out of ${QUIZZES.length} correctly.`
        );
        clearTimer(); // timer stop karo
        setTimeout(() => advanceFrom(1), 1200); // next level par jao
        return;
      }

      // Current question data nikal rahe hain
      const qData = shuffledQuizzes[qIndex];
      quizStatus.textContent = `Progress: ${qIndex}/${QUIZZES.length}`;

      // Question aur options show karne ke liye HTML bana rahe hain
      quizArea.innerHTML = `
      <p class="text-lg font-semibold mb-4">${qData.q}</p>
      <div id="options" class="flex flex-col gap-3"></div>
    `;
      const optionsDiv = document.getElementById("options");

      // Har option ke liye ek button bana rahe hain
      qData.opts.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className =
          "option-btn bg-slate-700 hover:bg-slate-600 text-left text-sm py-3 px-4 rounded-lg transition shadow-md";
        btn.textContent = opt;

        // Jab user kisi option par click kare
        btn.onclick = (e) => {
          playClick(); // click sound
          Array.from(optionsDiv.children).forEach((b) => (b.disabled = true)); // saare options disable kar do

          if (idx === qData.a) {
            // Agar answer sahi hai
            playWin();
            correctCount++; // correct count badhao
            e.target.classList.add("bg-green-600", "hover:bg-green-600");
            narrate("Correct! The next question is loading...");
            qIndex++; // next question par jao
            setTimeout(renderQuiz, 1000);
          } else {
            // Agar answer galat hai
            playErr();
            e.target.classList.add("bg-red-600", "hover:bg-red-600");
            clearTimer();
            handleFailure(qData.hint, 1); // fail screen show karo
          }
        };
        optionsDiv.appendChild(btn);
      });
    }

    // Timer start karte hain (60 seconds)
    startTimer(60, () => handleTimerExpire(1, "You ran out of time!"), 1);

    renderQuiz(); // quiz start kar do
  }

  // ----------  LEVEL 2: Word Temple (Word Puzzle) ----------
  function levelWord() {
    // Stage par layout bana rahe hain
    stage.innerHTML = `
    <h2 class="text-3xl font-extrabold mb-4">Word Temple 🏛️</h2>
    <p class="mb-6 opacity-80">Arrange the letters in the correct sequence:</p>
    <div id="tiles" class="tile-container"></div>
    <div id="result" class="text-3xl font-mono mt-8 p-3 rounded-lg bg-gray-900 shadow-inner min-h-12 w-full max-w-xs mx-auto"></div>
  `;

    const word = WORDS[rand(WORDS.length)]; // random word choose karte hain
    const chars = shuffle(word.split("")); // uske letters ko random order me mix karte hain
    const tiles = document.getElementById("tiles");
    let selected = []; // user ke selected letters store honge

    // Har click ke baad result box update hota rahe
    const renderResult = () => {
      document.getElementById("result").textContent = selected.join("");
    };

    // Har letter ke liye ek tile bana rahe hain
    chars.forEach((ch) => {
      const t = document.createElement("div");
      t.className = "tile";
      t.textContent = ch;

      // Jab user tile par click kare
      t.onclick = () => {
        playClick();
        if (t.classList.contains("tile-ghost")) return; // agar already selected hai to ignore karo

        t.classList.add("tile-ghost"); // selected tile ko grey bana do
        selected.push(ch); // letter add karo
        renderResult();

        // Agar saare letters select ho gaye
        if (selected.length === word.length) {
          if (selected.join("") === word) {
            // Agar sahi word ban gaya
            playWin();
            updateScore(25);
            narrate(
              `Excellent! The word is found: ${word}. The next zone is unlocked!`
            );
            clearTimer();
            document
              .getElementById("result")
              .classList.add("text-green-400", "animate-pulse");
            setTimeout(() => advanceFrom(2), 1200);
          } else {
            // Agar galat word bana to hint show karo
            if (word === "TEMPLE")
              handleFailure("✨ Hint: A sacred place where silence speaks.", 2);
            else if (word === "QUEST")
              handleFailure(
                "✨ Hint: A journey where curiosity becomes courage.",
                2
              );
            else if (word === "LOGIC")
              handleFailure(
                "✨ Hint: The power that turns confusion into clarity.",
                2
              );
            else if (word === "SHINE")
              handleFailure(
                "✨ Hint: What the sun does even after the night ends.",
                2
              );
            else if (word === "SUCCESS")
              handleFailure(
                "✨ Hint: The twins that dance among the stars.",
                2
              );
            else if (word === "CODE")
              handleFailure(
                "✨ Hint: A hidden language that only minds can unlock.",
                2
              );
          }
        }
      };
      tiles.appendChild(t);
    });

    // Timer start karte hain (LEVEL_TIMER constant ke hisaab se)
    startTimer(
      LEVEL_TIMER,
      () => handleTimerExpire(2, "You ran out of time!"),
      2
    );
  }

  // ----------  LEVEL 3: Color Cave (Color Matching Game) ----------
  function levelColor() {
    stage.innerHTML = `
    <h2 class="text-3xl font-extrabold mb-4">Color Cave 🎨</h2>
    <p class="mb-6 opacity-80">Click the box that matches the target color name. Quick!</p>
    <div id="targetArea" class="mb-8 p-3 bg-gray-800 rounded-lg shadow-lg"></div>
    <div id="colors" class="color-grid"></div>
  `;

    // Random color target select karte hain
    const targetColorCode = COLORS[rand(COLORS.length)];
    const targetName = getColorName(targetColorCode);

    // Target name show karo
    document.getElementById("targetArea").innerHTML = `
    <p class="text-xl font-bold">Target: <span class="text-yellow-300">${targetName}</span></p>
  `;

    const grid = document.getElementById("colors");
    const options = shuffle(COLORS.slice()); // colors ko random order me rakho

    // Har color ke liye ek box bana rahe hain
    options.forEach((c) => {
      const b = document.createElement("div");
      b.className = "color-box";
      b.style.backgroundColor = c;

      // Click event for each color box
      b.onclick = () => {
        playClick();
        if (b.dataset.disabled) return;

        if (c === targetColorCode) {
          // Agar sahi color choose kiya
          playWin();
          updateScore(20);
          narrate("Perfect! Your vision is sharp!");
          clearTimer();
          b.style.border = "4px solid #10b981"; // green border
          setTimeout(() => advanceFrom(3), 1000);
        } else {
          // Agar galat color choose hua
          b.style.border = "4px solid #ef4444"; // red border
          clearTimer();
          Array.from(grid.children).forEach(
            (box) => (box.dataset.disabled = "true")
          );
          handleFailure(`The correct color was ${targetName}.`, 3);
        }

        // Saare boxes disable kar do
        Array.from(grid.children).forEach(
          (box) => (box.dataset.disabled = "true")
        );
      };

      grid.appendChild(b);
    });

    // Timer start karo
    startTimer(
      COLOR_TIMER,
      () => handleTimerExpire(3, "You ran out of time!"),
      3
    );
  }

  // ----------  Ye function HEX color code ka naam return karta hai ----------
  function getColorName(hex) {
    const map = {
      "#ef4444": "Red",
      "#3b82f6": "Blue",
      "#10b981": "Green",
      "#f59e0b": "Amber",
      "#8b5cf6": "Violet",
      "#06b6d4": "Cyan",
    };
    return map[hex] || "Mystery Color"; // agar color match na kare to default naam
  }

  // ---------- 🔹 LEVEL 4: Memory Portal (Memory Match Game) ----------
  function levelMemory() {
    stage.innerHTML = `
    <h2 class="text-3xl font-extrabold mb-4">Memory Portal 🧠</h2>
    <p class="mb-6 opacity-80">Match all 4 pairs quickly. Your mind is the key.</p>
    <div id="mem" class="mem-grid w-full max-w-sm mx-auto" style="grid-template-columns: repeat(4, 1fr); display: grid;"></div>
  `;

    const pool = MEMORY_SYMBOLS; // 4 unique symbols
    const deck = shuffle(pool.concat(pool)); // unko double karke pairs bana liye
    let openIndex = -1, // pehla clicked card ka index
      openCard = null, // pehla clicked card element
      matchedCount = 0, // matched pairs count
      isBusy = false; // taake ek waqt me do se zyada clicks na ho

    // Har card render kar rahe hain
    deck.forEach((val, i) => {
      const c = document.createElement("div");
      c.className = "mem-card shadow-lg";
      c.textContent = "?"; // initially hidden
      c.dataset.value = val;

      // Jab card click ho
      c.onclick = () => {
        playClick();

        // Agar card already flipped ya matched hai to ignore karo
        if (
          c.classList.contains("matched") ||
          c.classList.contains("flipped") ||
          isBusy
        )
          return;

        c.textContent = val; // symbol show karo
        c.classList.add("flipped");

        if (openIndex === -1) {
          // Pehla card click hua
          openIndex = i;
          openCard = c;
        } else {
          // Doosra card click hua
          isBusy = true;

          if (deck[openIndex] === deck[i]) {
            // Agar dono same symbol hain
            playWin();
            c.classList.remove("flipped");
            openCard.classList.remove("flipped");
            c.classList.add("matched");
            openCard.classList.add("matched");
            matchedCount++;

            // Agar saare pairs mil gaye
            if (matchedCount === pool.length) {
              updateScore(45);
              narrate("Memory Master! All pairs found.");
              clearTimer();
              setTimeout(() => advanceFrom(4), 1000);
            }

            openIndex = -1;
            openCard = null;
            isBusy = false;
          } else {
            // Agar symbols match nahi hue
            playErr();
            setTimeout(() => {
              c.textContent = "?";
              c.classList.remove("flipped");
              if (openCard) {
                openCard.textContent = "?";
                openCard.classList.remove("flipped");
              }
              openIndex = -1;
              openCard = null;
              isBusy = false;
            }, 900);
          }
        }
      };

      mem.appendChild(c);
    });

    // Timer start karo
    startTimer(
      LEVEL_TIMER,
      () => handleTimerExpire(4, "Remember the positions of the symbols!"),
      4
    );
  }

  //  VICTORY FUNCTION — Jab player game jeet jaye
  function victory() {
    setLevelBackground("victory"); // background ko victory theme par set karo
    clearTimer(); // koi bhi chal raha timer band kar do
    setGradient(6); // 6th gradient (special victory color) lagao
    const totalScore = state.score; // total score get karo player ka
    let badge = "Bronze Explorer"; // default badge agar score kam ho

    // Agar perfect 200 score ho to "Golden Master" badge milega 
    if (totalScore === 200) badge = "Golden Master";

    // progress bar ko 100% fill kar do
    document.getElementById("progressFill").style.width = "100%";

    // Victory screen HTML bana ke show karo
    stage.innerHTML = 
  "<div class='trophy flex flex-col items-center'>" +
    "<p class='text-6xl mb-4'>🏆</p>" +
    "<div class='px-4 py-1 mb-4 text-sm font-bold rounded-full bg-yellow-400 text-gray-900 shadow-xl'>" + badge + "</div>" +
    "<h2 class='text-4xl font-extrabold text-yellow-300 mb-2'>Victory, " + state.name + "!</h2>" +
    "<p class='text-xl opacity-90 mb-6'>You are the Master of Mind Quest!</p>" +
    "<div class='text-3xl font-bold p-4 bg-gray-800 rounded-xl shadow-inner'>Final Score: " + totalScore + "</div>" +
  "</div>";


    // "Play Again" button create karo
    const again = document.createElement("button");
    again.className =
      "bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-full mt-8 transition shadow-2xl";
    again.textContent = "Play Again 🚀";

    // Button click par game reset ho aur dobara start ho
    again.onclick = () => {
      state.level = 1;
      state.unlocked = 1;
      state.score = 0;
      state.completed = [];
      save();
      playClick();
      narrate("The map is resetting. Start a new adventure!");
      setTimeout(() => goto(1), 500);
    };

    // Button ko stage par add karo
    stage.appendChild(again);

    // Confetti animation trigger karo (screen ke center me)
    spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 400);
    playWin(); // victory sound bajao
  }

  // 🎊 CONFETTI EFFECT — Colorful particles animation
  const confettiCanvas = document.getElementById("confettiCanvas");
  const ctx = confettiCanvas.getContext("2d");
  let particles = [];

  // Screen resize hone par canvas bhi resize hota rahe
  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Confetti spawn karne ka function — random colors aur speed ke sath
  function spawnConfetti(
    x,
    y,
    count = 100,
    colorPool = [
      "#ff6b6b", // bright coral red
      "#ffd93d", // golden yellow
      "#6bcB77", // fresh green
      "#4d96ff", // sky blue
      "#f5b0e7", // pastel pink
      "#f9a826", // deep orange
      "#a78bfa", // lavender
      "#00c3ff", // neon cyan
    ]
  ) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8, // horizontal random move
        vy: Math.random() * -8 - 2, // upward move
        size: 5 + Math.random() * 5, // random size
        col: colorPool[Math.floor(Math.random() * colorPool.length)], // random color
        life: 80 + Math.floor(Math.random() * 100), // particle life
      });
    }
  }

  // Confetti loop — har frame me particles update aur draw karna
  function confettiLoop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; // move horizontally
      p.y += p.vy; // move vertically
      p.vy += 0.18; // gravity effect
      p.life--; // life reduce karo
      ctx.fillStyle = p.col;
      ctx.fillRect(p.x, p.y, p.size, p.size); // draw square particle

      // Agar particle dead ho ya screen se bahar chala jaye to remove karo
      if (p.life <= 0 || p.y > confettiCanvas.height) particles.splice(i, 1);
    }
    requestAnimationFrame(confettiLoop); // loop ko lagataar chalate raho
  }
  confettiLoop(); // confetti animation start

  // 🔄 RESET BUTTON FUNCTIONALITY

  // DOM elements select karo
  const resetPopup = document.getElementById("resetPopup"); // poora popup container
  const confirmReset = document.getElementById("confirmReset"); // "Yes, Reset" button
  const cancelReset = document.getElementById("cancelReset"); // "Cancel" button

  // ✅ Jab user reset button click kare
  resetBtn.onclick = () => {
    // popup ko visible karo
    resetPopup.classList.remove("opacity-0", "pointer-events-none");

    // thoda delay ke baad scale animation start karo (smooth zoom in effect)
    setTimeout(() => {
      resetPopup.querySelector("div").classList.add("scale-100");
    }, 20);
  };

  //  Agar user cancel kare
  cancelReset.onclick = () => {
    // popup ko zoom out aur hide karo
    resetPopup.querySelector("div").classList.remove("scale-100");
    resetPopup.classList.add("opacity-0", "pointer-events-none");
  };

  // ✅ Agar user confirm kare (game reset)
  confirmReset.onclick = () => {
    // popup hide karo
    resetPopup.querySelector("div").classList.remove("scale-100");
    resetPopup.classList.add("opacity-0", "pointer-events-none");

    // game state ko reset karo
    localStorage.removeItem(STORAGE_KEY); // local storage clear
    state = {
      name: null,
      level: 1,
      unlocked: 1,
      score: 0,
      completed: [],
      music: false,
      started: false,
    };

    clearTimer(); // agar koi timer chal raha ho to stop karo
    initGame(); // welcome screen ya first level load karo

    narrate("Game has been reset. Welcome back, Explorer!"); // player ko message dikhaye
    playClick(); // button click ka feedback (sound currently disabled)
  };

  //  WELCOME SCREEN — jab game first time open ho
  function welcomeScreen() {
    document.body.className = "enter-screen"; // background enter screen ka lagao
    setGradient(0); // gradient 0 (default) set karo
    playerNameDisplay.textContent = "";
    scoreDisplay.textContent = "Score: 0";

    // HTML structure for welcome page
    stage.innerHTML = 
  "<h1 class='text-5xl font-extrabold mb-4 text-yellow-400'>Mind Quest</h1>" +
  "<p class='text-lg mb-8 opacity-80'>The Adventure of Logic and Luck</p>" +
  "<input type='text' id='nameInput' placeholder='Enter Your Full Name' class='w-full max-w-xs p-3 mb-6 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition'/>" +
  "<button id='startBtn' class='bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition shadow-xl' disabled>" +
    "Start the Adventure 🚀" +
  "</button>" +
  "<div class='mt-4 text-sm opacity-60'>Complete 4 challenges to win!</div>";


    const nameInput = document.getElementById("nameInput");
    const startBtn = document.getElementById("startBtn");

    // Agar pehle name save tha to input me show karo
    nameInput.value = state.name || "";
    startBtn.disabled = !nameInput.value; // name na ho to disable rakho

    // Jab user name likhe to state update karo
    nameInput.oninput = () => {
      const name = nameInput.value.trim();
      state.name = name; // name ko state me save karo
      showPlayerName(); // naam ko top bar me dikhayo
      startBtn.disabled = !name; // name likhne ke baad button enable
      save(); // local storage me store karo
    };

    // Start button par click hone par game start ho jaye
    startBtn.onclick = () => {
      handleFirstInteraction();
      state.started = true;
      save();
      goto(state.unlocked); // unlocked level se start karo
    };

    narrate("Welcome, Explorer. Enter your name and begin Mind Quest."); // guiding text
  }

  //  INIT GAME — jab page load ho ya reset ho
  function initGame() {
    load(); // localStorage se data load karo
    scoreDisplay.textContent = `Score: ${state.score || 0}`; // score set karo
    showPlayerName(); // naam aur greeting dikhayo

    // Agar player ka name aur started flag true hai to game resume karo
    if (state.name && state.started) {
      playerNameDisplay.textContent = `Welcome, ${state.name}!`;
      goto(state.unlocked); // last unlocked level load karo
    } else {
      welcomeScreen(); // otherwise welcome page show karo
    }
  }

  //  TIMER FUNCTIONS — har level ke liye countdown timer
  function startTimer(seconds, onExpire, levelId) {
    clearTimer(); // pehle se koi timer ho to stop karo
    let t = seconds;
    const timerEl = attachTimer(t); // timer display add karo
    timerInterval = setInterval(() => {
      t--;
      timerEl.textContent = `⏳ ${t}s`; // time show karo
      if (t <= 0) {
        clearTimer();
        onExpire(); // time khatam hone par function call karo
      }
    }, 1000);
  }

  // Timer stop karne ka function
  function clearTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  // Timer ko stage ke top par attach karne ka function
  function attachTimer(seconds) {
    let timerWrap = stage.querySelector(".timerWrap");
    if (!timerWrap) {
      timerWrap = document.createElement("div");
      timerWrap.className = "timerWrap text-sm font-bold text-red-300 mb-4";
      stage.prepend(timerWrap);
    }
    timerWrap.textContent = `⏳ ${seconds}s`;
    return timerWrap;
  }

  //  Jab page load ho to initGame function auto run ho
  window.onload = initGame;
});                