export const INITIAL_PROJECT = {
  id: "proj_blockbuster_01",
  title: "ECHOES OF TOMORROW",
  director: "Denis Villeneuve",
  leadEditor: "Joe Walker, ACE",
  frameRate: "24.00 fps",
  aspectRatio: "2.39:1 Anamorphic",
  scenes: [
    {
      id: "sc_1",
      act: "Act I",
      sceneNumber: "1",
      slugline: "EXT. DESERT LAUNCHPAD - DUSK",
      pages: 1.5,
      runtimeEst: "1m 30s",
      characters: ["KAI", "COMMANDER VANCE"],
      emotionalBeat: "Suspense / Wonder",
      scriptSnippet: "The rocket silhouette towers against a blood-orange horizon. Cryogenic vapor vents into the cold desert air. KAI grips his mission telemetry tablet.",
      picture: { status: "LOCKED", note: "Pacing locked with Director on 10/12." },
      sound: { status: "FINAL_MIX", note: "Low sub-harmonic engine hum & atmospheric wind." },
      vfx: { status: "APPROVED", shotsCount: 4, shotsApproved: 4, note: "Vapor simulations & launch gantry extensions complete." },
      color: { status: "APPROVED", lut: "KODAK_5219_FilmPrint_v4", note: "Deep shadows, warm tungsten flares." },
      mastering: { status: "PASSED", qcNotes: "Complies with DCI specifications." }
    },
    {
      id: "sc_2",
      act: "Act I",
      sceneNumber: "2",
      slugline: "INT. COMMAND CONTROL BUNKER - NIGHT",
      pages: 2.25,
      runtimeEst: "2m 15s",
      characters: ["COMMANDER VANCE", "DR. ARLO"],
      emotionalBeat: "Rising Tension / Countdown",
      scriptSnippet: "A hundred CRT monitors flicker. Red emergency sirens illuminate sweat on Vance's forehead. 'Abort sequence is offline!'",
      picture: { status: "FINE_CUT", note: "Trimming 8 frames between monitor cutaways." },
      sound: { status: "DESIGN", note: "Telemetry beeps, vintage relay clicks, warning siren." },
      vfx: { status: "IN_PROGRESS", shotsCount: 3, shotsApproved: 2, note: "Flickering CRT scanlines & graphics." },
      color: { status: "IN_GRADE", lut: "Teal_Orange_FilmStock", note: "Balancing green phosphor glow." },
      mastering: { status: "PENDING", qcNotes: "" }
    },
    {
      id: "sc_3",
      act: "Act IIA",
      sceneNumber: "3",
      slugline: "EXT. STRATOSPHERE - NIGHT (INTERIOR COCKPIT)",
      pages: 3.5,
      runtimeEst: "3m 30s",
      characters: ["KAI", "MISSION AI"],
      emotionalBeat: "Visceral Action & Isolation",
      scriptSnippet: "Violent G-force shaking. The horizon curves below as the booster separates in explosive pyrotechnic silence.",
      picture: { status: "ROUGH_CUT", note: "Comparing take 3 wide angle vs cockpit macro." },
      sound: { status: "SPOTTING", note: "Silence drop at staging separation moment." },
      vfx: { status: "IN_PROGRESS", shotsCount: 16, shotsApproved: 8, note: "Full orbital earth render & debris physics." },
      color: { status: "PENDING_LOCK", lut: "HighOrbit_DeepBlue", note: "Awaiting picture lock." },
      mastering: { status: "PENDING", qcNotes: "" }
    },
    {
      id: "sc_4",
      act: "Act IIB",
      sceneNumber: "4",
      slugline: "INT. ORBITAL STATION CORRIDOR - ZERO-G",
      pages: 2.0,
      runtimeEst: "2m 00s",
      characters: ["KAI", "DR. ARLO"],
      emotionalBeat: "Mystery / Discovery",
      scriptSnippet: "Debris floats silently. A frozen glove rotates in midair. KAI shines his tactical light into the breached airlock.",
      picture: { status: "ASSEMBLY", note: "Syncing wire-removal stunt footage." },
      sound: { status: "NOT_STARTED", note: "Internal helmet breathing & heartbeat design." },
      vfx: { status: "PLATES_PULLED", shotsCount: 6, shotsApproved: 1, note: "Floating debris CG compositing." },
      color: { status: "PENDING_LOCK", lut: "SciFi_FluorescentWhite", note: "Awaiting picture lock." },
      mastering: { status: "PENDING", qcNotes: "" }
    },
    {
      id: "sc_5",
      act: "Act III",
      sceneNumber: "5",
      slugline: "EXT. RE-ENTRY CAPSULE - SUNRISE",
      pages: 4.25,
      runtimeEst: "4m 15s",
      characters: ["KAI", "COMMANDER VANCE"],
      emotionalBeat: "Climax & Catharsis",
      scriptSnippet: "Heat shield ignites plasma fire. Parachutes deploy against golden cloud banks as the ocean surges beneath.",
      picture: { status: "ROUGH_CUT", note: "Pacing re-entry shake cadence." },
      sound: { status: "NOT_STARTED", note: "Orchestral brass crescendo & parachute sonic thud." },
      vfx: { status: "IN_PROGRESS", shotsCount: 12, shotsApproved: 3, note: "Atmospheric plasma flame dynamics." },
      color: { status: "PENDING_LOCK", lut: "Sunrise_WarmGolden", note: "Awaiting picture lock." },
      mastering: { status: "PENDING", qcNotes: "" }
    }
  ]
};

export const SCRIPT_PRESETS = [
  {
    id: "heist",
    name: "The Vault Protocol (Heist Thriller)",
    title: "THE VAULT PROTOCOL",
    director: "Christopher Nolan",
    leadEditor: "Lee Smith, ACE",
    text: `TITLE: THE VAULT PROTOCOL
DIRECTOR: Christopher Nolan
LEAD EDITOR: Lee Smith, ACE

=== ACT I ===

EXT. ZURICH FINANCIAL DISTRICT - NIGHT

Heavy snow falls across neoclassical bank facades. A black sedan idles by the curb.

MARCUS (40s, master safe-cracker) adjusts his thermal scanner goggles.

MARCUS
Lasers recalibrate every forty-five seconds. When the grid drops, we have ninety seconds before backup generators engage.

INT. UNDERGROUND LASER CORRIDOR - NIGHT

ELENA (30s, acrobat) drops silently from the air duct, dangling two inches above the pressure-sensitive marble floor.

ELENA
Security terminal bypassed. Disabling magnetic locks on Vault Delta.

=== ACT II ===

INT. HIGH-SECURITY VAULT DELTA - NIGHT

A 30-ton titanium door swings open. Inside sits a single quantum storage drive pulsing with ultraviolet light.

MARCUS
Grab the drive and plant the thermite charge. We have company in the lobby.

EXT. SUBTERRANEAN ESCAPE TUNNEL - NIGHT

Heavy automated security sentries fire armor-piercing rounds down the narrow tunnel. Marcus ignites the thermal smoke canister.

=== ACT III ===

EXT. ROOFTOP HELIPAD - DAWN

The extraction chopper clears the Zurich skyline as the vault below implodes into a controlled electrical surge.`
  },
  {
    id: "cyberpunk",
    name: "Neon Horizon (Cyberpunk Action)",
    title: "NEON HORIZON",
    director: "Denis Villeneuve",
    leadEditor: "Joe Walker, ACE",
    text: `TITLE: NEON HORIZON
DIRECTOR: Denis Villeneuve
LEAD EDITOR: Joe Walker, ACE

=== ACT I ===

EXT. NEO-TOKYO LOWER DOCKS - RAIN / NIGHT

Giant holographic fish swim between mega-skyscrapers. Acid rain steams off asphalt.

KAI checks the neural cyber-deck jacked into his forearm.

KAI
The encrypted datastream is coming from the floating casino in Sector 9.

INT. FLOATING CYBER-CASINO - NIGHT

Synthesized koto music blares. Android dealers with chrome eyes deal optical cards to corporate oligarchs.

MIRA
Security knows you're in the building, Kai. Move now.

=== ACT II ===

EXT. SKY-HIGHWAY PURSUIT - NIGHT

Hovercrafts weave between high-voltage maglev trains at 200 mph. Plasma plasma cannons blast neon billboards into flaming shards.

=== ACT III ===

INT. MEGACORP PENTHOUSE CORE - DAWN

The central quantum mainframe hums. Kai places the override drive into the core socket as the morning sun breaks through the smog.`
  }
];

export const DEPARTMENTS = [
  { id: "picture", name: "Picture Editing", icon: "Film", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { id: "sound", name: "Sound Post", icon: "Volume2", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { id: "vfx", name: "VFX & Graphics", icon: "Sparkles", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { id: "color", name: "Color & Grading", icon: "Palette", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { id: "mastering", name: "Mastering & QC", icon: "CheckCircle2", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
];

export const INITIAL_DIRECTOR_BOARD_NOTES = [
  {
    id: "db_note_1",
    title: "Act I Picture Lock Mandate & Pacing Target",
    content: "Editorial & Sound: Scene 1 is officially LOCKED. Joe, please ensure the 8-frame monitor cutaway trim in Scene 2 preserves Dr. Arlo's eye-line before turning over to Foley and Sound design. All departments can treat Scene 1 as final picture reference for delivery.",
    author: "Jerry Vance",
    authorRole: "Executive Director (L1)",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    targetDepartment: "EDITORIAL",
    priority: "CRITICAL",
    pinned: true,
    sceneTag: "Act I (Scenes 1-2)",
    createdAt: "Today at 09:15 AM",
    acknowledgments: [
      { userName: "Joe Walker, ACE", roleTitle: "Lead Picture Editor (L2)", timestamp: "09:30 AM" },
      { userName: "Elena Rostov", roleTitle: "Department Craft Supervisor (L3)", timestamp: "09:42 AM" }
    ],
    replies: [
      {
        id: "rep_1",
        author: "Joe Walker, ACE",
        role: "Lead Picture Editor",
        text: "Understood Jerry. Trims verified against 24fps master timeline. EDL exported to Sound.",
        timestamp: "09:32 AM"
      }
    ]
  },
  {
    id: "db_note_2",
    title: "VFX Orbital Earth Composite Turnaround Window",
    content: "VFX Team: Scene 3 (Stratosphere separation) currently has 8 of 16 shots approved. For the zero-g booster staging, let's keep the earth horizon curvature slightly dimmer so the rocket plasma flame remains the dominant high-dynamic-range hero element. We need v04 plates in review by Thursday.",
    author: "Jerry Vance",
    authorRole: "Executive Director (L1)",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    targetDepartment: "VFX",
    priority: "HIGH",
    pinned: true,
    sceneTag: "Scene 3 (Act IIA)",
    createdAt: "Today at 11:20 AM",
    acknowledgments: [
      { userName: "Elena Rostov", roleTitle: "Department Craft Supervisor (L3)", timestamp: "11:45 AM" }
    ],
    replies: [
      {
        id: "rep_2",
        author: "Elena Rostov",
        role: "VFX Supervisor",
        text: "Plate pulls for shot 09 and 12 are queued in Nuke. Comp passes will be uploaded to screening room at 4 PM.",
        timestamp: "11:50 AM"
      }
    ]
  },
  {
    id: "db_note_3",
    title: "Dolby Atmos Sub-Harmonic Mix Directives for Launch Sequence",
    content: "Sound Department: During Scene 1 rocket ignition, keep the sub-bass rumble tight below 40Hz. When the staging separation cut occurs in Scene 3, I want an absolute dead drop in audio silence for 1.5 seconds before the mission AI voice comes in. High contrast is key to the emotional punch.",
    author: "Jerry Vance",
    authorRole: "Executive Director (L1)",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    targetDepartment: "SOUND",
    priority: "CREATIVE",
    pinned: false,
    sceneTag: "Scene 1 & Scene 3",
    createdAt: "Yesterday at 04:10 PM",
    acknowledgments: [
      { userName: "Elena Rostov", roleTitle: "Department Craft Supervisor (L3)", timestamp: "Yesterday at 04:30 PM" }
    ],
    replies: []
  },
  {
    id: "db_note_4",
    title: "Studio Executive Screening & Milestone Sign-Off Window",
    content: "All Departments & Studio Clients: Clara Sterling and Warner distribution team will screen the Act I & Act II assembly cut this Friday at 3:00 PM PST. Please ensure all approved fine cuts and current VFX work-in-progress plates are checked in by noon Friday.",
    author: "Jerry Vance",
    authorRole: "Executive Director (L1)",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    targetDepartment: "ALL",
    priority: "MILESTONE",
    pinned: false,
    sceneTag: "Full Timeline Assembly",
    createdAt: "Yesterday at 02:00 PM",
    acknowledgments: [
      { userName: "Clara Sterling", roleTitle: "Studio Executive (L4)", timestamp: "Yesterday at 02:15 PM" },
      { userName: "Joe Walker, ACE", roleTitle: "Lead Picture Editor (L2)", timestamp: "Yesterday at 02:30 PM" }
    ],
    replies: [
      {
        id: "rep_3",
        author: "Clara Sterling",
        role: "Studio Executive",
        text: "Looking forward to screening the updated color pass and the new sound mix!",
        timestamp: "Yesterday at 02:20 PM"
      }
    ]
  }
];

