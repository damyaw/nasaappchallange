// OUTPOST 13: QAZAQ SPACE PROGRAM - CAMPAIGN DATA & SYSTEMS (ENGLISH)
// 30 Days, 6 Levels + Finale, Kazakh Traditions (Asar), Rations, Lore & Endings

const CAMPAIGN_LEVELS = [
  {
    level: 1,
    titleEn: "Level 1: Baikonur — Launch & Orbital Insertion",
    titleKz: "1-деңгей: Байқоңыр — Ұшу және Орбита",
    days: [1, 2, 3, 4, 5],
    location: "Launch Complex No. 1 ('Gagarin's Start') / Low Earth Orbit",
    locationType: "baikonur",
    description: "Final countdown of the next-generation 'Sungqar-X' heavy launch vehicle and orbital rendezvous with research cruiser TULPAR-01. Checking life-support scrubs, stowing vacuum-cured Kazakh rations, and aligning deep-space navigational gyroscopes.",
    ambianceNote: "The sharp scent of steppe wormwood before ignition, the roar of methane-oxygen booster turbines, and the quiet resolve of the crew."
  },
  {
    level: 2,
    titleEn: "Level 2: TULPAR-01 — Deep Space Transit",
    titleKz: "2-деңгей: Тұлпар-01 — Терең Ғарыш",
    days: [6, 7, 8, 9, 10],
    location: "Interplanetary Void (Earth-Mars Transfer Orbit)",
    locationType: "ship",
    description: "TULPAR-01 accelerates to cruising velocity. Earth recedes into a pale turquoise speck. Shipboard neural AI 'SUNGQAR-9' registers micrometeorite impacts and an anomalous harmonic static echo oscillating at exactly 13.13 kHz.",
    ambianceNote: "The steady hum of the ion reactor, zero-gravity water droplets, and phantom thuds reverberating through the ventilation ducts."
  },
  {
    level: 3,
    titleEn: "Level 3: Mars Orbit & Atmospheric Descent",
    titleKz: "3-деңгей: Марс Орбитасы және Қону",
    days: [11, 12, 13, 14, 15],
    location: "Martian Upper Atmosphere / Acidalia Planitia",
    locationType: "mars_entry",
    description: "Retro-thruster burn and fiery entry through Mars' thin carbon dioxide atmosphere. Heat shields glow incandescent orange. Manual control of the lander module amidst dust devil shears, touching down near an ancient basalt rift.",
    ambianceNote: "Raging plasma fire outside the viewports, 4G deceleration forces, and the crunch of landing struts settling into crimson regolith."
  },
  {
    level: 4,
    titleEn: "Level 4: Outpost 13 — Base Activation",
    titleKz: "4-деңгей: 13-Форпост: Базаны Іске Қосу",
    days: [16, 17, 18, 19, 20],
    location: "Primary Dome of OUTPOST 13 (Martian Surface)",
    locationType: "base",
    description: "Deployment of pressurized inflatable domes, drilling geothermal heat conduits, and seeding micro-algae hydroponic biomes. The crew unpacks national space reserves. Routine science begins, but ground seismographs record strange rhythmic tremors.",
    ambianceNote: "The shriek of Martian gales battering the outer poly-skin, warm LED glow in the mess hall, and the comforting aroma of hot tea and fresh qurt."
  },
  {
    level: 5,
    titleEn: "Level 5: QONAQ — The Unseen Presence",
    titleKz: "5-деңгей: ҚОНАҚ — Белгісіз Сектор",
    days: [21, 22, 23, 24, 25],
    location: "Sector 'Anomaly-13' & Base Perimeter",
    locationType: "anomaly",
    description: "Station energy accumulators experience unexplained spontaneous power drains. Exterior surveillance cameras catch fleeting silhouettes drifting in the dust. Airlocks develop crystalline frost patterns shaped like ancient petroglyphs. The crew names the visitor 'QONAQ' (The Guest).",
    ambianceNote: "Flickering emergency red luminescence, sudden icy drafts through pressurized corridors, and the unmistakable sensation of eyes watching from the dark."
  },
  {
    level: 6,
    titleEn: "Level 6: The Voice of Äzhe — The Great Trial",
    titleKz: "6-деңгей: ӘЖЕ Даусы — Ұлы Сынақ",
    days: [26, 27, 28, 29],
    location: "Deep Subterranean Borehole & Comms Array",
    locationType: "voice",
    description: "The centennial dust tempest 'Qara Dauyl' strikes Outpost 13. Earth comms are completely severed. Through the howling static of the intercom comes a faint, maternal voice — 'ÄZHE' (The Grandmother). She sings an ancient steppe lullaby and warns of what sleeps below.",
    ambianceNote: "Heavy sand grains hammering the reinforced canopy, crackling radio static, and vivid crew dreams of endless green Kazakhstan pastures."
  },
  {
    level: 7,
    titleEn: "Finale: Day 30 — The Awakening of ZHALMAUYZ",
    titleKz: "Финал: ЖАЛМАУЫЗ — Тұңғиықпен Кездесу",
    days: [30],
    location: "Subterranean Cavern 'Tunghiyq' beneath Outpost 13",
    locationType: "finale",
    description: "The ancient entity 'ZHALMAUYZ' (The Devourer of Energy) stirs beneath the tectonic crust. Electromagnetic collapse threatens life support. The crew must unite under the ancient principle of ASAR, balance science with courage, or trigger an ancestral protocol of salvation.",
    ambianceNote: "Deep crustal resonance, ionized cobalt-blue glow, and the decisive crossroads for the future of Kazakhstan's space program."
  }
];

const KAZAKH_RATIONS = [
  {
    id: "qazy",
    name: "Qazy (Space Ration)",
    nameRu: "Qazy Vacuum-Cured",
    icon: "🥩",
    desc: "Traditional nutrient-dense vacuum-cured horsemeat delicacy prepared for zero-g consumption. Extreme caloric density, essential for demanding heavy physical repair shifts.",
    bonus: { stamina: 35, food: 30, morale: 20 },
    lore: "«Horsemeat sustained our nomadic forebears through brutal winters; out here, it powers cosmonauts through deep space.»"
  },
  {
    id: "qurt",
    name: "Qurt (Bio-Radiation Shielding)",
    nameRu: "Calcium-Enriched Qurt",
    icon: "⚪",
    desc: "Sun-dried cultured dairy spheres enriched with calcium nanoparticles and anti-radiation compounds. Counteracts bone mineral loss and cosmic radiation exposure under Martian gravity.",
    bonus: { health: 25, radiationProt: 30, food: 15 },
    lore: "«Centuries-old nomadic preservation wisdom re-engineered to protect humanity from cosmic rays.»"
  },
  {
    id: "qymyz",
    name: "Qymyz (Bio-Ferment)",
    nameRu: "Sublimated Qymyz",
    icon: "🥛",
    desc: "Bio-fermented mare's milk micro-algae culture stored in pressurized nutrient bulbs. A potent adaptogen and probiotic that calms neurological stress, balances gut flora, and restores morale.",
    bonus: { water: 25, morale: 30, health: 15 },
    lore: "«He who drinks Qymyz breathes deep and keeps an expansive spirit in the loneliest void.»"
  },
  {
    id: "bauyrsaq",
    name: "Bauyrsaq (Zero-G Puffs)",
    nameRu: "Zero-G Puffed Bread",
    icon: "🥖",
    desc: "Golden-brown puffed dough spheres baked using a crumb-free space pastry formula. Instantly evokes memories of family dastarkhans, hospitality, and home warmth.",
    bonus: { food: 20, morale: 25 },
    lore: "«The aroma of fresh bauyrsaq brings safety, blessings, and solidarity to the whole team.»"
  },
  {
    id: "beshbarmaq",
    name: "Beshbarmaq (Ceremonial Feast Pack)",
    nameRu: "Grand Feast Beshbarmaq",
    icon: "🍲",
    desc: "Ceremonial freeze-dried feast ration featuring tender meat, hand-rolled pasta ribbons, and savory sorpa broth. Opened only during major milestones to cement crew solidarity.",
    bonus: { stamina: 40, food: 40, morale: 50, allCrewBuff: true },
    lore: "«A crew that shares a dastarkhan from one platter can never be broken apart.»"
  }
];

// Daily dilemmas & crises with team voting
const DAILY_EVENTS = [
  {
    day: 2,
    title: "Baikonur Telemetry: High-Gain Antenna Drift",
    desc: "Following booster separation, orbital sensors detect excessive vibration on TULPAR-01's deep-space communications dish.",
    options: [
      {
        text: "Conduct an emergency EVA spacewalk to manually bolt the bracket (Risky, but guarantees full signal)",
        cost: { oxygen: 5, stamina: 15 },
        gain: { morale: 10, materials: 5 },
        favoredBy: ["alina", "arman"]
      },
      {
        text: "Switch to secondary low-power helical antenna array (Conserves suit reserves, but drains power)",
        cost: { energy: 10 },
        gain: {},
        favoredBy: ["dias", "timur"]
      }
    ]
  },
  {
    day: 7,
    title: "Anomalous Harmonic Echo at 13.13 kHz",
    desc: "The shipboard receiver isolates a mysterious two-tone harmonic frequency, reminiscent of a two-stringed dombyra resonating through the silent vacuum.",
    options: [
      {
        text: "Dedicate computing neural cores to decrypt the wave spectrum (Unlocks crucial mystery clue)",
        cost: { energy: 15 },
        gain: { secretClue: 1, morale: 10 },
        favoredBy: ["timur", "dana"]
      },
      {
        text: "Filter out the frequency to avoid distracting the navigational pilot",
        cost: {},
        gain: { energy: 5 },
        favoredBy: ["aisha", "dias"]
      }
    ]
  },
  {
    day: 12,
    title: "Electrostatic Dust Vortex in Landing Corridor",
    desc: "As the lander pierces the clouds over Acidalia Planitia, radar spots an intense electrostatic dust devil dancing over the primary LZ.",
    options: [
      {
        text: "Authorise Commander Aisha for manual aerodynamic thruster descent right into the canyon",
        cost: { fuel: 15 },
        gain: { materials: 20, morale: 15 },
        favoredBy: ["aisha", "alina"]
      },
      {
        text: "Divert to secondary flat wasteland coordinates (Safe, but far from mineral veins)",
        cost: { fuel: 10, spareParts: 5 },
        gain: {},
        favoredBy: ["arman", "dias"]
      }
    ]
  },
  {
    day: 18,
    title: "The Principle of «ASAR»: Geothermal Generator Erection",
    desc: "To guarantee stable winter heating for Outpost 13, the heavy titanium heat pipes must be positioned and welded before nightfall.",
    options: [
      {
        text: "Declare ASAR! Entire crew mobilizes for synchronized collective construction",
        cost: { stamina: 25, water: 10 },
        gain: { energy: 35, morale: 25, asarBonus: true },
        favoredBy: ["aisha", "arman", "dana", "alina", "timur", "dias"]
      },
      {
        text: "Assign the heavy lifting strictly to Dias' automated drones (Conserves crew stamina, slower)",
        cost: { spareParts: 15, energy: 20 },
        gain: { energy: 20 },
        favoredBy: ["dias"]
      }
    ]
  },
  {
    day: 23,
    title: "The Visit of «QONAQ» in Hydroponics Bay",
    desc: "Greenhouse lights suddenly cut out. Temperature plummets to -15°C. Etched into the frosted viewing pane is a glowing petroglyph of a sacred horned ram.",
    options: [
      {
        text: "Place a fresh bowl of Qurt on the console and lower weapons (Traditional Steppe Hospitality)",
        cost: { food: 5 },
        gain: { secretEggProgress: 1, morale: 20 },
        favoredBy: ["dana", "timur"]
      },
      {
        text: "Discharge ultrasonic sonic repellant pulses and seal emergency blast bulkheads",
        cost: { energy: 20, spareParts: 10 },
        gain: { security: 10 },
        favoredBy: ["arman", "aisha"]
      }
    ]
  },
  {
    day: 27,
    title: "Whispers in the Comms: «ÄZHE» Sings a Lullaby",
    desc: "In the fury of the century's worst dust storm, Outpost 13 plunges into amber twilight. Through the radio comes a tender voice singing an ancient Kazakh lullaby.",
    options: [
      {
        text: "Listen in reverence and respond through the main transmitter in Kazakh",
        cost: { energy: 10 },
        gain: { sanity: 30, secretEggProgress: 1 },
        favoredBy: ["dana", "timur", "aisha"]
      },
      {
        text: "Cut shipboard intercom audio and order crew to don acoustic noise-cancelling helmets",
        cost: { morale: -15 },
        gain: { stability: 10 },
        favoredBy: ["dias", "arman"]
      }
    ]
  }
];

// Endings Data (English)
const ENDINGS = {
  success: {
    id: "steppe_of_mars",
    titleEn: "«STEPPE OF MARS» (Ұлы Дала) — Complete Mission Triumph",
    titleKz: "«ҰЛЫ ДАЛА» — Толық Жеңіс",
    badge: "GOLD_MISSION_AWARD",
    color: "#00ff88",
    imageTheme: "triumph",
    desc: "Kazakhstan's space program has achieved an epochal milestone! OUTPOST 13 is fully self-sustaining, hydroponics yield bountiful harvest, and the Martian anomalies were unraveled through scientific ingenuity and unyielding brotherhood. Baikonur celebrates a historic national triumph as the crew plants the flag on the red soil!",
    statsRequired: "Resources > 35%, Base Integrity > 75%, all crew survived."
  },
  partial: {
    id: "cold_beacon",
    titleEn: "«COLD BEACON» (Суық Маяк) — Pyrrhic Victory",
    titleKz: "«СУЫҚ МАЯК» — Қиын Құтқарылу",
    badge: "SILVER_MISSION_AWARD",
    color: "#ffaa00",
    imageTheme: "survival",
    desc: "OUTPOST 13 survived, but at severe cost... The primary ion engines of TULPAR-01 were dismantled for spare coils to maintain life-support heat. Supplies are dangerously rationed. The crew has transmitted an emergency SOS to Baikonur and now stands vigilant guard awaiting a relief mission.",
    statsRequired: "Resources depleted, but base integrity sustained."
  },
  failure: {
    id: "red_silence",
    titleEn: "«RED SILENCE» (Қызыл Үнсіздік) — Mission Lost",
    titleKz: "«ҚЫЗЫЛ ҮНСІЗДІК» — Жүйе Сөнді",
    badge: "BLACK_MISSION_AWARD",
    color: "#ef4444",
    imageTheme: "tragedy",
    desc: "On the 30th day, radio telemetry from OUTPOST 13 ceased permanently. The fusion core froze over and Martian blizzards engulfed the silent domes. Baikonur Mission Control lowers flags across Kazakhstan to honor the brave martyrs who ventured into the red unknown.",
    statsRequired: "One or more critical life support resources fell to zero."
  },
  secret: {
    id: "apa_zhiberdi",
    titleEn: "«APA ZHIBERDI» (Апа Жіберді) — Ancestral Transcendence",
    titleKz: "«АПА ЖІБЕРДІ» — Сакральная Концовка",
    badge: "ANCESTRAL_BLESSING_AWARD",
    color: "#00f0ff",
    imageTheme: "transcendence",
    desc: "You have performed the unthinkable. By offering the guest «QONAQ» sacred qurt, tuning to «ÄZHE» at 13.13 kHz, and embracing the ancient custom of ASAR, the truth is revealed: the ancient Martian entity was not a monster, but a guardian ancestral spirit watching over the children of the steppe across millions of miles of cold space! As a radiant golden aurora wraps around Outpost 13, a gentle maternal voice smiles through the comms: «APA ZHIBERDI, BOTAM. NOW THE BASE IS SAFE.» The reactor charges to 1,000%, and your crew ascends to cosmic legend!",
    statsRequired: "Special Quest: Qurt for Qonaq + Frequency 13.13 kHz + Asar Unity."
  }
};

window.CAMPAIGN_LEVELS = CAMPAIGN_LEVELS;
window.KAZAKH_RATIONS = KAZAKH_RATIONS;
window.DAILY_EVENTS = DAILY_EVENTS;
window.ENDINGS = ENDINGS;
