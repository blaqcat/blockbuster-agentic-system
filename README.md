# Train Platform 🚆🎬
### Intelligent Post-Production Workflow Orchestrator & Multi-Agent Cinema Engine

> **Built for the Google Cloud Agentic Cinema Hackathon ($75k Track)**  
> Powered by **Google Cloud GenAI (Gemini 1.5)**, **Autonomous Enterprise Multi-Agent Fleet**, **Grafana Telemetry APIs**, **Google Cloud Run**, and **Identity-Aware Proxy (IAP)**.

---

## 🇿🇦 Cultural Inspiration: The Train Surfers of South Africa

**Train Platform** draws its name, ethos, and kinetic energy from the legendary **Train Surfers of South Africa** (*staff riders* / *isitimela*) across Soweto, Katlehong, Umlazi, and Johannesburg commuter rail lines.

In South African youth street culture, train surfing emerged as a dance of radical agility, athletic balance, and split-second precision against immovable physical constraints. Surfers read the speed of the train, anticipate overhead high-voltage electrical cables, duck beneath concrete bridges, and leap between rattling steel cars with absolute synchronicity and calm focus.

**In feature film post-production, a film is a high-speed express train hurtling toward locked festival and theatrical release dates.** Editorial changes in Picture Cut send shockwaves down the line—threatening to derail Sound, VFX shots, Color grading, and Mastering if timing is off by even a fraction of a second.

**Train Platform** is the staging ground, switching yard, and telemetry deck built for post-production teams riding these high-velocity creative rails:
- **Kinetic Agility:** Rapid screenplay ingestion and real-time timeline refactoring without breaking stride or losing cut momentum.
- **Split-Second Synchronization:** Gemini Enterprise Agents acting as watchful lookouts across coupled departments, anticipating bottlenecks before they derail the turnover.
- **Defiant Precision:** Unwavering focus under relentless release deadlines, transforming complex post-production chaos into an exhilarating, unified cinematic delivery.

---

## 🌐 Live Production Deployment (GCP Project: `ace-vial-371506`)

- **Cloud Run Service**: [`https://blockbuster-app-404320605842.europe-west1.run.app`](https://blockbuster-app-404320605842.europe-west1.run.app)
- **External Load Balancer & IAP Frontend IP**: `http://34.95.121.204`
- **Serverless NEG**: `blockbuster-neg` (`europe-west1`)
- **Backend Service**: `blockbuster-backend` (Global)
- **Forwarding Rule**: `blockbuster-forwarding-rule`

*(Detailed step-by-step setup and IAM permission commands are in [`DEPLOYMENT.md`](DEPLOYMENT.md).)*

---

## 🚀 Overview & Problem Statement

Film and television editing is fundamentally an intuitive, nonlinear craft. Because editors and directors need to "feel" their way through rhythm, pacing, and emotional resonance, post-production is notoriously difficult to systematize. A delay in **Picture Editing** ripples downstream into **Sound Post**, **VFX**, **Color Grading**, and **Mastering & QC**, leading to costly turnaround delays and missed festival deadlines.

**Train Platform** accelerates and synchronizes the entire post-production pipeline by:
1. Parsing screenplays (in **PDF**, **DOCX**, **Fountain**, or text format) and segmenting them into **Acts**, **Scenes**, page counts, and estimated runtimes.
2. Maintaining real-time multi-department synchronization across all 5 primary post-production pillars.
3. Deploying **Gemini Enterprise Agents** to autonomously audit department progress, enforce turnaround SLAs, and dispatch targeted alerts to Google Chat / Slack.
4. Providing **Grafana-powered Director Milestone Analytics** (burn-down velocity curves, readiness radar, and pacing distribution).
5. Exporting industry-standard **OpenTimelineIO (`.otio`)** and **Final Cut Pro XML (`.fcpxml`)** packages for DaVinci Resolve, Adobe Premiere Pro, and Avid Media Composer.

---

## 🤖 Gemini Enterprise Multi-Agent Architecture & Agent Mapping

**Train Platform** uses a hierarchical **Autonomous Multi-Agent System** powered by Google Cloud GenAI (Gemini) to monitor every scene and trigger automated reminders:

```
                  ┌────────────────────────────────────────┐
                  │    Google Cloud Gemini 1.5 Pro/Flash   │
                  │   Master Post-Production Supervisor    │
                  └──────────────────┬─────────────────────┘
                                     │
           ┌──────────────┬──────────┴───┬──────────────┬──────────────┐
           │              │              │              │              │
    ┌──────▼─────┐ ┌──────▼─────┐ ┌──────▼─────┐ ┌──────▼─────┐ ┌──────▼─────┐
    │Picture Cut │ │ Sound &    │ │VFX Pipeline│ │Color Conform│ │DCI / QC    │
    │Sentry Agent│ │Mix Dispatch│ │Warden Agent│ │Auditor Agent│ │Inspector   │
    └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └──────┬─────┘
           │              │              │              │              │
           └──────────────┴──────────┬───┴──────────────┴──────────────┘
                                     │
                 ┌───────────────────▼───────────────────┐
                 │  Dispatch Queue & Webhook Gateway     │
                 │  • Google Chat Spaces                 │
                 │  • Slack Webhooks                     │
                 │  • Daily 08:00 AM Call-Sheet Cron     │
                 └───────────────────────────────────────┘
```

### Detailed Agent Mapping

| # | Enterprise Agent Name | Target Department | Autonomous Trigger & Responsibilities | Destination Channel |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Master Post Supervisor Agent** | *All Departments* | Analyzes overall schedule velocity, festival delivery deadlines, and flags cross-department bottlenecks. | Executive Director Dashboard & Email |
| **2** | **Editorial Cut Sentry Agent** | *Picture Editing* | Scans for scenes stalled in *Assembly* or *Rough Cut* (> 3 days), detects unaddressed director notes, and pushes for **Picture Lock**. | `Google Chat #editorial-war-room` |
| **3** | **Sound & Mix Dispatcher Agent** | *Sound Post Production* | Audits spotting sheets, ADR cue readiness, Foley logs, and ensures 5.1 / Dolby Atmos stem delivery. | `Slack #sound-foley-adr` |
| **4** | **VFX Pipeline Warden Agent** | *VFX & Graphics* | Tracks plate pulls, CGI composite turnarounds, vendor SLAs, and alerts external VFX facilities of pending director reviews. | `Slack #vfx-deliveries-ilm` |
| **5** | **Color Conform Auditor Agent** | *Color & Grading* | Verifies that Picture Lock is officially signed off before conform, tracks CDL/LUT look-dev, and checks HDR trim passes. | `Company 3 / DI Webhook` |
| **6** | **DCI / QC Inspector Agent** | *Mastering & QC* | Runs automated audio loudness tests (-24 LKFS), checks DCI color spaces, and audits IMF/DCP packaging deliverables. | `Mastering Lab Dispatch` |

---

## ✨ Core Application Features

### 1. 🎬 Master Scene Matrix
- Real-time grid of all scenes broken down by **Act** (Act I, Act IIA, Act IIB, Act III).
- 1-click status badge toggles across **Picture**, **Sound**, **VFX**, **Color**, and **Mastering**.
- Global search and filtering by character name, slugline, or Act.

### 2. 📋 Department Pipeline Board (Kanban)
- Focused swimlane views tailored to each department's workflow stages:
  - *Picture:* Assembly &rarr; Rough Cut &rarr; Fine Cut &rarr; Picture Lock 🔒
  - *Sound:* Not Started &rarr; Spotting / ADR &rarr; Sound Design & Foley &rarr; Final Mix
  - *VFX:* Plates Pulled &rarr; Comp & 3D &rarr; Director Review &rarr; Final Approved ✨
  - *Color:* Awaiting Picture Lock &rarr; Look Dev & Primary &rarr; Review Pass &rarr; Graded & Signed Off 🎨
  - *Mastering:* Pending &rarr; QC Verification &rarr; QC Passed &rarr; DCP / Master Ready 📦

### 3. 📄 Universal Document Ingestion (.PDF, .DOCX, .FOUNTAIN, .TXT)
- Integrated drag-and-drop file ingestion using `pdfjs-dist` and `mammoth`.
- Automatically extracts sluglines, character dialogue, and Act headings directly from screenplay files.
- Includes preloaded screenplay presets:
  - ⚡ *The Vault Protocol (Heist Thriller)*
  - ⚡ *Neon Horizon (Cyberpunk Action)*

### 4. 📊 Director Milestone Analytics (Grafana-style Radar)
- **Burn-Down & Velocity Curve**: Visualizes actual unlocked scenes against the ideal linear schedule.
- **Department Readiness Radar**: 5-axis synchronization radar tracking readiness across all post departments.
- **Pacing & Screenplay Density**: Analyzes page count vs. estimated runtime and VFX shot density per scene.
- **Grafana Cloud Telemetry Gateway**: Configure Prometheus / Grafana Influx API endpoints and push live post-production telemetry.

### 5. 💬 Director & Lead Editor Review Hub
- Centralized spotting logs and timecode-anchored revision trackers.
- Direct input for director feedback linked to scene cuts.

### 6. 📦 NLE Interchange Export
- One-click export to **OpenTimelineIO (`.otio`)** and **Final Cut Pro XML (`.fcpxml`)** for DaVinci Resolve, Adobe Premiere Pro, and Avid Media Composer.

---

## 🛠️ Installation & Quickstart

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Setup
```bash
# 1. Clone the repository
git clone https://github.com/your-org/blockbuster.git
cd blockbuster

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. Built for the Google Cloud Agentic Cinema Hackathon.
