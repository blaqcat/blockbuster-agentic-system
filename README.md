# Train Platform 🚆🎬
### Intelligent Post-Production Workflow Orchestrator & Multi-Agent Cinema Engine

> **Built for the Google Cloud Agentic Cinema Hackathon ($75k Track)**  
> Powered by **Google Cloud GenAI (Gemini 2.0 Flash & Gemini 1.5 Pro)**, **Director AI Pipeline Copilot**, **Public Board of Directors' Directives**, **Autonomous Enterprise Multi-Agent Fleet**, **Grafana Telemetry APIs**, **Google Cloud Run**, and **Identity-Aware Proxy (IAP)**.  
> 📄 Read the complete project story & hackathon submission in **[`SUBMISSION.md`](SUBMISSION.md)**.

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

### 1. 🤖 Director AI Pipeline Copilot (Powered by Google Gemini 2.0 Flash & 1.5 Pro)
- **Frontier Multimodal Intelligence**:
  - **Gemini 2.0 Flash (Default Flagship):** Sub-second (~200ms) real-time token streaming with state-of-the-art cinematic reasoning.
  - **Gemini 1.5 Pro (Deep Cinematic Reasoning):** 2M token context window for complex cross-scene narrative continuity, emotional rhythm analysis, and multi-department scheduling.
  - **Gemini 1.5 Flash (Balanced):** Standard fast multimodal speed for quick turnaround checks.
  - **In-Chat Model Selector:** Switch between frontier models on the fly.
- **Granular Pipeline Telemetry (Zero Canned Responses)**:
  - Deep scene-by-scene tracking across all 5 post-production tracks:
    - *Picture Editorial:* Cut stages, 8-frame eyeline trim status, and lock sign-off readiness.
    - *VFX & CGI:* Shot-level inventory, approved vs pending shots (e.g. 8 orbital Earth passes in Scene 3), plate pulls, and vendor turnaround tracking.
    - *Sound Post:* Dialogue stem freezing, Foley, Atmos spatial mixing, and holds caused by unlocked picture cuts.
    - *Color / DI:* ACEScc/Rec.709 LUT conforms (e.g. Kodak 5219, Teal & Orange), CRT phosphor balancing, and lock holds.
    - *Mastering & QC:* DCI specs, IMF packaging readiness, and audio loudness compliance (-24 LKFS).
- **Enterprise ADC & API Key Connector**:
  - **Organization-Compliant Application Default Credentials (ADC)**: When raw API keys are disallowed by enterprise organization policies, authenticate via:
    ```bash
    bash <(curl -sSL https://storage.googleapis.com/cloud-samples-data/adc/setup_adc.sh)
    # Print OAuth access token:
    gcloud auth print-access-token
    ```
    Set `VITE_GCP_ACCESS_TOKEN` in your `.env` or paste your `ya29...` token directly into the connector modal to stream via Google Cloud Vertex AI!
  - **Google AI Studio API Keys**: Also supports `AIza...` keys via `VITE_GEMINI_API_KEY` or modal input.
  - One-click modal in the chat header with instant token/key validation and `localStorage` persistence.
  - Seamless offline dynamic simulation fallback if running unauthenticated.
- **1-Click Board Publishing**:
  - Directorial dossiers, turnaround targets, or drafted directives can be promoted to the public studio bulletin board in a single click via **"Publish to Directors' Board"**.

### 2. 📋 Public Board of Directors' Notes (Studio-Wide Directives)
- **Universal Production Transparency**:
  - A studio-wide bulletin board visible to all 4 User Levels (`EXECUTIVE_DIRECTOR`, `LEAD_EDITOR`, `CRAFT_SUPERVISOR`, `CLIENT_REVIEWER`).
  - Directors post high-priority mandates, delivery targets, and creative revisions.
- **Interactive Crew Engagement**:
  - **Directive Acknowledgments:** Crew members click "Acknowledge Directive" to record their name, role title, and timestamp. Real-time count of all acknowledging department heads.
  - **Threaded Discussions:** Full comment threads for each directive, enabling editors, sound designers, and colorists to discuss conform timelines and confirm delivery schedules.
- **Global Pinned Mandate Ticker**:
  - High-priority director directives can be pinned, triggering a persistent broadcast ticker across all views with one-click navigation to the board.
- **Filters & Full-Text Search**:
  - Filter directives by department (`EDITORIAL`, `VFX`, `SOUND`, `COLOR`, `CLIENT`) and priority (`CRITICAL`, `HIGH`, `CREATIVE`, `MILESTONE`).

### 3. 🎬 Master Scene Matrix
- Real-time grid of all scenes broken down by **Act** (Act I, Act IIA, Act IIB, Act III).
- 1-click status badge toggles across **Picture**, **Sound**, **VFX**, **Color**, and **Mastering**.
- Global search and filtering by character name, slugline, or Act.

### 4. 📋 Department Pipeline Board (Kanban)
- Focused swimlane views tailored to each department's workflow stages:
  - *Picture:* Assembly &rarr; Rough Cut &rarr; Fine Cut &rarr; Picture Lock 🔒
  - *Sound:* Not Started &rarr; Spotting / ADR &rarr; Sound Design & Foley &rarr; Final Mix
  - *VFX:* Plates Pulled &rarr; Comp & 3D &rarr; Director Review &rarr; Final Approved ✨
  - *Color:* Awaiting Picture Lock &rarr; Look Dev & Primary &rarr; Review Pass &rarr; Graded & Signed Off 🎨
  - *Mastering:* Pending &rarr; QC Verification &rarr; QC Passed &rarr; DCP / Master Ready 📦

### 5. 📄 Universal Document Ingestion (.PDF, .DOCX, .FOUNTAIN, .TXT)
- Integrated drag-and-drop file ingestion using `pdfjs-dist` and `mammoth`.
- Automatically extracts sluglines, character dialogue, and Act headings directly from screenplay files.
- Includes preloaded screenplay presets:
  - ⚡ *The Vault Protocol (Heist Thriller)*
  - ⚡ *Neon Horizon (Cyberpunk Action)*

### 6. 📊 Director Milestone Analytics (Grafana-style Radar)
- **Burn-Down & Velocity Curve**: Visualizes actual unlocked scenes against the ideal linear schedule.
- **Department Readiness Radar**: 5-axis synchronization radar tracking readiness across all post departments.
- **Pacing & Screenplay Density**: Analyzes page count vs. estimated runtime and VFX shot density per scene.
- **Grafana Cloud Telemetry Gateway**: Configure Prometheus / Grafana Influx API endpoints and push live post-production telemetry.

### 7. 💬 Director & Lead Editor Review Hub
- Centralized spotting logs, scene-by-scene notes, and timecode-anchored revision trackers.
- Direct input for director feedback linked to scene cuts.

### 8. 📦 NLE Interchange Export
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

## 🛠️ Built With / Technologies Used

| Layer / Category | Technology / Tool | Purpose & Usage in Train Platform |
| :--- | :--- | :--- |
| **Foundation Models & AI** | **Google Cloud Gemini 2.0 Flash** | Frontier low-latency (~200ms) multimodal intelligence powering the real-time Director AI Pipeline Copilot with token streaming. |
| **Foundation Models & AI** | **Google Cloud Gemini 1.5 Pro** | Deep cinematic reasoning, 2M token context cross-scene narrative continuity, and screenplay breakdown. |
| **Foundation Models & AI** | **Google Cloud Gemini 1.5 Flash** | Low-latency autonomous agent audits, turnaround calculations, and real-time SLA reminder evaluations. |
| **AI Orchestration** | **`@google/generative-ai` SDK** | Client & edge SDK integrating Gemini multimodal models with custom schema formatting. |
| **Multi-Agent Engine** | **Autonomous Sentry Fleet** | 6-agent hierarchy (Supervisor, Picture Sentry, Sound Dispatcher, VFX Warden, Color Auditor, QC Inspector). |
| **Cloud Compute & Hosting** | **Google Cloud Run (Serverless)** | Containerized microservices hosting the web OS with sub-second scale-to-zero (`europe-west1`). |
| **Continuous Delivery** | **Google Cloud Build** | Automated CI/CD container image creation and blue/green production deployment via service account `vertex-express@ace-vial-371506.iam.gserviceaccount.com`. |
| **Containerization** | **Docker & Alpine Linux** | Multi-stage production container with minimal attack surface (`nginx:alpine`). |
| **Zero-Trust Security** | **Google Cloud Identity-Aware Proxy (IAP)** | BeyondCorp enterprise zero-trust perimeter enforcing OIDC token verification (`roles/iap.httpsResourceAccessor`). |
| **Cloud Networking** | **Google Cloud External HTTPS Load Balancer** | Global Anycast IP routing (`34.95.121.204`) with managed SSL/TLS termination and DDoS mitigation. |
| **Cloud Networking** | **Serverless Network Endpoint Groups (NEG)** | `blockbuster-neg` bridging the Global External Load Balancer backend service to regional Cloud Run instances. |
| **Identity & Access** | **Google Cloud IAM & Service Accounts** | Fine-grained programmatic credentials and role separation across build, runtime, and proxy layers. |
| **Frontend Framework** | **React 19** | Core reactive UI state machine, declarative rendering, and interactive component hierarchy. |
| **Build Tool & Bundler** | **Vite 6** | Instant HMR development server, optimized ESM bundling, and Rollup production minification. |
| **Styling & Design System** | **Tailwind CSS 3** | High-performance atomic utility styling with custom dark-mode cinema aesthetic and glassmorphism. |
| **Iconography & UI Assets** | **Lucide React** | Scalable SVG iconography for film reels, clapperboards, agents, timelines, and security badges. |
| **Data Visualization** | **HTML5 Canvas 2D API** | Custom dynamic 5-axis readiness radar visualization and milestone velocity curves. |
| **Cinema Interoperability** | **OpenTimelineIO (`.otio`)** | Universal NLE interchange schema export for DaVinci Resolve, Adobe Premiere Pro, and Avid Media Composer. |
| **Cinema Interoperability** | **Final Cut Pro XML (`.fcpxml`)** | Sequence interchange standard for Apple FCP and legacy editorial suites. |
| **Document Ingestion** | **Mammoth.js (`mammoth`)** | In-browser binary extraction of `.docx` Word screenplay documents to raw text tokens. |
| **Screenplay Formatting** | **Fountain Screenplay Spec** | Standard screenplay plaintext tokenization for sluglines, character dialogue, and parentheticals. |
| **Webhook Integrations** | **Google Chat Webhook API** | Real-time automated card dispatches for team reminders and stalled cut alerts. |
| **Webhook Integrations** | **Slack Incoming Webhooks** | Real-time channel notifications for cross-department milestone turnovers. |
| **Version Control & Dev** | **Git & GitHub** | Source control, issue tracking, and repository hosting at `blaqcat/blockbuster-agentic-system`. |
| **Runtime Environment** | **Node.js (v20+ LTS) & npm** | Package resolution, build execution, and module dependency graph management. |

---

## 👥 Core Team & Contributors

| Contributor | Role & Domain | Responsibilities in Train Platform |
| :--- | :--- | :--- |
| **Jerry Monyelo** | **Cloud Architect & Developer** | GCP Architecture (Cloud Run, IAP, Global External Load Balancer, Serverless NEG), Gemini Multi-Agent Fleet, App Engineering & React Orchestrator |
| **Sakhile Gumbi** | **Film Director** | Directorial Vision, Production Cadence Workflows, Script-to-Screen Analysis, and Director AI Agent Persona Design |
| **Siyanda Nzimande** | **Film Editor** | Picture Editorial Pacing, Cut Stage Transitions (Assembly to Lock), NLE Interchange Specs (OTIO/FCPXML), and Post-Production Logic |
| **Trevor Mkandla** | **Graphics & Video** | UI/UX Cinema Aesthetic, VFX Shot Telemetry, Graphic Assets, Dark-Mode Glassmorphism Design, and Video Production |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. Built for the Google Cloud Agentic Cinema Hackathon.
