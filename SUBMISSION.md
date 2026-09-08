# 🚆 Train Platform — Agentic Cinema Post-Production OS
### Intelligent Workflow Orchestrator & Autonomous Multi-Agent Cinema Engine

> **Track**: Google Cloud Agentic Cinema Hackathon ($75k Track)  
> **Live Cloud Run URL**: [https://blockbuster-app-404320605842.europe-west1.run.app](https://blockbuster-app-404320605842.europe-west1.run.app)  
> **IAP Load Balancer IP**: `http://34.95.121.204`  
> **GCP Project**: `ace-vial-371506` (`europe-west1`)  
> **GitHub Repository**: [https://github.com/blaqcat/blockbuster-agentic-system](https://github.com/blaqcat/blockbuster-agentic-system)

---

## Inspiration

**Train Platform** draws its name, ethos, and kinetic energy from the legendary **Train Surfers of South Africa** (*staff riders* / *isitimela*) across Soweto, Katlehong, Umlazi, and Johannesburg commuter rail lines.

In South African township street culture, train surfing emerged as a dance of radical agility, kinetic rhythm, athletic balance, and split-second precision against immovable physical constraints. Surfers read the speed of the moving train, anticipate overhead high-voltage electrical cables (catol), duck beneath concrete bridges, and leap between rattling steel cars with absolute synchronicity and calm focus.

**In feature film and episodic television, post-production is literally a high-speed express train hurtling toward locked release dates.** 

A film is not a calm, linear factory line:
- Editorial cuts, Sound post-production, Visual Effects (VFX), Color grading, and DCI Mastering are interconnected, high-speed rail cars coupled together.
- Because directors and editors must "feel" their way through pacing, emotion, and rhythm, a sudden 12-frame trim in the Picture Cut sends shockwaves down the line.
- A delay in Picture Editing ripples downstream into sound design stems, VFX plate pulls, and color conform. If communication slips or timing is missed by even a fraction of a second, the entire release can derail—costing millions in missed theatrical or festival windows.

We built **Train Platform** to capture that same spirit of boundary-pushing precision and aerial agility: providing an agentic platform where directors, editors, department leads, and autonomous Gemini AI agents ride the high-velocity rails of complex production timelines in perfect synchronization.

---

## What it does

**Train Platform** is an intelligent, multi-agent cinema post-production operating system that unifies, orchestrates, and monitors the entire post pipeline from initial screenplay ingestion to final OpenTimelineIO turnover export.

Key capabilities include:

1. **Universal Screenplay Ingestion (.PDF, .DOCX, .FOUNTAIN)**
   - Upload screenplays in PDF, Word (`.docx`), Fountain, or text format (or choose from built-in cinematic presets like *The Vault Protocol* or *Neon Horizon*).
   - Powered by **Google Cloud GenAI (Gemini 1.5)**, the system automatically parses scene headers, INT/EXT locations, day/night lighting, cast lists, character emotional beats, and page/runtime estimates.

2. **Dual-Mode Master Scene Matrix**
   - **Desktop 12-Column Editorial Grid**: Displays live cut versions, picture lock state, sound design stems, VFX shot approvals (approved vs. total), color CDL/LUT conforms, and mastering QC metrics across all scenes.
   - **Touch-Friendly Mobile Cards**: Seamless responsive view for directors and craft leads reviewing cuts from mobile phones or on-set tablets with 1-tap department status chips.

3. **Multi-Craft Kanban Pipelines**
   - Five dedicated department swimlanes (**Picture Cut**, **Sound Post**, **VFX Pipeline**, **Color Grading**, and **Mastering & QC**).
   - Allows department leads to advance scenes through stages (e.g., *Assembly &rarr; Rough Cut &rarr; Fine Cut &rarr; Picture Lock*) with automated dependency checks and craft notes.

4. **Autonomous Gemini Enterprise Multi-Agent Fleet**
   - A hierarchical fleet of 6 specialized autonomous agents:
     - 👑 **Master Post Supervisor Agent**: High-level cross-department turnover orchestrator.
     - ✂️ **Picture Cut Sentry Agent**: Audits assembly lag, identifying cuts stalled > 3 days.
     - 🔊 **Sound & Mix Dispatcher Agent**: Tracks dialogue stems, ADR spotting, and Foley readiness.
     - 💥 **VFX Pipeline Warden Agent**: Enforces vendor turnaround SLAs across VFX houses (ILM, Framestore, DNEG).
     - 🎨 **Color Conform Auditor Agent**: Verifies Picture Lock sign-offs before DI conform begins.
     - 🎯 **DCI & QC Inspector Agent**: Validates -24 LKFS audio loudness and DCI/IMF packaging compliance.
   - Dispatches automated webhook reminder alerts to **Google Chat** and **Slack** channels.

5. **Director Hub & Milestone Telemetry**
   - Comprehensive revision logs, timestamped director feedback notes, and client screening approvals.
   - Grafana-powered telemetry displaying **Burn-Down Velocity Curves**, a **5-Axis Department Readiness Radar**, and **Pacing Distribution Charts**.

6. **Industry-Standard NLE Turnover Exports**
   - Generates production-ready **OpenTimelineIO (`.otio`)** and **Final Cut Pro XML (`.fcpxml`)** packages ready for immediate import into **DaVinci Resolve**, **Adobe Premiere Pro**, and **Avid Media Composer**.

7. **4-Tier Role-Based Access Control (RBAC)**
   - **Level 1 (Executive Producer & Director - Denis Villeneuve)**: Full sovereign sign-offs, agent fleet audits, OTIO exports.
   - **Level 2 (Lead Department Heads - Joe Walker, ACE / Sound / VFX / Color)**: Stage transitions and craft review notes.
   - **Level 3 (Studio Craft Artists)**: Task progression and asset tracking.
   - **Level 4 (Client & Studio Reviewer)**: Read-only screening and timestamped feedback ratings.

8. **First-Time User Guidance & Onboarding Tour**
   - A built-in, 5-step interactive onboarding tour that guides first-time users through the cultural ethos, 4-tier roles, matrix & Kanban navigation, multi-agent fleet, and script ingestion/export.

---

## How we built it

Train Platform was engineered with modern cloud-native architecture, robust agentic design patterns, and zero-trust security:

### 🛠️ Complete Tech Stack & Tools Used

| Layer / Category | Technology / Tool | Purpose & Usage in Train Platform |
| :--- | :--- | :--- |
| **Foundation Models & AI** | **Google Cloud Gemini 1.5 Pro** | Deep contextual screenplay breakdown, character emotional arc parsing, and multi-scene narrative analysis. |
| **Foundation Models & AI** | **Google Cloud Gemini 1.5 Flash** | Low-latency autonomous agent audits, turnaround calculations, and real-time SLA reminder evaluations. |
| **AI Orchestration** | **`@google/generative-ai` SDK** | Client & edge SDK integrating Gemini multimodal models with custom schema formatting. |
| **Multi-Agent Engine** | **Custom Autonomous Sentry Fleet** | 6-agent hierarchy (Supervisor, Picture Sentry, Sound Dispatcher, VFX Warden, Color Auditor, QC Inspector) with independent audit cycles. |
| **Cloud Compute & Hosting** | **Google Cloud Run (Serverless)** | Containerized microservices hosting the web OS with sub-second scale-to-zero and high concurrency (`europe-west1`). |
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

## Challenges we ran into

1. **Modeling Complex Non-Linear Editorial Dependencies**
   - In film post-production, departments do not follow a simple sequential waterfall. Sound design and VFX need early rough cuts to start work, but Color grading and DCI Mastering cannot begin until Picture Lock is signed off. Modeling these asymmetric constraints without blocking parallel workflows required designing stateful stage validations and multi-level RBAC gates.

2. **Parsing Heterogeneous Screenplay Formats**
   - Screenplays arrive in diverse formats: PDFs with arbitrary font encodings, Word documents with irregular margins, and Fountain text files. We designed a dual-tier ingestion engine: client-side binary extraction to pull raw text tokens, followed by structured Gemini prompt schemas that reliably produce standardized scene numbers, sluglines, cast lists, and page counts.

3. **Configuring Zero-Trust Identity-Aware Proxy with Cloud Run Serverless NEGs**
   - Configuring Google Cloud IAP with a Serverless NEG on Cloud Run required meticulous GCP infrastructure setup: provisioning global forwarding rules, backend services, health check policies, and fine-grained IAM bindings for Cloud Build service accounts (`vertex-express@ace-vial-371506.iam.gserviceaccount.com`). Ensuring seamless fallback authentication for local development and live production took extensive testing.

4. **Dual-Mode Desktop & Mobile Usability**
   - Post-production matrices are notoriously dense—traditionally displayed across dual 4K monitors in editorial suites. Translating a 12-column editorial table to mobile viewports without sacrificing quick-glance status visibility required architecting a dual-mode layout: an expansive editorial matrix on desktop, and an adaptive card-based touch interface on mobile.

---

## Accomplishments that we're proud of

- 🚀 **Live Production Deployment on GCP**: Successfully containerized and deployed live on **Google Cloud Run** (`europe-west1`) fronted by an external load balancer and Identity-Aware Proxy at `34.95.121.204`.
- 🇿🇦 **Meaningful Cultural Grounding**: Drawing authentic, respectful inspiration from the South African Train Surfers (*staff riders* / *isitimela*) to create a compelling, poetic metaphor for high-velocity film post-production.
- 🤖 **True Autonomous Agentic Architecture**: Implementing 6 discrete Gemini agents that don't just chat, but autonomously evaluate operational metrics (turnaround windows, stalled cuts, loudness specs) and dispatch real-time webhooks.
- 🎬 **Industry Standard Interoperability**: Exporting valid OpenTimelineIO (`.otio`) timelines that editors can directly drag and drop into DaVinci Resolve or Adobe Premiere Pro.
- 📱 **Flawless Mobile Touch UX**: Building an interface that allows directors and department leads to review cut statuses, audit vendor progress, and log notes from an iPhone or Android device on set.
- 🧭 **Zero-Friction First-Time Onboarding**: An interactive 5-step tour that takes new users from zero knowledge to navigating the entire platform in 60 seconds.

---

## What we learned

- **Agent Specialization Over Monolithic Prompts**: Giving each Gemini agent a tight, well-defined operational scope (e.g., Picture Cut Sentry vs. VFX Pipeline Warden) yielded vastly more reliable, actionable outputs than a single monolithic "post-production supervisor" prompt.
- **The Power of OpenTimelineIO**: OTIO is a transformative open standard for film workflows. Generating OTIO schemas directly from AI script breakdowns bridges the historical gap between creative ideation and technical NLE timelines.
- **Zero-Trust Simplifies Enterprise Security**: Utilizing Google Cloud Identity-Aware Proxy eliminated the need for complex custom authentication backends while providing enterprise-grade, BeyondCorp-certified access control.
- **Mobile-First is Crucial in Production**: Even though editing happens on desktop workstations, production decisions happen on set, in transit, and during screenings. Mobile accessibility is a game-changer for director-editor alignment.

---

## What's next for Train Platform

- 🔌 **Native NLE Cloud Panels**: Developing native Adobe Premiere Pro (UXP/CEP) and DaVinci Resolve (Python Workflow Integration) panels to synchronize timeline markers directly into Train Platform in real time.
- 🎥 **Frame-Accurate Cloud Video Review**: Integrating Google Cloud Storage signed URLs to stream high-bitrate ProRes and DNxHR proxy rushes with frame-accurate video playback, SMPTE timecode burn-in, and canvas drawing annotations.
- 🧠 **Multimodal Cut Auditing with Gemini 1.5 Pro Video**: Uploading rendered cut exports directly to Gemini to automatically detect flash frames, audio sync slip, black frames, and VFX composite dropouts before director screening.
- 📦 **Automated Vendor Pull Packages**: Automatically generating EDL/XML pull sheets and packaging camera raw files into cloud transfer buckets for VFX facilities.
- 🌍 **Empowering African & Independent Filmmakers**: Partnering with African film festivals, universities, and independent filmmaker collectives to provide free access to Train Platform, democratizing high-end studio orchestration tools for emerging storytellers worldwide.
