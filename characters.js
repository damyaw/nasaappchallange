// OUTPOST 13: QAZAQ SPACE PROGRAM - CHARACTER ROSTER
// 6 Distinct Crew Members with Balanced Specializations & Health Quirks (English)

const CREW_MEMBERS = [
  {
    id: "aisha",
    name: "Aisha Tolegen",
    nameKz: "Айша Төлеген",
    age: 34,
    role: "Commander / Chief Pilot",
    roleKz: "Командир / Пилот",
    specialization: "Piloting & Expedition Command",
    color: "#00f0ff", // Cyan
    avatarIcon: "👩‍🚀",
    badge: "EXPEDITION LEAD",
    bio: "Kazakhstan Air Force veteran and veteran of Baikonur orbital launches. Possesses iron discipline, calm analytical judgment, and an instinct for trajectory dynamics. Ready to lay down her life to bring every crew member safely home.",
    personality: "Stoic, decisive, measured, deeply protective of her crew.",
    ability: {
      name: "Iron Will (Темір Ерік)",
      desc: "Increases all crew task completion speed by +25% during critical alarms and suppresses team panic by 30%."
    },
    skill: {
      name: "Atmospheric Navigation Burn",
      desc: "Saves 20% Fuel during orbital maneuvers and stabilizes descent profiles in Martian dust storms."
    },
    healthQuirk: {
      title: "Barotrauma Tympanic Sensitivity",
      pro: "Detects the slightest micro-drops in cabin atmospheric pressure (+20% early leak warning).",
      con: "Suffers 10 seconds of radio audio distortion during rapid emergency depressurization.",
      balanced: true
    },
    stats: {
      leadership: 95,
      engineering: 70,
      science: 65,
      stamina: 85,
      morale: 90
    },
    quote: "«Baikonur placed its trust in us. Tulpar will conquer Mars, and we will return home together.»"
  },
  {
    id: "arman",
    name: "Arman Suleimen",
    nameKz: "Арман Сүлеймен",
    age: 41,
    role: "Chief Systems Engineer",
    roleKz: "Бас Инженер",
    specialization: "Power Systems & Reactor Diagnostics",
    color: "#ffaa00", // Amber
    avatarIcon: "👨‍🔧",
    badge: "SYSTEMS CHIEF",
    bio: "Renowned mechanical engineer from Almaty. Spent a decade retrofitting Baikonur's historic launchpads for next-generation ion drives. Knows every conduit, relay, and valve aboard TULPAR-01 better than the ship's neural AI.",
    personality: "Pragmatic, dry-witted optimist, trusts physical wrenches and clean turbines over abstract theories.",
    ability: {
      name: "Master Hand (Шебер Қол)",
      desc: "Reduces Spare Parts consumption by 50% during critical repairs and instantly shunts overloaded power lines."
    },
    skill: {
      name: "Emergency Cold-Start",
      desc: "Can jumpstart an auxiliary power module from zero charge in emergency blackout conditions."
    },
    healthQuirk: {
      title: "Chronic Lumbar Strain (Servo-Exosuit)",
      pro: "Wears an integrated spine servo-stabilizer — complete immunity to heavy tool recoil and reactor vibration.",
      con: "Moves 10% slower across the Martian surface when wearing a full pressurized EVA suit.",
      balanced: true
    },
    stats: {
      leadership: 65,
      engineering: 98,
      science: 75,
      stamina: 75,
      morale: 80
    },
    quote: "«Theory is nice, but out here on Mars, a torque wrench and a steady solder will save your life.»"
  },
  {
    id: "dana",
    name: "Dana Nurbek",
    nameKz: "Дана Нұрбек",
    age: 29,
    role: "Chief Medical Officer & Astrobiologist",
    roleKz: "Бас Дәрігер / Биолог",
    specialization: "Extremophile Biology & Space Medicine",
    color: "#00ff88", // Emerald
    avatarIcon: "👩‍⚕️",
    badge: "BIO-RESEARCH",
    bio: "Honors graduate of Nazarbayev University and leading extremophile researcher on radiation-resistant microorganisms. Engineered the formula for radiation-shielding Space Qurt and regenerative biological rations aboard TULPAR-01.",
    personality: "Empathetic, acutely observant, emotionally perceptive, fiercely attentive to crew mental sanity.",
    ability: {
      name: "The Healer (Шипагер)",
      desc: "Synthesizes biochemical recovery rations from Qurt and Qymyz, restoring +35% Health and curing Martian depression."
    },
    skill: {
      name: "Phyto-Hydroponics",
      desc: "Boosts greenhouse yield by +40% while consuming minimal water reserves."
    },
    healthQuirk: {
      title: "Hypoglycemic Metabolic Sensitivity",
      pro: "Possesses hyper-acute olfactory intuition — discovers biological anomalies 30% faster.",
      con: "Requires strict adherence to meal schedules; suffers mild dizziness if Food falls below 20%.",
      balanced: true
    },
    stats: {
      leadership: 70,
      engineering: 60,
      science: 96,
      stamina: 70,
      morale: 95
    },
    quote: "«The human body may seem fragile in the void, but the resilience of our ancestors runs in our veins.»"
  },
  {
    id: "timur",
    name: "Timur Akhmet",
    nameKz: "Тимур Ахмет",
    age: 36,
    role: "Astrophysicist & Comms Officer",
    roleKz: "Астрофизик / Радиобайланыс",
    specialization: "Signal Intelligence, Sensors & Cryptography",
    color: "#a855f7", // Violet
    avatarIcon: "👨‍🔬",
    badge: "SIGNAL INTEL",
    bio: "Radio astronomer from the Assy-Turgen Observatory in the Almaty highlands. The first scientist to isolate the anomalous low-frequency harmonic resonance from Mars' Acidalia crater, which triggered the OUTPOST 13 mission.",
    personality: "Reflective, philosophical thinker, passionate about nomadic epics and quantum wave mechanics.",
    ability: {
      name: "Stargazer (Жұлдызшы)",
      desc: "Decrypts scrambled radio telemetry, filters out «QONAQ» audio jamming, and forecasts Martian sandstorms 24 hours in advance."
    },
    skill: {
      name: "Spectral Orbital Survey",
      desc: "Uncovers hidden subterranean isotope coordinates on the surface map."
    },
    healthQuirk: {
      title: "Photophobia / Polarized Visor Dependence",
      pro: "Uses custom sensor visors: can detect cloaked anomalous movements in total station blackouts.",
      con: "Takes 5 seconds to recalibrate optical sensors when exposed to sudden solar flares or flash-bangs.",
      balanced: true
    },
    stats: {
      leadership: 60,
      engineering: 80,
      science: 95,
      stamina: 68,
      morale: 75
    },
    quote: "«Space is never silent. If you calibrate your receiver to the right frequency, it whispers everything.»"
  },
  {
    id: "alina",
    name: "Alina Serik",
    nameKz: "Алина Серік",
    age: 27,
    role: "Field Geologist & EVA Specialist",
    roleKz: "Геолог / EVA Экспедитор",
    specialization: "Planetary Drilling & Extreme Surface EVA",
    color: "#ef4444", // Red/Coral
    avatarIcon: "🧗‍♀️",
    badge: "SURFACE DRILLER",
    bio: "High-altitude mountaineer from the Khan Tengri peaks turned planetary exploration specialist. Fearless in the face of sub-zero temperatures, gravity rifts, and treacherous Martian basalt sinkholes.",
    personality: "Energetic, daring, competitive, thrives on high-risk surface expeditions and adrenaline.",
    ability: {
      name: "Steppe Pathfinder (Дала Саяхатшысы)",
      desc: "Extracts +50% Materials during Martian surface EVA sorties and expends 30% less suit Oxygen."
    },
    skill: {
      name: "Seismic Acoustic Scan",
      desc: "Pinpoints underground geothermal pockets and hollow cavities before crust collapse occurs."
    },
    healthQuirk: {
      title: "Alpine Frostbite Nerve Remnant",
      pro: "Completely immune to panic in sub-zero Martian storms; calculates thermal dissipation instinctively.",
      con: "Handling micro-switches in frozen airlocks requires intense focus (+10% puzzle time on frozen circuits).",
      balanced: true
    },
    stats: {
      leadership: 75,
      engineering: 70,
      science: 85,
      stamina: 95,
      morale: 88
    },
    quote: "«The storms of Khan Tengri were harsher than these red plains. We will conquer Mars step by step!»"
  },
  {
    id: "dias",
    name: "Dias Bekov",
    nameKz: "Диас Беков",
    age: 32,
    role: "Cybernetics & Logistics Officer",
    roleKz: "Кибернетик / Логист",
    specialization: "AI Systems, Automation & Resource Matrix",
    color: "#3b82f6", // Royal Blue
    avatarIcon: "🧑‍💻",
    badge: "CYBERNETICS",
    bio: "Software prodigy and neural architecture engineer from Karaganda. Authored the core operating code of shipboard AI «SUNGQAR-9», which coordinates TULPAR-01's life-support and Outpost 13's grid.",
    personality: "Methodical, mildly sarcastic, ultra-organized, believes every single gram of water must be accounted for.",
    ability: {
      name: "Digital Nomad (Цифрлық Көшпенді)",
      desc: "Reroutes auxiliary power buses with zero line loss and automatically resolves 1 routine maintenance task each day."
    },
    skill: {
      name: "Algorithmic Conservation",
      desc: "Cuts passive base Energy and Water consumption rates by 20%."
    },
    healthQuirk: {
      title: "Circadian Rhythm Phase Drift (Insomnia)",
      pro: "Always on night watch with sharp alertness — zero probability of sleeping through night hull breaches.",
      con: "Requires elevated hydration (+10% Water consumption) to sustain peak cognitive bandwidth.",
      balanced: true
    },
    stats: {
      leadership: 65,
      engineering: 90,
      science: 85,
      stamina: 80,
      morale: 78
    },
    quote: "«Code does not lie. The only failures in space are humans who refuse to respect system limits.»"
  }
];

window.CREW_MEMBERS = CREW_MEMBERS;
