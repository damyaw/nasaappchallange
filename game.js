// OUTPOST 13: QAZAQ SPACE PROGRAM - CORE GAME ENGINE
// Manages State, Campaign Flow, 30 Days Progression, AI Crew Simulation, Lobby & UI

class OutpostGame {
  constructor() {
    this.currentScreen = 'screen-loading';
    this.day = 1;
    this.maxDays = 30;
    this.currentLevel = 1;

    // Selected Player Character (Default: Aisha)
    this.selectedCharacterId = 'aisha';
    this.character = window.CREW_MEMBERS[0];

    // Resources State
    this.resources = {
      oxygen: 85,
      food: 90,
      water: 80,
      energy: 95,
      fuel: 75,
      materials: 60,
      spareParts: 50
    };

    // Base Integrity & Morale
    this.baseIntegrity = 100;
    this.teamMorale = 90;

    // Secret Easter Egg Progress («АПА ЖІБЕРДІ»)
    this.secretEggProgress = 0; // Needs 3 to trigger secret ending!

    // Simulated Crew (6 members)
    this.crew = JSON.parse(JSON.stringify(window.CREW_MEMBERS)).map(c => ({
      ...c,
      hp: 100,
      sanity: 90,
      status: "Сапта (В строю)",
      location: "Кают-компания"
    }));

    // Lobby State
    this.lobbyCode = "BAYK-77";
    this.lobbyPlayers = [];
    this.isHost = true;

    // Daily Tasks
    this.activeTasks = [];
    this.completedTasksToday = 0;

    // MiniGames Manager
    this.miniGames = new window.MiniGameManager(this);

    // Activity Log & Intercom Chat
    this.intercomLogs = [];
  }

  init() {
    this.bindEvents();
    this.setupLobby();
    this.initAudioTriggers();

    // Start boot sequence
    setTimeout(() => {
      this.finishBootSequence();
    }, 2200);
  }

  bindEvents() {
    // Navigation Buttons
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-goto');
        window.soundEngine.playClick();
        this.switchScreen(target);
      });
    });

    // Sound Toggle Button
    const muteBtn = document.getElementById('soundToggleBtn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const muted = window.soundEngine.toggleMute();
        muteBtn.innerText = muted ? "🔇 ДЫБЫС: ӨШІРУЛІ" : "🔊 ДЫБЫС: ҚОСУЛЫ";
      });
    }

    // Play button from menu
    const playBtn = document.getElementById('mainPlayBtn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        window.soundEngine.startAmbientDrone();
        this.switchScreen('screen-character-select');
      });
    }

    // Start Mission Button (Goes to Briefing)
    const startMissionBtn = document.getElementById('startMissionBtn');
    if (startMissionBtn) {
      startMissionBtn.addEventListener('click', () => {
        window.soundEngine.playSuccess();
        this.switchScreen('screen-briefing');
      });
    }

    // End Day Button
    const endDayBtn = document.getElementById('endDayBtn');
    if (endDayBtn) {
      endDayBtn.addEventListener('click', () => {
        this.endDay();
      });
    }

    // Interactive Base Stations clicks
    document.querySelectorAll('.base-station-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const taskId = e.currentTarget.getAttribute('data-task');
        if (taskId) {
          this.miniGames.openTask(taskId);
        }
      });
    });

    // Chat Input send
    const chatInput = document.getElementById('intercomInput');
    const sendBtn = document.getElementById('sendChatBtn');
    if (sendBtn && chatInput) {
      const handleSend = () => {
        const text = chatInput.value.trim();
        if (text) {
          this.sendCrewChat(this.character.name, text, true);
          chatInput.value = '';
          // Trigger simulated AI response after a short delay
          setTimeout(() => this.triggerAiChatResponse(text), 1200);
        }
      };
      sendBtn.addEventListener('click', handleSend);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }

    // Asar Emergency Button
    const asarBtn = document.getElementById('emergencyAsarBtn');
    if (asarBtn) {
      asarBtn.addEventListener('click', () => {
        this.miniGames.openTask('asar_sync');
      });
    }

    // Surface EVA Button
    const evaBtn = document.getElementById('surfaceEvaBtn');
    if (evaBtn) {
      evaBtn.addEventListener('click', () => {
        this.miniGames.openTask('surface_rover');
      });
    }

    // Cook Rations Button
    const cookBtn = document.getElementById('cookRationsBtn');
    if (cookBtn) {
      cookBtn.addEventListener('click', () => {
        this.miniGames.openTask('galley_rations');
      });
    }
  }

  initAudioTriggers() {
    // Add hover sounds to all buttons
    document.querySelectorAll('.btn, .nav-item, .char-select-card, .base-station-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        window.soundEngine.playHover();
      });
    });
  }

  switchScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;

      // Screen-specific updates
      if (screenId === 'screen-character-select') this.renderCharacterSelect();
      if (screenId === 'screen-briefing') this.renderBriefing();
      if (screenId === 'screen-gameplay') this.updateGameplayHud();
      if (screenId === 'screen-map') this.renderTacticalMap();
      if (screenId === 'screen-crew') this.renderCrewDossier();
      if (screenId === 'screen-lobby') this.renderLobby();
      if (screenId === 'screen-menu') window.soundEngine.startAmbientDrone();
    }
  }

  finishBootSequence() {
    const bootLog = document.getElementById('bootTerminalLog');
    if (bootLog) {
      bootLog.innerHTML += `<br><span style="color:#00ff88;">[OK] БОРТОВЫЕ СИСТЕМЫ ТҰЛПАР-01 ОНЛАЙН.</span><br><span style="color:#00f0ff;">[OK] ТЕЛЕМЕТРИЯ БАЙҚОҢЫР ПОДТВЕРЖДЕНА.</span>`;
    }
    setTimeout(() => {
      this.switchScreen('screen-menu');
    }, 800);
  }

  // ==========================================
  // MULTIPLAYER LOBBY SYSTEM (2-6 PLAYERS / AI SIM)
  // ==========================================
  setupLobby() {
    const chars = window.CREW_MEMBERS;
    this.lobbyPlayers = [
      { name: "Сіз (Вы)", char: chars[0], isHost: true, isReady: true, ping: 12 },
      { name: "Almas_Kz", char: chars[1], isHost: false, isReady: true, ping: 24 },
      { name: "Sanzhar_Space", char: chars[2], isHost: false, isReady: false, ping: 38 },
      { name: "Aigerim_Astro", char: chars[3], isHost: false, isReady: true, ping: 19 }
    ];

    const createBtn = document.getElementById('createRoomBtn');
    const joinBtn = document.getElementById('joinRoomBtn');
    const addBotBtn = document.getElementById('addBotBtn');

    if (createBtn) {
      createBtn.onclick = () => {
        window.soundEngine.playClick();
        const codes = ["BAYK-77", "TLPR-13", "QAZAQ-9", "MARS-01", "STEPPE-88"];
        this.lobbyCode = codes[Math.floor(Math.random() * codes.length)];
        this.renderLobby();
      };
    }

    if (joinBtn) {
      joinBtn.onclick = () => {
        const input = document.getElementById('roomCodeInput');
        if (input && input.value.trim()) {
          window.soundEngine.playSuccess();
          this.lobbyCode = input.value.trim().toUpperCase();
          this.renderLobby();
        }
      };
    }

    if (addBotBtn) {
      addBotBtn.onclick = () => {
        if (this.lobbyPlayers.length < 6) {
          window.soundEngine.playClick();
          const nextChar = window.CREW_MEMBERS[this.lobbyPlayers.length];
          this.lobbyPlayers.push({
            name: `AI_${nextChar.name.split(' ')[0]}`,
            char: nextChar,
            isHost: false,
            isReady: true,
            ping: 1
          });
          this.renderLobby();
        } else {
          alert("Лобби заполнено! Максимум 6 игроков.");
        }
      };
    }
  }

  renderLobby() {
    const codeEl = document.getElementById('lobbyCodeDisplay');
    if (codeEl) codeEl.innerText = this.lobbyCode;

    const listEl = document.getElementById('lobbyPlayerList');
    if (!listEl) return;

    listEl.innerHTML = '';
    this.lobbyPlayers.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'lobby-player-slot';
      card.innerHTML = `
        <div class="slot-avatar" style="border-color:${p.char.color}">
          <span style="font-size:24px;">${p.char.avatarIcon}</span>
        </div>
        <div class="slot-info">
          <div class="slot-name">${p.name} ${p.isHost ? '<span class="badge-mini">ХОСТ</span>' : ''}</div>
          <div class="slot-char">${p.char.nameKz} • ${p.char.role}</div>
          <div class="slot-ping">PING: ${p.ping}ms</div>
        </div>
        <div class="slot-status ${p.isReady ? 'ready' : 'waiting'}">
          ${p.isReady ? 'ДАЙЫН (READY)' : 'КҮТУДЕ (WAITING)'}
        </div>
      `;
      listEl.appendChild(card);
    });

    const countEl = document.getElementById('lobbyCountTag');
    if (countEl) countEl.innerText = `ЭКИПАЖ: ${this.lobbyPlayers.length} / 6 ОЙЫНШЫ`;
  }

  // ==========================================
  // CHARACTER SELECTION (6 PROFILES)
  // ==========================================
  renderCharacterSelect() {
    const grid = document.getElementById('characterRosterGrid');
    if (!grid) return;

    grid.innerHTML = '';
    window.CREW_MEMBERS.forEach(c => {
      const card = document.createElement('div');
      card.className = `char-card ${c.id === this.selectedCharacterId ? 'selected' : ''}`;
      card.style.borderColor = c.color;
      card.onclick = () => {
        window.soundEngine.playClick();
        this.selectCharacter(c.id);
      };

      card.innerHTML = `
        <div class="char-card-header">
          <span class="char-badge" style="color:${c.color}">${c.badge}</span>
          <span class="char-age">${c.age} ЖАСТА</span>
        </div>
        <div class="char-avatar-hero">
          <span class="hero-icon">${c.avatarIcon}</span>
          <div class="char-name-kz">${c.nameKz}</div>
          <div class="char-name-en">${c.name}</div>
          <div class="char-role" style="color:${c.color}">${c.role}</div>
        </div>

        <div class="char-snippet">
          <div class="snippet-item">
            <strong>Қабілет:</strong> ${c.ability.name}
          </div>
          <div class="snippet-item">
            <strong>Ерекшелік:</strong> ${c.healthQuirk.title}
          </div>
        </div>

        <div class="char-stats-mini">
          <div class="stat-bar-row">
            <span>Шеберлік:</span>
            <div class="stat-track"><div class="stat-fill" style="width:${c.stats.engineering}%; background:${c.color}"></div></div>
          </div>
          <div class="stat-bar-row">
            <span>Төзімділік:</span>
            <div class="stat-track"><div class="stat-fill" style="width:${c.stats.stamina}%; background:${c.color}"></div></div>
          </div>
        </div>

        <div class="char-select-status">
          ${c.id === this.selectedCharacterId ? '✓ ТАҢДАЛДЫ (ВЫБРАН)' : 'ТАҢДАУ (ВЫБРАТЬ)'}
        </div>
      `;
      grid.appendChild(card);
    });

    this.renderSelectedCharacterDossier();
  }

  selectCharacter(id) {
    this.selectedCharacterId = id;
    this.character = window.CREW_MEMBERS.find(c => c.id === id) || window.CREW_MEMBERS[0];
    this.renderCharacterSelect();
  }

  renderSelectedCharacterDossier() {
    const c = this.character;
    const detailEl = document.getElementById('characterDetailPanel');
    if (!detailEl) return;

    detailEl.innerHTML = `
      <div class="dossier-card" style="border-top: 4px solid ${c.color}">
        <div class="dossier-head">
          <h2 style="color:${c.color}; margin:0;">${c.nameKz} (${c.name})</h2>
          <span class="hud-tag">${c.specialization}</span>
        </div>
        <p class="dossier-bio">${c.bio}</p>

        <div class="dossier-section">
          <h4 style="color:#00f0ff;">УНИКАЛЬНАЯ СПОСОБНОСТЬ: ${c.ability.name}</h4>
          <p class="section-p">${c.ability.desc}</p>
        </div>

        <div class="dossier-section">
          <h4 style="color:#ffd166;">БАЛАНСИРОВАННАЯ ОСОБЕННОСТЬ ЗДОРОВЬЯ: ${c.healthQuirk.title}</h4>
          <ul class="health-quirk-list">
            <li><span style="color:#00ff88;">[ПРЕИМУЩЕСТВО]:</span> ${c.healthQuirk.pro}</li>
            <li><span style="color:#ef4444;">[ОГРАНИЧЕНИЕ]:</span> ${c.healthQuirk.con}</li>
          </ul>
        </div>

        <div class="dossier-quote">
          ${c.quote}
        </div>
      </div>
    `;
  }

  // ==========================================
  // BRIEFING SCREEN & CAMPAIGN LEVEL PROGRESS
  // ==========================================
  renderBriefing() {
    // Determine level from day
    const lvl = window.CAMPAIGN_LEVELS.find(l => l.days.includes(this.day)) || window.CAMPAIGN_LEVELS[0];
    this.currentLevel = lvl.level;

    const titleEl = document.getElementById('briefingTitle');
    const dayTag = document.getElementById('briefingDayTag');
    const locTag = document.getElementById('briefingLocationTag');
    const descEl = document.getElementById('briefingDesc');
    const noteEl = document.getElementById('briefingNote');

    if (titleEl) titleEl.innerText = lvl.titleRu;
    if (dayTag) dayTag.innerText = `КҮН ${this.day} / 30 (ДЕНЬ ${this.day})`;
    if (locTag) locTag.innerText = `ОРНАЛАСҚАН ЖЕРІ: ${lvl.location}`;
    if (descEl) descEl.innerText = lvl.description;
    if (noteEl) noteEl.innerText = `«${lvl.ambianceNote}»`;
  }

  // ==========================================
  // MAIN GAMEPLAY SCREEN & HUD
  // ==========================================
  startDay() {
    this.completedTasksToday = 0;
    this.switchScreen('screen-gameplay');
    this.generateDailyTasks();
    this.updateGameplayHud();

    this.sendCrewChat("СҰҢҚАР-9 (ИИ)", `КҮН ${this.day} БАСТАЛДЫ. Барлық жүйелер тексерілуде. Тапсырмалар таратылды.`, false);

    // Initial greeting from selected character
    setTimeout(() => {
      this.sendCrewChat(this.character.name, `Экипаж, жиналайық! Бүгінгі міндет — базаны тұрақты ұстау. Асарға дайын болыңыздар!`, false);
    }, 1000);
  }

  generateDailyTasks() {
    this.activeTasks = [
      { id: "oxygen_scrubber", name: "Калибровка системы O2 «Сұңқар-Ауа»", station: "Life Support", done: false },
      { id: "power_grid", name: "Шунтирование энергосети реактора", station: "Reactor Hub", done: false },
      { id: "radio_signal", name: "Сканирование спектра и поиск сигналов", station: "Comms Tower", done: false },
      { id: "asar_sync", name: "Командная продувка шлюза «АСАР»", station: "Airlock EVA", done: false }
    ];
    this.renderTaskList();
  }

  renderTaskList() {
    const listEl = document.getElementById('dailyTaskList');
    if (!listEl) return;

    listEl.innerHTML = '';
    this.activeTasks.forEach(task => {
      const item = document.createElement('div');
      item.className = `task-list-item ${task.done ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="task-check">${task.done ? '✓' : '○'}</div>
        <div class="task-info">
          <div class="task-name">${task.name}</div>
          <div class="task-sub">${task.station}</div>
        </div>
        <button class="btn btn-sm ${task.done ? 'btn-ghost' : 'btn-primary'} task-act-btn">
          ${task.done ? 'ОРЫНДАЛДЫ' : 'ОРЫНДАУ'}
        </button>
      `;

      if (!task.done) {
        item.querySelector('.task-act-btn').onclick = () => {
          this.miniGames.openTask(task.id);
        };
      }
      listEl.appendChild(item);
    });
  }

  completeTask(taskId, result) {
    const task = this.activeTasks.find(t => t.id === taskId);
    if (task) {
      task.done = true;
      this.completedTasksToday++;
    }

    // Apply resource changes
    if (result && result.resourceDelta) {
      Object.entries(result.resourceDelta).forEach(([k, v]) => {
        if (this.resources[k] !== undefined) {
          this.resources[k] = Math.max(0, Math.min(100, this.resources[k] + v));
        }
      });
      if (result.resourceDelta.morale) {
        this.teamMorale = Math.max(0, Math.min(100, this.teamMorale + result.resourceDelta.morale));
      }
    }

    this.sendCrewChat("СҰҢҚАР-9 (ИИ)", result.desc || `Тапсырма орындалды: ${task ? task.name : taskId}`, false);
    this.renderTaskList();
    this.updateGameplayHud();

    // Check if all daily tasks finished
    const allDone = this.activeTasks.every(t => t.done);
    if (allDone) {
      this.sendCrewChat("СҰҢҚАР-9", `Бүгінгі барлық негізгі тапсырмалар аяқталды! Күнді аяқтауға (КЕЛЕСІ КҮН) дайынбыз.`, false);
    }
  }

  updateGameplayHud() {
    // Update Day & Location Tag
    const lvl = window.CAMPAIGN_LEVELS.find(l => l.days.includes(this.day)) || window.CAMPAIGN_LEVELS[0];
    const dayLabel = document.getElementById('hudDayCounter');
    const locLabel = document.getElementById('hudLocationLabel');
    if (dayLabel) dayLabel.innerText = `КҮН ${this.day} / 30`;
    if (locLabel) locLabel.innerText = lvl.location;

    // Update Resource Bars
    const resKeys = ['oxygen', 'food', 'water', 'energy', 'fuel', 'materials', 'spareParts'];
    resKeys.forEach(k => {
      const val = this.resources[k];
      const bar = document.getElementById(`resBar_${k}`);
      const valText = document.getElementById(`resVal_${k}`);
      if (bar) bar.style.width = `${val}%`;
      if (valText) valText.innerText = `${Math.round(val)}%`;

      if (bar) {
        bar.className = 'hud-res-fill';
        if (val < 25) bar.classList.add('crit');
        else if (val < 50) bar.classList.add('warn');
      }
    });

    // Update Morale & Base Integrity
    const moraleEl = document.getElementById('hudMoraleVal');
    const baseEl = document.getElementById('hudBaseIntegrityVal');
    if (moraleEl) moraleEl.innerText = `${Math.round(this.teamMorale)}%`;
    if (baseEl) baseEl.innerText = `${Math.round(this.baseIntegrity)}%`;

    // Render Mini Crew Status
    this.renderCrewHudBar();
  }

  renderCrewHudBar() {
    const bar = document.getElementById('crewHudBar');
    if (!bar) return;

    bar.innerHTML = '';
    this.crew.forEach(c => {
      const chip = document.createElement('div');
      chip.className = `crew-chip ${c.id === this.selectedCharacterId ? 'active-player' : ''}`;
      chip.innerHTML = `
        <span class="chip-avatar">${c.avatarIcon}</span>
        <div class="chip-meta">
          <span class="chip-name">${c.nameKz.split(' ')[0]}</span>
          <div class="chip-hp-track">
            <div class="chip-hp-fill" style="width:${c.hp}%; background:${c.color}"></div>
          </div>
        </div>
      `;
      bar.appendChild(chip);
    });
  }

  // ==========================================
  // INTERCOM & SIMULATED AI CREW CHAT
  // ==========================================
  sendCrewChat(sender, text, isPlayer = false) {
    const log = document.getElementById('intercomChatLog');
    if (!log) return;

    const row = document.createElement('div');
    row.className = `chat-msg ${isPlayer ? 'player-msg' : 'crew-msg'}`;
    row.innerHTML = `
      <span class="chat-time">${new Date().toLocaleTimeString().slice(0, 5)}</span>
      <strong class="chat-sender">${sender}:</strong>
      <span class="chat-text">${text}</span>
    `;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  triggerAiChatResponse(playerText) {
    const otherCrew = this.crew.filter(c => c.id !== this.selectedCharacterId);
    const speaker = otherCrew[Math.floor(Math.random() * otherCrew.length)];

    const lower = playerText.toLowerCase();
    let reply = `«Қабылданды. Жүйелерді тексеріп жатырмын.»`;

    if (lower.includes("асар") || lower.includes("помощь") || lower.includes("көмек")) {
      reply = `«Асар — біздің күшіміз! Бірге кез келген апатты жеңеміз!»`;
      window.soundEngine.playAsarSync();
    } else if (lower.includes("құрт") || lower.includes("еда") || lower.includes("паек") || lower.includes("тамақ")) {
      reply = `«Құрт пен Қазыны үнемдеңіздер, Марста одан артық қуат беретін ештеңе жоқ!»`;
    } else if (lower.includes("қонақ") || lower.includes("әже") || lower.includes("сигнал") || lower.includes("страх")) {
      reply = `«Сенсорлар тағы да қызық тербеліс көрсетіп тұр... Бірақ біз қорықпаймыз. Біз Байқоңырданбыз!»`;
      window.soundEngine.playAnomalyWhisper();
    } else {
      const stock = [
        `«Түсіндім, мен өз секторымды бақылауда ұстап отырмын.»`,
        `«Қысым қалыпты. Тек сыртқы сенсорлар салқын тартады.»`,
        `«Бүгінгі күнді де абыроймен аяқтаймыз, алаңдамаңыз!»`,
        `«Радиотолқында тыныштық орнады. Бұл жақсы белгі.»`
      ];
      reply = stock[Math.floor(Math.random() * stock.length)];
    }

    this.sendCrewChat(speaker.nameKz, reply, false);
  }

  // ==========================================
  // END DAY & DAILY REPORT / VOTING SYSTEM
  // ==========================================
  endDay() {
    window.soundEngine.playClick();

    // Natural daily consumption
    this.resources.oxygen = Math.max(0, this.resources.oxygen - 12);
    this.resources.food = Math.max(0, this.resources.food - 10);
    this.resources.water = Math.max(0, this.resources.water - 10);
    this.resources.energy = Math.max(0, this.resources.energy - 14);

    // Check game over
    if (this.resources.oxygen <= 0 || this.resources.energy <= 0 || this.resources.food <= 0) {
      this.triggerEnding('failure');
      return;
    }

    // Check if reached Day 30 finale
    if (this.day >= this.maxDays) {
      if (this.secretEggProgress >= 3) {
        this.triggerEnding('secret');
      } else if (this.resources.oxygen > 35 && this.baseIntegrity > 50) {
        this.triggerEnding('success');
      } else {
        this.triggerEnding('partial');
      }
      return;
    }

    // Open Daily Report & Team Voting Modal
    this.openDailyReportModal();
  }

  openDailyReportModal() {
    const modal = document.getElementById('daily-report-modal');
    const content = document.getElementById('dailyReportContent');
    if (!modal || !content) return;

    modal.classList.remove('hidden');

    // Find daily dilemma if exists
    const dilemma = window.DAILY_EVENTS.find(e => e.day === this.day) || {
      day: this.day,
      title: `КҮНДЕГІ СИТУАЦИЯ (ДЕНЬ ${this.day}): Штатный мониторинг`,
      desc: "Существенных аномалий не обнаружено. Команда завершила плановый цикл работ.",
      options: [
        { text: "Направить резерв энергии на стабилизацию теплиц (+10 Еда)", gain: { food: 10 }, cost: { energy: 5 } },
        { text: "Провести полную диагностику купола (+10 Целостность)", gain: { materials: 10 }, cost: { stamina: 10 } }
      ]
    };

    content.innerHTML = `
      <div class="report-box">
        <div class="report-header">
          <span class="hud-tag">ТҰЛПАР-01 / OUTPOST 13 ДНЕВНОЙ РАПОРТ</span>
          <h2>ДЕНЬ ${this.day} ЗАВЕРШЕН</h2>
        </div>

        <div class="report-summary-grid">
          <div class="summary-col">
            <h4>БАЛАНС РЕСУРСОВ:</h4>
            <ul>
              <li>Кислород: <strong>${Math.round(this.resources.oxygen)}%</strong></li>
              <li>Энергия: <strong>${Math.round(this.resources.energy)}%</strong></li>
              <li>Провизия (в т.ч. Қазы/Құрт): <strong>${Math.round(this.resources.food)}%</strong></li>
              <li>Вода: <strong>${Math.round(this.resources.water)}%</strong></li>
            </ul>
          </div>
          <div class="summary-col">
            <h4>СТАТУС МИССИИ:</h4>
            <ul>
              <li>Целостность базы: <strong>${Math.round(this.baseIntegrity)}%</strong></li>
              <li>Боевой дух экипажа: <strong>${Math.round(this.teamMorale)}%</strong></li>
              <li>Сакральный прогресс («АПА»): <strong>${this.secretEggProgress} / 3</strong></li>
            </ul>
          </div>
        </div>

        <div class="dilemma-card">
          <div class="dilemma-badge">ДАУЫС БЕРУ (КОМАНДНОЕ ГОЛОСОВАНИЕ ЭКИПАЖА)</div>
          <h3 class="dilemma-title">${dilemma.title}</h3>
          <p class="dilemma-desc">${dilemma.desc}</p>

          <div class="dilemma-options">
            ${dilemma.options.map((opt, i) => `
              <div class="dilemma-opt-card" data-opt="${i}">
                <div class="opt-text">${opt.text}</div>
                <button class="btn btn-sm btn-primary vote-btn" data-opt="${i}">ГОЛОСОВАТЬ</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    content.querySelectorAll('.vote-btn').forEach(btn => {
      btn.onclick = (e) => {
        const optIdx = parseInt(e.currentTarget.getAttribute('data-opt'), 10);
        const chosen = dilemma.options[optIdx];

        window.soundEngine.playSuccess();
        if (chosen.gain) {
          Object.entries(chosen.gain).forEach(([k, v]) => {
            if (this.resources[k] !== undefined) this.resources[k] = Math.min(100, this.resources[k] + v);
          });
          if (chosen.gain.secretEggProgress) this.secretEggProgress += chosen.gain.secretEggProgress;
        }

        modal.classList.add('hidden');
        this.day++;
        this.switchScreen('screen-briefing');
      };
    });
  }

  // ==========================================
  // TACTICAL MAP & SCHEMATICS
  // ==========================================
  renderTacticalMap() {
    const container = document.getElementById('tacticalMapWrapper');
    if (!container) return;

    const isMarsBase = this.day >= 16;
    container.innerHTML = `
      <div class="tactical-hud-header">
        <div class="hud-tag">${isMarsBase ? 'МАРСИАНСКАЯ БАЗА OUTPOST 13' : 'ИССЛЕДОВАТЕЛЬСКИЙ СУДНО TULPAR-01'}</div>
        <h3>ИНТЕРАКТИВНАЯ ТАКТИЧЕСКАЯ СХЕМА МОДУЛЕЙ</h3>
      </div>

      <div class="schematic-layout ${isMarsBase ? 'base-layout' : 'ship-layout'}">
        <div class="module-box mod-bridge" onclick="window.game.miniGames.openTask('radio_signal')">
          <span class="mod-icon">🛰️</span>
          <div class="mod-label">КОМАНДНЫЙ МОСТИК / СВЯЗЬ</div>
          <span class="mod-status ok">СТАТУС: ОНЛАЙН</span>
        </div>

        <div class="module-box mod-reactor" onclick="window.game.miniGames.openTask('power_grid')">
          <span class="mod-icon">⚡</span>
          <div class="mod-label">ТЕРМОЯДЕРНЫЙ РЕАКТОР</div>
          <span class="mod-status ok">ТОК: СТАБИЛЕН</span>
        </div>

        <div class="module-box mod-life" onclick="window.game.miniGames.openTask('oxygen_scrubber')">
          <span class="mod-icon">🌱</span>
          <div class="mod-label">СИСТЕМА ЖИЗНЕОБЕСПЕЧЕНИЯ O2</div>
          <span class="mod-status ${this.resources.oxygen < 40 ? 'warn' : 'ok'}">O2: ${Math.round(this.resources.oxygen)}%</span>
        </div>

        <div class="module-box mod-galley" onclick="window.game.miniGames.openTask('galley_rations')">
          <span class="mod-icon">🥩</span>
          <div class="mod-label">КАЮТ-КОМПАНИЯ / ПАЙКИ (ҚАЗЫ/ҚҰРТ)</div>
          <span class="mod-status ok">ДАСТАРХАН: ТОЛЫ</span>
        </div>

        <div class="module-box mod-airlock" onclick="window.game.miniGames.openTask('asar_sync')">
          <span class="mod-icon">🚪</span>
          <div class="mod-label">ШЛЮЗОВОЙ ОТСЕК «АСАР»</div>
          <span class="mod-status ok">ШЛЮЗ ГЕРМЕТИЧЕН</span>
        </div>

        <div class="module-box mod-rover" onclick="window.game.miniGames.openTask('surface_rover')">
          <span class="mod-icon">🚜</span>
          <div class="mod-label">РОТОРНЫЙ АНПОСТ / СЕНСОРЫ МАРСА</div>
          <span class="mod-status ok">РАДАР: АКТИВЕН</span>
        </div>
      </div>

      <div class="map-controls-row">
        <button class="btn btn-primary" onclick="window.game.switchScreen('screen-gameplay')">ОРАЛУ (ВЕРНУТЬСЯ НА ПОСТ)</button>
      </div>
    `;
  }

  // ==========================================
  // CREW DOSSIER VIEW
  // ==========================================
  renderCrewDossier() {
    const list = document.getElementById('crewFullDossierList');
    if (!list) return;

    list.innerHTML = '';
    this.crew.forEach(c => {
      const card = document.createElement('div');
      card.className = 'crew-dossier-full-card';
      card.style.borderLeft = `5px solid ${c.color}`;
      card.innerHTML = `
        <div class="dossier-row">
          <span class="dossier-avatar">${c.avatarIcon}</span>
          <div class="dossier-main-info">
            <h3 style="color:${c.color}; margin:0;">${c.nameKz} (${c.name})</h3>
            <div class="dossier-sub">${c.role} • ${c.age} жаста • ${c.specialization}</div>
          </div>
          <div class="dossier-vitals">
            <span class="hud-tag" style="color:#00ff88;">HP: ${c.hp}%</span>
            <span class="hud-tag" style="color:#00f0ff;">ДУХ: ${c.sanity}%</span>
          </div>
        </div>

        <p class="dossier-p">${c.bio}</p>

        <div class="dossier-specs-grid">
          <div class="spec-col">
            <strong>Способность:</strong> ${c.ability.name}<br>
            <small>${c.ability.desc}</small>
          </div>
          <div class="spec-col">
            <strong>Здоровье:</strong> ${c.healthQuirk.title}<br>
            <small style="color:#00ff88;">+ ${c.healthQuirk.pro}</small><br>
            <small style="color:#ef4444;">- ${c.healthQuirk.con}</small>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // ==========================================
  // ENDING TRIGGER
  // ==========================================
  triggerEnding(type) {
    const ending = window.ENDINGS[type] || window.ENDINGS.success;
    this.switchScreen('screen-ending');

    if (type === 'secret') {
      window.soundEngine.playSteppeMelody();
    } else if (type === 'success') {
      window.soundEngine.playSuccess();
    } else {
      window.soundEngine.playError();
    }

    const titleEl = document.getElementById('endingTitle');
    const badgeEl = document.getElementById('endingBadge');
    const descEl = document.getElementById('endingDesc');
    const statsEl = document.getElementById('endingStats');

    if (titleEl) {
      titleEl.innerText = ending.titleRu;
      titleEl.style.color = ending.color;
    }
    if (badgeEl) {
      badgeEl.innerText = ending.badge;
      badgeEl.style.borderColor = ending.color;
    }
    if (descEl) descEl.innerText = ending.desc;
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="end-stat-col">Дней прожито: <strong>${this.day} / 30</strong></div>
        <div class="end-stat-col">Кислород: <strong>${Math.round(this.resources.oxygen)}%</strong></div>
        <div class="end-stat-col">Энергия: <strong>${Math.round(this.resources.energy)}%</strong></div>
        <div class="end-stat-col">Мораль экипажа: <strong>${Math.round(this.teamMorale)}%</strong></div>
        <div class="end-stat-col">Сакральные пасхалки: <strong>${this.secretEggProgress} / 3</strong></div>
      `;
    }
  }

  restartGame() {
    window.soundEngine.playClick();
    this.day = 1;
    this.currentLevel = 1;
    this.resources = {
      oxygen: 85,
      food: 90,
      water: 80,
      energy: 95,
      fuel: 75,
      materials: 60,
      spareParts: 50
    };
    this.baseIntegrity = 100;
    this.teamMorale = 90;
    this.secretEggProgress = 0;
    this.switchScreen('screen-menu');
  }
}

// Global Game Instance
window.addEventListener('DOMContentLoaded', () => {
  window.game = new OutpostGame();
  window.game.init();
});
