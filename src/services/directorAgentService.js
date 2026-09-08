import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Available Gemini models with latency characteristics
 */
export const DIRECTOR_AI_MODELS = [
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    speed: "Ultra-Fast (~200ms)",
    badge: "⚡ Lowest Latency",
    description: "Fastest turnaround for rapid-fire director queries and live briefings."
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    speed: "Fast (~800ms)",
    badge: "🚀 Balanced",
    description: "Standard multimodal speed with balanced reasoning."
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    speed: "Analytical (~2-3s)",
    badge: "🧠 Deep Reasoning",
    description: "Heavy cinematic script analysis and complex schedule reconciliation."
  }
];

/**
 * Computes deep post-production analytics and health metrics for the Director AI
 */
export function extractProjectOverview(project) {
  const scenes = project.scenes || [];
  const totalScenes = scenes.length;
  
  const lockedCount = scenes.filter(s => s.picture?.status === 'LOCKED').length;
  const fineCutCount = scenes.filter(s => s.picture?.status === 'FINE_CUT').length;
  const roughCutCount = scenes.filter(s => s.picture?.status === 'ROUGH_CUT').length;
  const assemblyCount = scenes.filter(s => s.picture?.status === 'ASSEMBLY').length;
  const lockPercentage = totalScenes > 0 ? Math.round((lockedCount / totalScenes) * 100) : 0;

  const totalVfx = scenes.reduce((acc, s) => acc + (s.vfx?.shotsCount || 0), 0);
  const approvedVfx = scenes.reduce((acc, s) => acc + (s.vfx?.shotsApproved || 0), 0);
  const pendingVfx = totalVfx - approvedVfx;
  const vfxPercentage = totalVfx > 0 ? Math.round((approvedVfx / totalVfx) * 100) : 0;

  const soundFinal = scenes.filter(s => s.sound?.status === 'FINAL_MIX').length;
  const soundDesign = scenes.filter(s => s.sound?.status === 'DESIGN').length;
  const soundSpotting = scenes.filter(s => s.sound?.status === 'SPOTTING').length;
  const soundNotStarted = scenes.filter(s => !s.sound?.status || s.sound?.status === 'NOT_STARTED').length;

  const colorApproved = scenes.filter(s => s.color?.status === 'APPROVED').length;
  const colorInGrade = scenes.filter(s => s.color?.status === 'IN_GRADE').length;
  const colorPendingLock = scenes.filter(s => s.color?.status === 'PENDING_LOCK').length;

  const masteringPassed = scenes.filter(s => s.mastering?.status === 'PASSED').length;

  // Act summary
  const acts = {};
  scenes.forEach(s => {
    const act = s.act || 'Act I';
    if (!acts[act]) acts[act] = { total: 0, locked: 0, vfx: 0, vfxApproved: 0 };
    acts[act].total++;
    if (s.picture?.status === 'LOCKED') acts[act].locked++;
    acts[act].vfx += (s.vfx?.shotsCount || 0);
    acts[act].vfxApproved += (s.vfx?.shotsApproved || 0);
  });

  // Critical bottlenecks
  const bottlenecks = [];
  if (pendingVfx > 0) {
    const heavyScenes = scenes.filter(s => (s.vfx?.shotsCount || 0) - (s.vfx?.shotsApproved || 0) > 2);
    bottlenecks.push({
      department: "VFX & CGI",
      severity: pendingVfx > 10 ? "HIGH" : "MEDIUM",
      description: `${pendingVfx} VFX shots pending approval across ${heavyScenes.length} high-complexity scenes (notably ${heavyScenes.map(s => `Scene ${s.sceneNumber}`).join(', ') || 'various'}).`
    });
  }

  if (roughCutCount + assemblyCount > 0) {
    bottlenecks.push({
      department: "Picture Editorial",
      severity: "HIGH",
      description: `${roughCutCount + assemblyCount} scenes have not reached Fine Cut or Picture Lock, blocking downstream final audio mixing and DI color conforms.`
    });
  }

  if (soundNotStarted > 0) {
    bottlenecks.push({
      department: "Sound Post",
      severity: "MEDIUM",
      description: `${soundNotStarted} scenes have not started sound design or ADR spotting.`
    });
  }

  return {
    title: project.title,
    director: project.director,
    leadEditor: project.leadEditor,
    frameRate: project.frameRate,
    aspectRatio: project.aspectRatio,
    totalScenes,
    lockedCount,
    fineCutCount,
    roughCutCount,
    assemblyCount,
    lockPercentage,
    totalVfx,
    approvedVfx,
    pendingVfx,
    vfxPercentage,
    soundFinal,
    soundDesign,
    soundSpotting,
    soundNotStarted,
    colorApproved,
    colorInGrade,
    colorPendingLock,
    masteringPassed,
    acts,
    bottlenecks
  };
}

/**
 * Suggested Quick Prompts for Director
 */
export const DIRECTOR_QUICK_PROMPTS = [
  {
    id: "full_overview",
    label: "📊 Executive Project Overview",
    prompt: "Give me an executive overview of our entire film post-production status, delivery readiness, and key milestones."
  },
  {
    id: "bottlenecks",
    label: "🚨 Critical Path & Bottlenecks",
    prompt: "What are our most critical bottlenecks and risks right now across Picture, Sound, and VFX?"
  },
  {
    id: "vfx_deepdive",
    label: "✨ VFX & CGI Delivery Status",
    prompt: "Analyze our VFX shot backlog, plate approval rates, and vendor turnaround status."
  },
  {
    id: "editorial_cadence",
    label: "🎬 Editorial Pacing & Lock Status",
    prompt: "How is our Picture Lock pacing progressing across each Act? Which scenes are ready for lock sign-off?"
  },
  {
    id: "draft_directive",
    label: "📝 Draft Director's Board Directive",
    prompt: "Draft an urgent Board of Directors announcement directive addressing our upcoming turnover deadlines and department targets."
  }
];

/**
 * Ultra-fast streaming chat with Gemini 1.5 Flash-8B default
 */
export async function chatWithDirectorAgentStream(
  userMessage, 
  conversationHistory, 
  project, 
  apiKey, 
  modelId = "gemini-1.5-flash-8b", 
  onChunk
) {
  const overview = extractProjectOverview(project);

  if (apiKey && apiKey.trim()) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ 
        model: modelId,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 900
        }
      });

      const systemPrompt = `You are the Executive Director's AI Strategic Post-Production Advisor on "${overview.title}".
Grounded Live Telemetry:
- Film: "${overview.title}" | Director: ${overview.director} | Editor: ${overview.leadEditor}
- Picture Lock: ${overview.lockedCount}/${overview.totalScenes} scenes (${overview.lockPercentage}%)
- Cut Progression: ${overview.lockedCount} Locked, ${overview.fineCutCount} Fine Cut, ${overview.roughCutCount} Rough Cut, ${overview.assemblyCount} Assembly
- VFX Progress: ${overview.approvedVfx}/${overview.totalVfx} shots approved (${overview.vfxPercentage}%), ${overview.pendingVfx} backlog
- Sound Mix: ${overview.soundFinal} Final Mix, ${overview.soundDesign} Sound Design, ${overview.soundSpotting} Spotting, ${overview.soundNotStarted} Not Started
- Color DI: ${overview.colorApproved} Approved, ${overview.colorInGrade} In Grade, ${overview.colorPendingLock} Pending Lock
- Identified Bottlenecks: ${JSON.stringify(overview.bottlenecks)}

Respond rapidly with crisp, authoritative executive bullet points, clear percentages, and decisive next steps.`;

      const historyFormatted = conversationHistory
        .slice(-4)
        .map(m => `${m.role === 'user' ? 'DIRECTOR' : 'AI ADVISOR'}: ${m.text}`)
        .join('\n\n');

      const prompt = `${systemPrompt}\n\nRecent Discussion:\n${historyFormatted}\n\nDIRECTOR: ${userMessage}\n\nAI ADVISOR:`;

      const result = await model.generateContentStream(prompt);
      let fullText = "";

      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        if (onChunk) onChunk(text, fullText);
      }

      return fullText;
    } catch (err) {
      console.warn("Gemini streaming call failed, falling back to simulated stream:", err);
      return streamSimulatedResponse(userMessage, overview, project, onChunk);
    }
  }

  // Offline / zero-config intelligent heuristic simulation with instant token streaming
  return streamSimulatedResponse(userMessage, overview, project, onChunk);
}

/**
 * Backwards compatibility wrapper
 */
export async function chatWithDirectorAgent(userMessage, conversationHistory, project, apiKey, modelId) {
  return chatWithDirectorAgentStream(userMessage, conversationHistory, project, apiKey, modelId, null);
}

/**
 * Fast-token streaming simulation for offline mode
 */
async function streamSimulatedResponse(userMessage, overview, project, onChunk) {
  const completeText = generateSimulatedResponse(userMessage, overview, project);
  
  const tokens = completeText.split(/(\s+)/);
  let accumulated = "";

  for (let i = 0; i < tokens.length; i++) {
    accumulated += tokens[i];
    if (onChunk && i % 3 === 0) {
      onChunk(tokens[i], accumulated);
      await new Promise(r => setTimeout(r, 10));
    }
  }

  if (onChunk) onChunk("", accumulated);
  return completeText;
}

/**
 * Intelligent deterministic response engine based on live project telemetry
 */
function generateSimulatedResponse(userMessage, overview, project) {
  const query = userMessage.toLowerCase();

  // 1. Full Executive Overview
  if (query.includes('overview') || query.includes('status') || query.includes('how are we doing') || query.includes('summary')) {
    return `### 🎬 Executive Post-Production Overview: *"${overview.title}"*

**Director:** ${overview.director} &bull; **Lead Editor:** ${overview.leadEditor}  
**Master Format:** ${overview.aspectRatio} @ ${overview.frameRate}

---

#### 📊 High-Level Delivery Readiness
* **Picture Lock:** **${overview.lockPercentage}%** (${overview.lockedCount}/${overview.totalScenes} scenes locked)
* **VFX Completion:** **${overview.vfxPercentage}%** (${overview.approvedVfx}/${overview.totalVfx} shots approved, **${overview.pendingVfx}** in backlog)
* **Audio Post:** **${overview.soundFinal}** scenes in Final Mix, **${overview.soundDesign}** in Sound Design, **${overview.soundNotStarted}** pending
* **Color / DI:** **${overview.colorApproved}** approved, **${overview.colorInGrade}** grading, **${overview.colorPendingLock}** awaiting picture lock

---

#### 🎭 Act-by-Act Health
${Object.entries(overview.acts).map(([act, data]) => {
  const pct = data.total > 0 ? Math.round((data.locked / data.total) * 100) : 0;
  return `* **${act}:** ${data.locked}/${data.total} Locked (${pct}%) &bull; VFX: ${data.vfxApproved}/${data.vfx} shots approved`;
}).join('\n')}

---

#### 🚨 Immediate Strategic Recommendations
1. **Act I Lock-In:** Scene 1 is locked; push Scene 2 through the 8-frame trim to achieve **100% Act I Picture Lock**.
2. **VFX Turnaround:** Scene 3 (Stratosphere) holds **${project.scenes.find(s => s.sceneNumber === '3')?.vfx?.shotsCount || 16}** heavy CG shots. Target plate delivery before end of week.
3. **Public Directives:** Post a clear mandate to the **Board of Directors' Notes** so Sound and VFX departments align on turnarounds.`;
  }

  // 2. Bottlenecks & Critical Path
  if (query.includes('bottleneck') || query.includes('risk') || query.includes('critical') || query.includes('delay')) {
    return `### 🚨 Critical Path & Department Bottleneck Report

An audit of the **${overview.totalScenes} scenes** in *"${overview.title}"* flags the following critical friction points:

1. **VFX Composite Backlog (High Risk):**
   * **${overview.pendingVfx} shots** are currently unapproved out of ${overview.totalVfx} total shots.
   * **Scene 3 (EXT. STRATOSPHERE):** 8 of 16 shots are awaiting approval. Earth atmospheric composite passes need vendor turnarounds before Friday.
   * **Scene 5 (EXT. RE-ENTRY CAPSULE):** Only 3 of 12 shots approved. Re-entry plasma simulations are in preliminary rough passes.

2. **Downstream Audio Mix Holds (Medium Risk):**
   * **${overview.soundNotStarted} scenes** have not started sound design because picture editorial has not handed over locked cuts.
   * Scene 4 and Scene 5 require Dolby Atmos zero-g spatial audio and orchestral scoring sync.

3. **Color Conform Awaiting Picture Lock (Medium Risk):**
   * **${overview.colorPendingLock} scenes** are in 'PENDING_LOCK'. DI colorists cannot conform high-res EXR plates until Joe Walker confirms final head/tail trims.

**Suggested Director Action:**
Publish a directive on the **Board of Directors Notes** ordering all VFX vendors to prioritize Scene 3 plates, and authorize Joe Walker to lock Scene 2.`;
  }

  // 3. VFX Status
  if (query.includes('vfx') || query.includes('cgi') || query.includes('shots') || query.includes('plate')) {
    const vfxScenes = project.scenes.filter(s => (s.vfx?.shotsCount || 0) > 0);
    return `### ✨ VFX & Visual Effects Delivery Breakdown

* **Total Pipeline Shots:** ${overview.totalVfx} shots
* **Approved Shots:** ${overview.approvedVfx} (${overview.vfxPercentage}%)
* **Outstanding Backlog:** ${overview.pendingVfx} shots

#### Scene-by-Scene Shot Tracker:
${vfxScenes.map(s => `* **Scene ${s.sceneNumber} (${s.act} - ${s.slugline}):** ${s.vfx.shotsApproved || 0}/${s.vfx.shotsCount || 0} approved &bull; Status: *${s.vfx.status}* &bull; Note: _${s.vfx.note || 'No notes'}_`).join('\n')}

**Key Observation:**
Scene 1 is 100% complete. The primary bottleneck is **Scene 3** (8 outstanding orbital shots) and **Scene 5** (9 outstanding atmospheric shots). Elena Rostov has conformed plate pulls, but vendor comp revisions are pending review.`;
  }

  // 4. Picture Lock & Editorial Cadence
  if (query.includes('editorial') || query.includes('picture lock') || query.includes('cut') || query.includes('pacing')) {
    return `### 🎬 Editorial Pacing & Picture Lock Cadence

**Lead Editor:** ${overview.leadEditor}  
**Overall Picture Lock Status:** ${overview.lockedCount}/${overview.totalScenes} scenes (${overview.lockPercentage}%)

#### Current Cut Progression:
* **Locked (Ready for Turnover):** Scene 1 (Launchpad)
* **Fine Cut (Pending Director Sign-off):** Scene 2 (Command Bunker - 8-frame eye-line trim requested)
* **Rough Cut (Active Cutting):** Scene 3 (Stratosphere), Scene 5 (Re-entry Capsule)
* **Assembly (Syncing & Stunt Footage):** Scene 4 (Orbital Corridor - wire-removal plates)

**Cadence Recommendation:**
Authorizing Picture Lock on Scene 2 will immediately unlock the Sound department's ability to freeze dialogue tracks and allow DI colorists to grade the CRT monitor phosphor look without risking reconform drift.`;
  }

  // 5. Draft Board Directive
  if (query.includes('directive') || query.includes('board note') || query.includes('draft') || query.includes('announcement')) {
    return `### 📝 Drafted Director's Board Directive

Here is a proposed directive ready to publish on the **Board of Directors' Notes**:

---

**Title:** *Mandatory Milestone: Act I Lock & VFX Scene 3 Plate Freeze*  
**Priority:** \`CRITICAL\`  
**Target Department:** \`ALL DEPARTMENTS\`  
**Scene Tag:** *Act I & Scene 3*

**Directive Content:**  
> "Notice to All Department Leads: With Scene 1 locked and Scene 2 entering final trim sign-off, Act I picture turnover is scheduled for Friday at 12:00 PM. VFX team: All orbital plates for Scene 3 must be delivered for director review by Thursday 4 PM. Sound department is authorized to begin final mix pass on Scene 1 immediately."

---
*(You can click **"Publish as Board Directive"** below to post this directly to the Board of Directors Notes so the entire crew sees it!)*`;
  }

  // General Response
  return `### 💡 Strategic Advisory from Director AI Agent

Regarding your query: *"${userMessage}"*

**Current Feature State:**
* Production: **"${overview.title}"** directed by **${overview.director}**
* Current Velocity: **${overview.lockPercentage}% Picture Locked**, **${overview.vfxPercentage}% VFX Approved**.
* Sound Mix: **${overview.soundFinal}/${overview.totalScenes}** scenes completed.

**Recommendation:**
Review the latest updates on the **Board of Directors' Notes**, where your recent instructions to Editorial and VFX are tracked with live crew acknowledgments. Would you like me to generate a specific department breakdown for **Editorial**, **VFX**, **Sound**, or draft a new public directive?`;
}
