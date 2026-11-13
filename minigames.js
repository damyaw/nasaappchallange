// OUTPOST 13: QAZAQ SPACE PROGRAM - INTERACTIVE MINI-GAMES ENGINE
// 6 Fully Playable Sci-Fi Engineering, Science & Cultural Tasks

class MiniGameManager {
  constructor(game) {
    this.game = game;
    this.currentTask = null;
    this.activeInterval = null;
  }

  closeModal() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.add('hidden');
    this.currentTask = null;
  }

  openTask(taskId) {
    window.soundEngine.playClick();
    this.currentTask = taskId;
    const modal = document.getElementById('task-modal');
    const container = document.getElementById('task-content');
    if (!modal || !container) return;

    modal.classList.remove('hidden');
    container.innerHTML = '';

    switch (taskId) {
      case 'oxygen_scrubber':
        this.renderOxygenScrubber(container);
        break;
      case 'power_grid':
        this.renderPowerGrid(container);
        break;
      case 'radio_signal':
        this.renderRadioSignal(container);
        break;
      case 'asar_sync':
        this.renderAsarSync(container);
        break;
      case 'surface_rover':
        this.renderSurfaceRover(container);
        break;
      case 'galley_rations':
        this.renderGalleyRations(container);
        break;
      default:
        container.innerHTML = `<p class="text-hazard">Белгісіз тапсырма / Неизвестная задача</p>`;
    }
  }

  // ==========================================
  // MINI-GAME 1: OXYGEN SCRUBBER CALIBRATION
  // ==========================================
  renderOxygenScrubber(container) {
    container.innerHTML = `
      <div class="task-header">
        <div class="task-title-badge">ИНЖЕНЕРИЯ ЖӘНЕ ТЫНЫС АЛУ ЖҮЙЕСІ</div>
        <h2 class="task-title">Регенерация отсека O2 «Сұңқар-Ауа»</h2>
        <p class="task-desc">Выровняйте частоту, фазу и амплитуду очистителя кислорода с эталонной синусоидой реактора. Достигните 95%+ синхронизации.</p>
      </div>

      <div class="oscilloscope-wrapper">
        <canvas id="scopeCanvas" width="620" height="220" class="hud-canvas"></canvas>
        <div class="scope-overlay">
          <span class="hud-tag">TARGET WAVE: 440 Hz</span>
          <span id="syncRateDisplay" class="hud-sync-tag">СИНХРОНИЗАЦИЯ: 0%</span>
        </div>
      </div>

      <div class="controls-grid">
        <div class="control-group">
          <label>Жиілік (Частота): <span id="freqVal">300</span> Hz</label>
          <input type="range" id="freqSlider" min="200" max="600" value="300" class="sci-slider">
        </div>
        <div class="control-group">
          <label>Фазалық ығысу (Фаза): <span id="phaseVal">0</span>°</label>
          <input type="range" id="phaseSlider" min="0" max="360" value="0" class="sci-slider">
        </div>
        <div class="control-group">
          <label>Амплитуда (Күш): <span id="ampVal">40</span>%</label>
          <input type="range" id="ampSlider" min="10" max="100" value="40" class="sci-slider">
        </div>
      </div>

      <div class="task-actions">
        <button id="calibrateBtn" class="btn btn-primary">БЕКІТУ (КАЛИБРОВАТЬ)</button>
        <button id="cancelTaskBtn" class="btn btn-ghost">ЖАБУ (ОТМЕНА)</button>
      </div>
    `;

    const canvas = document.getElementById('scopeCanvas');
    const ctx = canvas.getContext('2d');
    const freqSlider = document.getElementById('freqSlider');
    const phaseSlider = document.getElementById('phaseSlider');
    const ampSlider = document.getElementById('ampSlider');
    const syncDisplay = document.getElementById('syncRateDisplay');
    const calibrateBtn = document.getElementById('calibrateBtn');
    const cancelBtn = document.getElementById('cancelTaskBtn');

    cancelBtn.onclick = () => this.closeModal();

    let targetFreq = 440;
    let targetPhase = 180;
    let targetAmp = 75;

    let time = 0;
    const draw = () => {
      if (!document.getElementById('scopeCanvas')) return;
      time += 0.05;
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const curFreq = parseFloat(freqSlider.value);
      const curPhase = parseFloat(phaseSlider.value);
      const curAmp = parseFloat(ampSlider.value);

      document.getElementById('freqVal').innerText = Math.round(curFreq);
      document.getElementById('phaseVal').innerText = Math.round(curPhase);
      document.getElementById('ampVal').innerText = Math.round(curAmp);

      // Target Sine Wave (Dotted Gold)
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const rad = (x * (targetFreq / 8000) * Math.PI * 2) + (targetPhase * Math.PI / 180) + time;
        const y = (canvas.height / 2) + Math.sin(rad) * (targetAmp * 0.9);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Player Wave (Solid Cyan)
      ctx.setLineDash([]);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const rad = (x * (curFreq / 8000) * Math.PI * 2) + (curPhase * Math.PI / 180) + time;
        const y = (canvas.height / 2) + Math.sin(rad) * (curAmp * 0.9);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Calculate accuracy
      const freqDiff = Math.abs(curFreq - targetFreq) / 400;
      const phaseDiff = Math.abs(curPhase - targetPhase) / 360;
      const ampDiff = Math.abs(curAmp - targetAmp) / 90;
      const error = (freqDiff * 0.5) + (phaseDiff * 0.3) + (ampDiff * 0.2);
      const accuracy = Math.max(0, Math.min(100, Math.round((1 - error) * 100)));

      syncDisplay.innerText = `СИНХРОНИЗАЦИЯ: ${accuracy}%`;
      syncDisplay.style.color = accuracy >= 90 ? '#00ff88' : (accuracy >= 70 ? '#ffd166' : '#ef4444');

      this.currentAccuracy = accuracy;
      requestAnimationFrame(draw);
    };

    draw();

    calibrateBtn.onclick = () => {
      if (this.currentAccuracy >= 88) {
        window.soundEngine.playSuccess();
        this.game.completeTask('oxygen_scrubber', {
          resourceDelta: { oxygen: +25, energy: -5 },
          desc: "Система O2 очищена! Уровень кислорода восстановлен (+25 O2)."
        });
        this.closeModal();
      } else {
        window.soundEngine.playError();
        alert(`Синхронизация недостаточна (${this.currentAccuracy}%). Требуется минимум 88%!`);
      }
    };
  }

  // ==========================================
  // MINI-GAME 2: POWER GRID CIRCUIT REROUTE
  // ==========================================
  renderPowerGrid(container) {
    container.innerHTML = `
      <div class="task-header">
        <div class="task-title-badge">ИНЖЕНЕРИЯ / ЭНЕРГОСЕТЬ «БАЙҚОҢЫР-ТОК»</div>
        <h2 class="task-title">Шунтирование распределительного щита</h2>
        <p class="task-desc">Соедините главную шину термоядерного реактора со всеми 4 жизненно важными терминалами станции. Нажимайте на узлы, чтобы вращать их проводники.</p>
      </div>

      <div class="circuit-board" id="circuitGrid"></div>

      <div class="task-status-row">
        <div id="circuitPowerStatus" class="hud-tag">ТОК В ЦЕПИ: 0 / 4 ПОДКЛЮЧЕНО</div>
      </div>

      <div class="task-actions">
        <button id="testCircuitBtn" class="btn btn-primary">ТЕСТ ТОКА (ПУСК)</button>
        <button id="cancelTaskBtn" class="btn btn-ghost">ЖАБУ (ОТМЕНА)</button>
      </div>
    `;

    const cancelBtn = document.getElementById('cancelTaskBtn');
    cancelBtn.onclick = () => this.closeModal();

    const gridEl = document.getElementById('circuitGrid');
    const nodes = [
      { id: 0, type: 'source', rot: 0, connected: true, label: "REACTOR" },
      { id: 1, type: 'corner', rot: 90, connected: false },
      { id: 2, type: 'straight', rot: 0, connected: false },
      { id: 3, type: 'term', rot: 180, connected: false, label: "LIFE_SUP" },
      { id: 4, type: 'tee', rot: 0, connected: false },
      { id: 5, type: 'cross', rot: 0, connected: false },
      { id: 6, type: 'corner', rot: 270, connected: false },
      { id: 7, type: 'term', rot: 90, connected: false, label: "COMMS" },
      { id: 8, type: 'straight', rot: 90, connected: false },
      { id: 9, type: 'corner', rot: 180, connected: false },
      { id: 10, type: 'tee', rot: 90, connected: false },
      { id: 11, type: 'term', rot: 0, connected: false, label: "AIRLOCK" },
      { id: 12, type: 'straight', rot: 0, connected: false },
      { id: 13, type: 'corner', rot: 0, connected: false },
      { id: 14, type: 'straight', rot: 90, connected: false },
      { id: 15, type: 'term', rot: 270, connected: false, label: "HYDRO" }
    ];

    let solvedCount = 0;

    const renderNodes = () => {
      gridEl.innerHTML = '';
      nodes.forEach((node, index) => {
        const div = document.createElement('div');
        div.className = `circuit-cell ${node.type} ${node.connected ? 'powered' : ''}`;
        div.style.transform = `rotate(${node.rot}deg)`;

        let icon = '╋';
        if (node.type === 'source') icon = '⚡ ЯДРО';
        else if (node.type === 'term') icon = `🔌 ${node.label}`;
        else if (node.type === 'straight') icon = '┃';
        else if (node.type === 'corner') icon = '┗';
        else if (node.type === 'tee') icon = '┣';

        div.innerHTML = `<span class="cell-icon">${icon}</span>`;

        if (node.type !== 'source') {
          div.onclick = () => {
            window.soundEngine.playClick();
            node.rot = (node.rot + 90) % 360;
            // Check connections simply
            if (Math.random() > 0.4 || node.rot % 180 === 0) {
              node.connected = true;
            }
            evaluateCircuit();
            renderNodes();
          };
        }
        gridEl.appendChild(div);
      });
    };

    const evaluateCircuit = () => {
      // Count connected terminals
      const terms = nodes.filter(n => n.type === 'term');
      solvedCount = terms.filter(t => t.connected || Math.random() > 0.5).length;
      const status = document.getElementById('circuitPowerStatus');
      if (status) {
        status.innerText = `ТОК В ЦЕПИ: ${solvedCount} / 4 ПОДКЛЮЧЕНО`;
        status.style.color = solvedCount >= 3 ? '#00ff88' : '#ffd166';
      }
    };

    renderNodes();

    document.getElementById('testCircuitBtn').onclick = () => {
      if (solvedCount >= 3) {
        window.soundEngine.playSuccess();
        this.game.completeTask('power_grid', {
          resourceDelta: { energy: +30, spareParts: -5 },
          desc: "Энергосеть стабилизирована! Мощность реактора направлена на купол (+30 Энергии)."
        });
        this.closeModal();
      } else {
        window.soundEngine.playError();
        alert("Короткое замыкание! Поверните узлы так, чтобы запитать терминалы!");
      }
    };
  }

  // ==========================================
  // MINI-GAME 3: RADIO SIGNAL & TELEMETRY DECODER
  // ==========================================
  renderRadioSignal(container) {
    container.innerHTML = `
      <div class="task-header">
        <div class="task-title-badge">РАДИОАСТРОНОМИЯ / «АЛТЫН ТАҢДАУ» СЕНСОРЛАРЫ</div>
        <h2 class="task-title">Дешифровка глубокого марсианского спектра</h2>
        <p class="task-desc">Управляйте частотным ползунком для обнаружения скрытого сигнала. Найдите пик резонанса на мистической частоте 13.13 кГц («ӘЖЕ») или 42.8 МГц («Байконур»).</p>
      </div>

      <div class="radio-tuner-box">
        <div class="signal-visualizer">
          <canvas id="radioCanvas" width="600" height="150" class="hud-canvas"></canvas>
          <div class="frequency-indicator" id="freqReadout">13.13 kHz</div>
        </div>

        <div class="tuner-controls">
          <input type="range" id="radioSlider" min="1000" max="5000" value="1313" class="sci-slider">
          <div class="slider-marks">
            <span>10.0 kHz</span>
            <span style="color:#ffd166;">★ 13.13 kHz (ӘЖЕ)</span>
            <span>25.0 kHz</span>
            <span style="color:#00f0ff;">▲ 42.8 MHz (БАЙҚОҢЫР)</span>
            <span>50.0 kHz</span>
          </div>
        </div>

        <div class="transcript-box" id="radioTranscript">
          <div class="transcript-title">БОРТОВОЙ ЖУРНАЛ ДЕШИФРАТОРА:</div>
          <div class="transcript-body" id="transcriptText">... [СТАТИЧЕСКИЙ ШУМ ВАКУУМА] ...</div>
        </div>
      </div>

      <div class="task-actions">
        <button id="lockSignalBtn" class="btn btn-primary">СИГНАЛДЫ БЕКІТУ (ЗАХВАТ)</button>
        <button id="cancelTaskBtn" class="btn btn-ghost">ЖАБУ (ОТМЕНА)</button>
      </div>
    `;

    const cancelBtn = document.getElementById('cancelTaskBtn');
    cancelBtn.onclick = () => this.closeModal();

    const canvas = document.getElementById('radioCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('radioSlider');
    const readout = document.getElementById('freqReadout');
    const transcript = document.getElementById('transcriptText');

    let isSecretFound = false;
    let isBaikonurFound = false;

    slider.oninput = () => {
      const val = parseFloat(slider.value);
      const khz = (val / 100).toFixed(2);
      readout.innerText = `${khz} kHz`;

      if (Math.abs(val - 1313) < 40) {
        // Mysterious Azhe frequency!
        isSecretFound = true;
        isBaikonurFound = false;
        window.soundEngine.playAnomalyWhisper();
        transcript.innerHTML = `<span style="color:#00f0ff;">«...Балаларым... Құм астында мың жыл ұйықтадым... Даланың самалы мұнда да жетеді... Біз сендермен біргеміз...»</span> [ГОЛОС ӘЖЕ / ЧАСТОТА 13.13 кГц РАСШИФРОВАНА]`;
      } else if (Math.abs(val - 4280) < 60) {
        // Baikonur frequency
        isBaikonurFound = true;
        isSecretFound = false;
        window.soundEngine.playRadioStatic(0.5);
        transcript.innerHTML = `<span style="color:#00ff88;">«Байқоңыр Орталығы: "Тұлпар-01", сіздердің телеметрияңыз қабылданды. Барлық жүйе штаттық режимде. Сәттілік, қырандар!»</span> [ЦУП БАЙКОНУР]`;
      } else {
        isSecretFound = false;
        isBaikonurFound = false;
        transcript.innerHTML = `... [ШУМ: cos(ωt) + ШЫҢҒЫРҒАН ЖЕЛДІҢ ДАУСЫ] ...`;
      }
    };

    let t = 0;
    const animRadio = () => {
      if (!document.getElementById('radioCanvas')) return;
      t += 0.1;
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = isSecretFound ? '#00f0ff' : (isBaikonurFound ? '#00ff88' : '#475569');
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 3) {
        const noise = (Math.random() - 0.5) * (isSecretFound || isBaikonurFound ? 10 : 40);
        const sig = (isSecretFound || isBaikonurFound) ? Math.sin((x * 0.05) + t) * 35 : 0;
        const y = (canvas.height / 2) + sig + noise;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      requestAnimationFrame(animRadio);
    };
    animRadio();

    document.getElementById('lockSignalBtn').onclick = () => {
      if (isSecretFound) {
        window.soundEngine.playSuccess();
        this.game.secretEggProgress++;
        this.game.completeTask('radio_signal', {
          resourceDelta: { morale: +35, energy: -5 },
          desc: "Сакральный голос «ӘЖЕ» расшифрован! Мораль экипажа взлетела (+35 Мораль, раскрыта древняя тайна!)."
        });
        this.closeModal();
      } else if (isBaikonurFound) {
        window.soundEngine.playSuccess();
        this.game.completeTask('radio_signal', {
          resourceDelta: { morale: +20, materials: +10 },
          desc: "Канал с Байконуром восстановлен! Получены пакеты обновлений прошивки (+20 Мораль, +10 Материалы)."
        });
        this.closeModal();
      } else {
        window.soundEngine.playError();
        alert("Точная частота не захвачена! Подстройте бегунок к 13.13 кГц или 42.8 МГц.");
      }
    };
  }

  // ==========================================
  // MINI-GAME 4: «АСАР» COOPERATIVE PRESSURE EQUALIZER
  // ==========================================
  renderAsarSync(container) {
    const aiTeammate = this.game.crew.find(c => c.id !== this.game.selectedCharacterId) || window.CREW_MEMBERS[1];

    container.innerHTML = `
      <div class="task-header">
        <div class="task-title-badge">ҚАЗАҚ ДӘСТҮРІ / КОМАНДАЛЫҚ «АСАР» МЕХАНИКАСЫ</div>
        <h2 class="task-title">Синхронная продувка атмосферного шлюза</h2>
        <p class="task-desc">Традиция Асар: совместный труд для спасения общего дома. Удерживайте клапан в зелёной зоне точно в унисон с вашим напарником <strong>${aiTeammate.name}</strong>!</p>
      </div>

      <div class="asar-arena">
        <div class="crew-sync-col">
          <div class="crew-hud-label">СІЗ (ВЫ): ${this.game.character.name}</div>
          <div class="valve-gauge">
            <div class="gauge-target-zone"></div>
            <div id="playerValveNeedle" class="gauge-needle"></div>
          </div>
          <button id="pressValveBtn" class="btn btn-primary valve-btn">КЛАПАНДЫ БАСЫП ТҰРУ (ДЕРЖАТЬ)</button>
        </div>

        <div class="sync-center-display">
          <div class="asar-emblem">🤝</div>
          <div id="asarCountdown" class="countdown-large">ДАЙЫНДЫҚ...</div>
          <div id="asarProgress" class="asar-progress-text">СИНХРОН: 0%</div>
        </div>

        <div class="crew-sync-col">
          <div class="crew-hud-label">НАПАРНИК: ${aiTeammate.name}</div>
          <div class="valve-gauge">
            <div class="gauge-target-zone"></div>
            <div id="teammateValveNeedle" class="gauge-needle" style="top: 45%;"></div>
          </div>
          <div class="teammate-status-box" id="teammateStatus">«Дайынмын! 3-ке дейін санағанда бірге басамыз!»</div>
        </div>
      </div>

      <div class="task-actions">
        <button id="cancelTaskBtn" class="btn btn-ghost">ЖАБУ (ОТМЕНА)</button>
      </div>
    `;

    const cancelBtn = document.getElementById('cancelTaskBtn');
    cancelBtn.onclick = () => this.closeModal();

    const playerNeedle = document.getElementById('playerValveNeedle');
    const teammateNeedle = document.getElementById('teammateValveNeedle');
    const pressBtn = document.getElementById('pressValveBtn');
    const countdownEl = document.getElementById('asarCountdown');
    const progressEl = document.getElementById('asarProgress');

    let playerPressed = false;
    let teammateTarget = 45;
    let syncPercent = 0;

    pressBtn.onmousedown = () => { playerPressed = true; window.soundEngine.playHover(); };
    pressBtn.onmouseup = () => { playerPressed = false; };
    pressBtn.ontouchstart = () => { playerPressed = true; };
    pressBtn.ontouchend = () => { playerPressed = false; };

    let count = 3;
    const countTimer = setInterval(() => {
      if (count > 0) {
        countdownEl.innerText = `${count}...`;
        window.soundEngine.playClick();
        count--;
      } else {
        countdownEl.innerText = "БАС! (СИНХРОН!)";
        countdownEl.style.color = "#00ff88";
        window.soundEngine.playAsarSync();
        clearInterval(countTimer);
        startAsarLoop();
      }
    }, 800);

    const startAsarLoop = () => {
      let playerPos = 80;
      this.activeInterval = setInterval(() => {
        if (playerPressed) {
          playerPos = Math.max(10, playerPos - 3.5);
        } else {
          playerPos = Math.min(85, playerPos + 2.5);
        }
        playerNeedle.style.top = `${playerPos}%`;

        // Teammate oscillates around 40-50%
        teammateTarget = 42 + Math.sin(Date.now() / 300) * 8;
        teammateNeedle.style.top = `${teammateTarget}%`;

        // Check if both in green zone (30% to 55%)
        const playerInZone = playerPos >= 30 && playerPos <= 58;
        const teammateInZone = teammateTarget >= 30 && teammateTarget <= 58;

        if (playerInZone && teammateInZone) {
          syncPercent += 3;
          progressEl.style.color = '#00ff88';
        } else {
          syncPercent = Math.max(0, syncPercent - 1);
          progressEl.style.color = '#ffd166';
        }

        progressEl.innerText = `СИНХРОН: ${Math.min(100, Math.round(syncPercent))}%`;

        if (syncPercent >= 100) {
          clearInterval(this.activeInterval);
          window.soundEngine.playSuccess();
          this.game.completeTask('asar_sync', {
            resourceDelta: { oxygen: +20, morale: +30, materials: +15 },
            desc: "АСАР сработал безупречно! Шлюз продут совместными усилиями экипажа (+20 O2, +30 Мораль, +15 Материалы)!"
          });
          this.closeModal();
        }
      }, 50);
    };
  }

  // ==========================================
  // MINI-GAME 5: MARTIAN SURFACE ROVER & EVA PROBE
  // ==========================================
  renderSurfaceRover(container) {
    container.innerHTML = `
      <div class="task-header">
        <div class="task-title-badge">МАРС БЕТІ / «АҚ СҰҢҚАР-РОVER» БАРЛАУ</div>
        <h2 class="task-title">Разведка поверхности и сбор марсианских минералов</h2>
        <p class="task-desc">Управляйте лучами георадара на равнине Ацидалия. Кликайте на сигнатуры минералов (Материалы, Водный лёд, Артефакты). Остерегайтесь провалов грунта!</p>
      </div>

      <div class="rover-radar-display">
        <canvas id="radarCanvas" width="600" height="260" class="hud-canvas"></canvas>
        <div class="rover-stats-hud">
          <span id="roverO2Tag">СКАНЕР ЗАРЯДЫ: 100%</span>
          <span id="collectedMinTag" style="color:#00ff88;">ЖИНАЛҒАН: 0/4 КРИСТАЛЛ</span>
        </div>
      </div>

      <div class="task-actions">
        <button id="finishEvaBtn" class="btn btn-primary">МАТЕРИАЛДАРДЫ БАЗАҒА ТАСУ</button>
        <button id="cancelTaskBtn" class="btn btn-ghost">ЖАБУ (ОТМЕНА)</button>
      </div>
    `;

    const cancelBtn = document.getElementById('cancelTaskBtn');
    cancelBtn.onclick = () => this.closeModal();

    const canvas = document.getElementById('radarCanvas');
    const ctx = canvas.getContext('2d');
    const finishBtn = document.getElementById('finishEvaBtn');

    let energy = 100;
    let collected = 0;
    const items = [
      { x: 120, y: 80, type: 'mineral', collected: false, name: "Изотоп Fe-56" },
      { x: 450, y: 60, type: 'ice', collected: false, name: "Су мұзы (Лед)" },
      { x: 300, y: 180, type: 'petroglyph', collected: false, name: "Тас жазуы (Петроглиф)" },
      { x: 500, y: 200, type: 'mineral', collected: false, name: "Титановый базальт" },
      { x: 220, y: 130, type: 'hazard', name: "Тұңғиық (Провал)" }
    ];

    let radarAngle = 0;

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      items.forEach(it => {
        if (it.collected) return;
        const dist = Math.hypot(it.x - clickX, it.y - clickY);
        if (dist < 26) {
          if (it.type === 'hazard') {
            window.soundEngine.playError();
            energy -= 25;
            alert("Внимание! Обвал марсианской породы! Потеряна энергия зонда (-25%).");
          } else {
            it.collected = true;
            collected++;
            window.soundEngine.playClick();
            document.getElementById('collectedMinTag').innerText = `ЖИНАЛҒАН: ${collected}/4 ОБЪЕКТ`;
            if (it.type === 'petroglyph') {
              this.game.secretEggProgress++;
              alert("Найдена древняя плита с гравировкой орнамента Қошқар Мүйіз! Зафиксировано биополе.");
            }
          }
        }
      });
    };

    const drawRadar = () => {
      if (!document.getElementById('radarCanvas')) return;
      radarAngle += 0.03;
      ctx.fillStyle = '#0a0505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mars red topographic rings
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1;
      for (let r = 40; r < 300; r += 50) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sweeping beam
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(radarAngle) * 350, cy + Math.sin(radarAngle) * 350);
      ctx.stroke();

      // Render items
      items.forEach(it => {
        if (it.collected) return;
        ctx.beginPath();
        ctx.arc(it.x, it.y, 14, 0, Math.PI * 2);

        if (it.type === 'hazard') {
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '10px sans-serif';
          ctx.fillText("⚠️", it.x - 7, it.y + 4);
        } else {
          ctx.fillStyle = it.type === 'ice' ? '#00f0ff' : (it.type === 'petroglyph' ? '#ffd166' : '#00ff88');
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = '10px monospace';
          ctx.fillText(it.type === 'ice' ? 'H2O' : (it.type === 'petroglyph' ? '★' : 'Fe'), it.x - 8, it.y + 4);
        }
      });

      requestAnimationFrame(drawRadar);
    };

    drawRadar();

    finishBtn.onclick = () => {
      if (collected >= 2) {
        window.soundEngine.playSuccess();
        this.game.completeTask('surface_rover', {
          resourceDelta: { materials: +35, water: +20, fuel: -5 },
          desc: `Экспедиция завершена! Собрано ${collected} марсианских образца (+35 Материалы, +20 Вода).`
        });
        this.closeModal();
      } else {
        window.soundEngine.playError();
        alert("Соберите минимум 2 образца минералов, чтобы оправдать выход на поверхность!");
      }
    };
  }

  // ==========================================
  // MINI-GAME 6: KAZAKH GALLEY & BIO-SYNTHESIS
  // ==========================================
  renderGalleyRations(container) {
    container.innerHTML = `
      <div class="task-header">
        <div class="task-title-badge">АСХАНА ЖӘНЕ БИО-СИНТЕЗ / ҚАЗАҚ ҰЛТТЫҚ ҒАРЫШ ПАЕКТЕРІ</div>
        <h2 class="task-title">Приготовление традиционных космических пайков</h2>
        <p class="task-desc">Используйте биореакторы Даны для синтеза питательных блюд Казахстана. Распределите пайки среди экипажа для поднятия боевого духа и сил.</p>
      </div>

      <div class="rations-synthesis-grid">
        ${window.KAZAKH_RATIONS.map(r => `
          <div class="ration-card">
            <div class="ration-icon">${r.icon}</div>
            <div class="ration-info">
              <h3 class="ration-name">${r.name}</h3>
              <p class="ration-desc">${r.desc}</p>
              <div class="ration-bonus">
                ${Object.entries(r.bonus).map(([k, v]) => `<span class="badge-mini">+${v} ${k.toUpperCase()}</span>`).join(' ')}
              </div>
              <div class="ration-lore">${r.lore}</div>
            </div>
            <button class="btn btn-sm btn-primary cook-btn" data-id="${r.id}">СИНТЕЗДЕУ</button>
          </div>
        `).join('')}
      </div>

      <div class="task-actions">
        <button id="cancelTaskBtn" class="btn btn-ghost">ЖАБУ (ОТМЕНА)</button>
      </div>
    `;

    const cancelBtn = document.getElementById('cancelTaskBtn');
    cancelBtn.onclick = () => this.closeModal();

    const buttons = container.querySelectorAll('.cook-btn');
    buttons.forEach(btn => {
      btn.onclick = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const ration = window.KAZAKH_RATIONS.find(r => r.id === id);
        if (!ration) return;

        window.soundEngine.playSuccess();
        window.soundEngine.playSteppeMelody();

        const bonuses = { food: +30, morale: +25, water: +15 };
        if (id === 'qurt') bonuses.health = +25;
        if (id === 'beshbarmaq') {
          bonuses.morale = +50;
          bonuses.stamina = +40;
        }

        this.game.completeTask('galley_rations', {
          resourceDelta: bonuses,
          desc: `Приготовлен «${ration.name}»! Экипаж отведал родной кухни: силы и дух команды восстановлены (+30 Еда, +25 Мораль)!`
        });
        this.closeModal();
      };
    });
  }
}

window.MiniGameManager = MiniGameManager;
