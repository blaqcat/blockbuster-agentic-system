/**
 * 4 Levels of Users for Train Platform Post-Production Studio Orchestrator
 * Inspired by the Train Surfers of South Africa
 */

export const USER_ROLES = {
  EXECUTIVE_DIRECTOR: {
    level: 1,
    id: "EXECUTIVE_DIRECTOR",
    title: "Executive Producer & Director",
    shortTitle: "Director (L1)",
    department: "Studio Leadership & Executive",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    themeColor: "indigo",
    accentColor: "#6366f1",
    tagline: "Full Sovereign Authority & Studio Executive Sign-Off",
    defaultUser: {
      id: "usr_director_01",
      name: "Jerry Vance (Studio Lead)",
      email: "director@djehuti.org",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      roleId: "EXECUTIVE_DIRECTOR",
      organization: "Paramount Pictures / Google Cloud Cinema"
    },
    capabilities: [
      "Final Picture Lock authority (Lock/Unlock scenes)",
      "Deploy & Trigger Gemini 1.5 Enterprise Multi-Agent fleet",
      "Ingest & Parse Screenplays (.PDF / .DOCX / Fountain)",
      "Export OpenTimelineIO (.otio) and XML packages",
      "Add Executive Director Spotting Notes & Sign-offs",
      "Configure Grafana Cloud Prometheus Telemetry & Webhooks",
      "Full override permissions on all 5 post-production pillars"
    ],
    permissions: {
      canSignPictureLock: true,
      canEditPictureCut: true,
      canEditAllDepartments: true,
      canRunAgentAudit: true,
      canDispatchWebhooks: true,
      canImportScript: true,
      canExportTimeline: true,
      canAddDirectorNotes: true,
      canManageTelemetry: true,
      canAddClientReview: true
    }
  },

  LEAD_EDITOR: {
    level: 2,
    id: "LEAD_EDITOR",
    title: "Lead Picture Editor (ACE)",
    shortTitle: "Lead Editor (L2)",
    department: "Editorial & Story Assembly",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    themeColor: "amber",
    accentColor: "#f59e0b",
    tagline: "Creative Cut Progression, Pacing & Timeline Turnovers",
    defaultUser: {
      id: "usr_editor_01",
      name: "Joe Walker, ACE",
      email: "editor@ace-cutters.org",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      roleId: "LEAD_EDITOR",
      organization: "American Cinema Editors (ACE Guild)"
    },
    capabilities: [
      "Edit cut stages (Assembly -> Rough Cut -> Fine Cut)",
      "Request Picture Lock Sign-off from Director",
      "Adjust scene pacing, runtimes, and frame trim offsets",
      "Export OpenTimelineIO (.otio) & FCPXML timeline handoffs",
      "Add editorial cut notes & dialogue continuity markers",
      "View downstream craft departments (Sound/VFX/Color)"
    ],
    permissions: {
      canSignPictureLock: false, // Needs Director sign-off, but can request lock
      canEditPictureCut: true,
      canEditAllDepartments: false,
      canRunAgentAudit: false, // Can view agent logs
      canDispatchWebhooks: false,
      canImportScript: false,
      canExportTimeline: true,
      canAddDirectorNotes: true,
      canManageTelemetry: false,
      canAddClientReview: false
    }
  },

  CRAFT_SUPERVISOR: {
    level: 3,
    id: "CRAFT_SUPERVISOR",
    title: "Department Craft Supervisor",
    shortTitle: "Craft Lead (L3)",
    department: "VFX, Sound & Color Post",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    themeColor: "emerald",
    accentColor: "#10b981",
    tagline: "Specialized Department Status, VFX Shots & Color LUTs",
    defaultUser: {
      id: "usr_craft_01",
      name: "Elena Rostov (VFX & Sound Lead)",
      email: "elena.craft@ilm-sound.studio",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      roleId: "CRAFT_SUPERVISOR",
      organization: "Industrial Light & Sound Post Lab"
    },
    subCrafts: [
      { id: "vfx", name: "VFX Supervisor", icon: "Sparkles", color: "purple" },
      { id: "sound", name: "Sound Designer / Mixer", icon: "Volume2", color: "cyan" },
      { id: "color", name: "Lead Colorist (DI)", icon: "Palette", color: "emerald" },
      { id: "mastering", name: "DCI / QC Engineer", icon: "CheckCircle2", color: "rose" }
    ],
    capabilities: [
      "Update department statuses (Sound, VFX, Color, QC)",
      "Manage VFX shot counters (approved vs in-progress)",
      "Assign Look-Dev LUTs & CDL profiles to scenes",
      "Add technical spotting notes & audio LKFS loudness tags",
      "Department-specific Kanban swimlanes & turnover review"
    ],
    permissions: {
      canSignPictureLock: false,
      canEditPictureCut: false,
      canEditAllDepartments: true, // For craft departments
      canRunAgentAudit: false,
      canDispatchWebhooks: false,
      canImportScript: false,
      canExportTimeline: false,
      canAddDirectorNotes: false,
      canManageTelemetry: false,
      canAddClientReview: false
    }
  },

  CLIENT_REVIEWER: {
    level: 4,
    id: "CLIENT_REVIEWER",
    title: "Studio Client & Executive Reviewer",
    shortTitle: "Client Reviewer (L4)",
    department: "Executive Review & Distribution",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    themeColor: "sky",
    accentColor: "#0284c7",
    tagline: "Interactive Screening Feedback, Ratings & Executive Analytics",
    defaultUser: {
      id: "usr_reviewer_01",
      name: "Clara Sterling (Studio Executive)",
      email: "clara.sterling@warner-studios.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
      roleId: "CLIENT_REVIEWER",
      organization: "Warner Studios International Distribution"
    },
    capabilities: [
      "Interactive Screening Room: rate scenes (1-5 stars) & submit review notes",
      "Flag scenes as 'Approved for Screening' or 'Revision Requested'",
      "Inspect screenplay emotional beats & character arcs",
      "View Director Milestone Analytics & Velocity curves",
      "Safe Read-Only Mode: production cuts protected against accidental changes"
    ],
    permissions: {
      canSignPictureLock: false,
      canEditPictureCut: false,
      canEditAllDepartments: false,
      canRunAgentAudit: false,
      canDispatchWebhooks: false,
      canImportScript: false,
      canExportTimeline: false,
      canAddDirectorNotes: false,
      canManageTelemetry: false,
      canAddClientReview: true
    }
  }
};

export const INITIAL_CLIENT_REVIEWS = {
  sc_1: [
    {
      id: "rev_1",
      author: "Clara Sterling (Client Reviewer)",
      role: "Studio Executive",
      rating: 5,
      status: "APPROVED",
      comment: "Breathtaking desert atmospheric opening. Pacing feels tight and cinematic.",
      timestamp: "Today, 2:45 PM"
    }
  ],
  sc_2: [
    {
      id: "rev_2",
      author: "Clara Sterling (Client Reviewer)",
      role: "Studio Executive",
      rating: 4,
      status: "REVISION_REQUESTED",
      comment: "Command bunker tension is great, but ensure siren sound mix doesn't overpower dialogue.",
      timestamp: "Today, 3:15 PM"
    }
  ]
};

export const LUT_PRESETS = [
  { id: "KODAK_5219_FilmPrint_v4", name: "Kodak 5219 Film Print v4 (Warm Glow)" },
  { id: "Teal_Orange_FilmStock", name: "Teal & Orange Contemporary Bleach" },
  { id: "HighOrbit_DeepBlue", name: "High Orbit Deep Space Blue 3D LUT" },
  { id: "SciFi_FluorescentWhite", name: "Sci-Fi Clean Fluorescent White" },
  { id: "Sunrise_WarmGolden", name: "Sunrise Warm Golden Flare DCI-P3" }
];
