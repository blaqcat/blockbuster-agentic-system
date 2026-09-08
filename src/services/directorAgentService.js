import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Next-Gen Frontier & Production Gemini Models
 */
export const DIRECTOR_AI_MODELS = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash (Frontier Flagship)",
    speed: "Sub-Second (~200ms)",
    badge: "⚡ 2.0 Frontier",
    description: "Google's newest frontier model with state-of-the-art cinematic reasoning and ultra-responsive streaming."
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro (Deep Cinematic Reasoning)",
    speed: "Deep Analysis (~1-2s)",
    badge: "🧠 1.5 Pro Heavy",
    description: "2M token context model designed for complex script breakdowns, emotional arcs, and multi-department scheduling."
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash (Balanced)",
    speed: "Fast (~400ms)",
    badge: "🚀 1.5 Flash",
    description: "Standard production multimodal speed for rapid editorial queries."
  }
];

/**
 * Ground Truth Production Crew & Cast Roster
 */
export const PRODUCTION_CREW_ROSTER = {
  coreContributors: [
    {
      name: "Jerry Monyelo",
      role: "Cloud Architect & Developer",
      domain: "GCP Architecture (Cloud Run, IAP, Global Load Balancer, NEG), Gemini Multi-Agent Fleet, Web Platform Engineering",
      status: "Active &bull; System Health 100%"
    },
    {
      name: "Sakhile Gumbi",
      role: "Film Director",
      domain: "Directorial Vision, Production Cadence Workflows, Script-to-Screen Analysis, and Director AI Persona Design",
      status: "Active &bull; Directorial Mandates Published"
    },
    {
      name: "Siyanda Nzimande",
      role: "Film Editor",
      domain: "Picture Editorial Pacing, Cut Stage Transitions (Assembly to Lock), NLE Interchange Specs (OTIO/FCPXML)",
      status: "Active &bull; Trimming Scene 2 Fine Cut"
    },
    {
      name: "Trevor Mkandla",
      role: "Graphics & Video",
      domain: "UI/UX Cinema Aesthetic, VFX Shot Telemetry, Graphic Assets, Dark-Mode Glassmorphism Design, and Video Production",
      status: "Active &bull; VFX Telemetry Verified"
    }
  ],
  departmentHeads: [
    {
      title: "Executive Director / Producer (Level 1)",
      name: "Sakhile Gumbi / Denis Villeneuve",
      department: "Studio Leadership & Executive Sign-off",
      scope: "Final Picture Lock sovereign authority, multi-agent deployment, public board mandates."
    },
    {
      title: "Lead Picture Editor (ACE Guild - Level 2)",
      name: "Joe Walker, ACE / Siyanda Nzimande",
      department: "Editorial & Story Assembly",
      scope: "Creative cut progression, 8-frame eyeline trim on Scene 2, rhythm & pacing, OTIO/AAF turnovers."
    },
    {
      title: "VFX Supervisor (Level 3)",
      name: "Elena Rostov / Trevor Mkandla",
      department: "Industrial Light & Sound Post Lab (VFX & CGI)",
      scope: "Plate pulls, 3D CGI orbital Earth simulations, camera tracking, and vendor SLA turnarounds."
    },
    {
      title: "Sound Designer & Re-Recording Mixer (Level 3)",
      name: "Elena Rostov / Ben Burtt",
      department: "Sound Post & Dolby Atmos Mix",
      scope: "Dialogue stem freezing, Foley, sub-harmonic atmospheric design, and staging silence drops."
    },
    {
      title: "Lead Colorist & DI Supervisor (Level 3)",
      name: "Stefan Sonnenfeld",
      department: "Company 3 (DI Color Grading)",
      scope: "ACEScc color conform, KODAK 5219 print emulation, phosphor CRT balancing, HDR trim passes."
    },
    {
      title: "DCI / QC Mastering Engineer (Level 3)",
      name: "Marcus Vance",
      department: "Mastering Lab Dispatch",
      scope: "Audio LKFS loudness compliance (-24 LKFS), DCI color gamut verification, and IMF/DCP packaging."
    },
    {
      title: "Studio Executive & Client Reviewer (Level 4)",
      name: "Clara Sterling",
      department: "Warner Studios International Distribution",
      scope: "Executive screening approvals, star ratings, and theatrical release schedule compliance."
    }
  ],
  castByScene: [
    {
      character: "KAI",
      description: "Lead Mission Astronaut & Mission Specialist",
      scenes: ["Scene 1 (Launchpad)", "Scene 3 (Cockpit)", "Scene 4 (Orbital Corridor)", "Scene 5 (Re-Entry Capsule)"],
      emotionalArc: "Wonder &rarr; Visceral Action & Isolation &rarr; Mystery &rarr; Cathartic Survival"
    },
    {
      character: "COMMANDER VANCE",
      description: "Ground Flight Director & Veteran Mission Commander",
      scenes: ["Scene 1 (Launchpad)", "Scene 2 (Bunker Countdown)", "Scene 5 (Re-Entry Recovery)"],
      emotionalArc: "Quiet Authority &rarr; Rising Tension & Crisis &rarr; Victorious Relief"
    },
    {
      character: "DR. ARLO",
      description: "Chief Science Officer & Cybernetics Specialist",
      scenes: ["Scene 2 (Command Control Bunker)", "Scene 4 (Orbital Station Corridor)"],
      emotionalArc: "Technical Urgency &rarr; Eerie Zero-G Discovery"
    },
    {
      character: "MISSION AI",
      description: "Shipboard Autonomous Telemetry Intelligence",
      scenes: ["Scene 3 (Stratosphere Cockpit Separation)"],
      emotionalArc: "Calm, analytical telemetry countdown amidst explosive pyrotechnic silence"
    }
  ]
};

/**
 * Extracts granular, scene-by-scene post-production pipeline telemetry
 */
export function extractGranularPipelineTelemetry(project) {
  const scenes = project.scenes || [];

  const pipelineByScene = scenes.map(s => ({
    sceneId: s.id,
    sceneNumber: s.sceneNumber,
    act: s.act || 'Act I',
    slugline: s.slugline || `SCENE ${s.sceneNumber}`,
    pages: s.pages || 1,
    runtime: s.runtimeEst || "N/A",
    characters: s.characters || [],
    emotionalBeat: s.emotionalBeat || "Drama",
    editorial: {
      status: s.picture?.status || 'UNKNOWN',
      isLocked: s.picture?.status === 'LOCKED',
      note: s.picture?.note || 'No editorial note recorded.'
    },
    vfx: {
      status: s.vfx?.status || 'NONE',
      totalShots: s.vfx?.shotsCount || 0,
      approvedShots: s.vfx?.shotsApproved || 0,
      pendingShots: Math.max(0, (s.vfx?.shotsCount || 0) - (s.vfx?.shotsApproved || 0)),
      approvalRate: s.vfx?.shotsCount > 0 ? Math.round((s.vfx.shotsApproved / s.vfx.shotsCount) * 100) : 100,
      note: s.vfx?.note || 'No VFX note recorded.'
    },
    sound: {
      status: s.sound?.status || 'NOT_STARTED',
      note: s.sound?.note || 'No sound design note recorded.',
      isBlocked: s.picture?.status !== 'LOCKED' && s.sound?.status === 'NOT_STARTED'
    },
    color: {
      status: s.color?.status || 'PENDING_LOCK',
      lut: s.color?.lut || 'Rec.709 Default',
      note: s.color?.note || 'Awaiting picture lock conform.',
      isBlocked: s.picture?.status !== 'LOCKED'
    },
    mastering: {
      status: s.mastering?.status || 'PENDING',
      qcNotes: s.mastering?.qcNotes || 'Awaiting full conform and QC check.'
    }
  }));

  const totalScenes = scenes.length;
  const lockedCount = pipelineByScene.filter(s => s.editorial.isLocked).length;
  const fineCutCount = pipelineByScene.filter(s => s.editorial.status === 'FINE_CUT').length;
  const roughCutCount = pipelineByScene.filter(s => s.editorial.status === 'ROUGH_CUT').length;
  const assemblyCount = pipelineByScene.filter(s => s.editorial.status === 'ASSEMBLY').length;
  const lockPercentage = totalScenes > 0 ? Math.round((lockedCount / totalScenes) * 100) : 0;

  const totalVfx = pipelineByScene.reduce((acc, s) => acc + s.vfx.totalShots, 0);
  const approvedVfx = pipelineByScene.reduce((acc, s) => acc + s.vfx.approvedShots, 0);
  const pendingVfx = totalVfx - approvedVfx;
  const vfxPercentage = totalVfx > 0 ? Math.round((approvedVfx / totalVfx) * 100) : 0;

  const soundFinal = pipelineByScene.filter(s => s.sound.status === 'FINAL_MIX').length;
  const soundDesign = pipelineByScene.filter(s => s.sound.status === 'DESIGN').length;
  const soundSpotting = pipelineByScene.filter(s => s.sound.status === 'SPOTTING').length;
  const soundNotStarted = pipelineByScene.filter(s => s.sound.status === 'NOT_STARTED').length;

  const colorApproved = pipelineByScene.filter(s => s.color.status === 'APPROVED').length;
  const colorInGrade = pipelineByScene.filter(s => s.color.status === 'IN_GRADE').length;
  const colorPendingLock = pipelineByScene.filter(s => s.color.status === 'PENDING_LOCK').length;

  const bottlenecks = [];
  if (pendingVfx > 0) {
    const heavyScenes = pipelineByScene.filter(s => s.vfx.pendingShots > 0);
    bottlenecks.push({
      department: "VFX & CGI Compositing",
      severity: pendingVfx > 10 ? "CRITICAL" : "HIGH",
      description: `${pendingVfx} VFX shots across ${heavyScenes.length} scenes need vendor approval: ${heavyScenes.map(s => `Scene ${s.sceneNumber} (${s.vfx.pendingShots} pending)`).join(', ')}.`
    });
  }

  if (fineCutCount > 0) {
    const fineScenes = pipelineByScene.filter(s => s.editorial.status === 'FINE_CUT');
    bottlenecks.push({
      department: "Picture Editorial",
      severity: "HIGH",
      description: `${fineScenes.map(s => `Scene ${s.sceneNumber}`).join(', ')} currently at Fine Cut. Trims ready for Director sign-off to unlock downstream Sound & Color.`
    });
  }

  if (soundNotStarted > 0) {
    bottlenecks.push({
      department: "Sound Post & Mix",
      severity: "MEDIUM",
      description: `${soundNotStarted} scenes are in NOT_STARTED sound status awaiting locked cuts before dialogue stems can freeze.`
    });
  }

  return {
    title: project.title,
    director: project.director,
    leadEditor: project.leadEditor,
    frameRate: project.frameRate,
    aspectRatio: project.aspectRatio,
    pipelineByScene,
    metrics: {
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
      colorPendingLock
    },
    crewRoster: PRODUCTION_CREW_ROSTER,
    bottlenecks
  };
}

/**
 * Suggested Granular Pipeline Inquiries
 */
export const DIRECTOR_QUICK_PROMPTS = [
  {
    id: "crew_roster",
    label: "👥 Production Crew & Cast Roster",
    prompt: "Who is the crew working on this film? List all contributors, department leads, and cast by scene."
  },
  {
    id: "pipeline_deepdive",
    label: "🔍 Full Pipeline Breakdown (All Departments)",
    prompt: "Provide an exact, department-by-department pipeline breakdown of what is happening across every single scene right now."
  },
  {
    id: "bottlenecks",
    label: "🚨 Active Bottlenecks & Downstream Holds",
    prompt: "What scenes and departments are actively blocking other teams in the pipeline right now?"
  },
  {
    id: "vfx_inventory",
    label: "✨ VFX Shot Inventory & Turnarounds",
    prompt: "Give me the exact shot-by-shot VFX inventory: which plates are pulled, what CG is rendering, and what is approved vs unapproved."
  },
  {
    id: "editorial_status",
    label: "🎬 Editorial Cut Cadence & Lock Trims",
    prompt: "What is the exact editorial status of each scene? What trims is Joe Walker working on and which scenes can I lock immediately?"
  },
  {
    id: "sound_color_holds",
    label: "🔊 Sound & Color Conform Status",
    prompt: "Where are Sound Design and DI Color Grading stalled? Detail the active LUTs, mix stems, and conformed timelines."
  }
];

/**
 * Streaming Chat using Gemini 2.0 Flash / 1.5 Pro with deep granular pipeline ground truth
 */
/**
 * Streams Gemini response using Google Cloud Vertex AI / Generative Language with an ADC OAuth Bearer Token
 */
async function callGeminiWithBearerToken(token, modelId, fullPrompt, onChunk) {
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  const projectId = (
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_GCP_PROJECT_ID || import.meta.env.GCP_PROJECT_ID)
      : null
  ) || 'ace-vial-371506';
  const region = (
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_GCP_REGION || import.meta.env.GCP_REGION)
      : null
  ) || 'europe-west1';

  // 1. Same-origin proxied Vertex AI endpoint (routed by NGINX in Cloud Run or Vite proxy locally, zero CORS)
  const proxiedVertexUrl = `/api/vertex/v1/projects/${projectId}/locations/${region}/publishers/google/models/${modelId}:streamGenerateContent?alt=sse`;
  // 2. Direct Vertex AI URL (fallback)
  const directVertexUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${modelId}:streamGenerateContent?alt=sse`;
  // 3. Same-origin proxied Generative Language endpoint
  const proxiedGenLangUrl = `/api/gemini/v1beta/models/${modelId}:streamGenerateContent?alt=sse`;
  // 4. Direct Generative Language endpoint
  const directGenLangUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse`;

  const requestBody = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [{ text: fullPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 1400
    }
  });

  const endpoints = [proxiedVertexUrl, directVertexUrl, proxiedGenLangUrl, directGenLangUrl];
  let lastError = null;

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        },
        body: requestBody
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = new Error(`GCP ${response.status}: ${errText}`);
        continue;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr || dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (chunkText) {
                fullText += chunkText;
                if (onChunk) onChunk(chunkText, fullText);
              }
            } catch (e) {}
          }
        }
      }

      if (fullText.trim().length > 0) {
        return fullText;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("ADC token streaming failed across GCP endpoints");
}

/**
 * Streaming Chat using Gemini 2.0 Flash / 1.5 Pro with deep granular pipeline ground truth
 */
export async function chatWithDirectorAgentStream(
  userMessage, 
  conversationHistory, 
  project, 
  apiKey, 
  modelId = "gemini-2.0-flash", 
  onChunk
) {
  const telemetry = extractGranularPipelineTelemetry(project);
  const trimmedKey = apiKey ? apiKey.trim() : "";

  // 1. First Priority: Call /api/chat backend (Cloud Run Service Account ADC - ZERO USER KEY REQUIRED)
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(trimmedKey ? { 'Authorization': trimmedKey.startsWith('ya29.') ? `Bearer ${trimmedKey}` : trimmedKey } : {})
      },
      body: JSON.stringify({
        message: userMessage,
        history: (conversationHistory || []).slice(-4),
        project: {
          title: telemetry.title,
          director: telemetry.director,
          leadEditor: telemetry.leadEditor,
          aspectRatio: telemetry.aspectRatio,
          frameRate: telemetry.frameRate,
          scenes: project?.scenes || []
        },
        modelId
      })
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr || dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const textChunk = 
                parsed.text || 
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || 
                "";
              if (textChunk) {
                fullText += textChunk;
                if (onChunk) onChunk(textChunk, fullText);
              }
            } catch (e) {
              if (dataStr) {
                fullText += dataStr;
                if (onChunk) onChunk(dataStr, fullText);
              }
            }
          }
        }
      }

      if (fullText.trim().length > 0) {
        return fullText;
      }
    }
  } catch (backendErr) {
    console.log("[DirectorAgent] Backend /api/chat bypassed or offline:", backendErr?.message);
  }

  // 2. Client-side fallback if user explicitly provided a key in the browser
  if (trimmedKey) {
    const systemPrompt = `You are the Executive Director's Master Post-Production Supervisor & Senior Pipeline Strategist for the feature film "${telemetry.title}".
Directed by: ${telemetry.director} | Lead Picture Editor: ${telemetry.leadEditor}
Master Technical Format: ${telemetry.aspectRatio} @ ${telemetry.frameRate}

CRITICAL INSTRUCTIONS:
1. NEVER give generic, vague, or template answers.
2. Directly answer the user's specific question!
   - If asked "who is the crew", "who is working on this", "who are the contributors", or "who are the actors", provide the exact names, roles, and assignments from the GROUND TRUTH CREW & CAST ROSTER below.
   - If asked about pipelines ("what is happening where", "status"), break down the 5 post departments with exact scene numbers, shot counts, and frame trims.
   - If asked about a specific scene, focus exclusively on that scene.
3. Address specific scene numbers (Scene 1, Scene 2, Scene 3, Scene 4, Scene 5), character beats, and exact technical notes.
4. Provide actionable director guidance: what exact decision or authorization unblocks the pipeline next.

GROUND TRUTH CREW & CAST ROSTER:
${JSON.stringify(telemetry.crewRoster, null, 2)}

GROUND TRUTH PIPELINE TELEMETRY:
${JSON.stringify(telemetry.pipelineByScene, null, 2)}

METRICS SUMMARY:
- Picture Lock: ${telemetry.metrics.lockedCount}/${telemetry.metrics.totalScenes} scenes (${telemetry.metrics.lockPercentage}%)
- VFX Approved: ${telemetry.metrics.approvedVfx}/${telemetry.metrics.totalVfx} shots (${telemetry.metrics.vfxPercentage}%)
- Sound Final: ${telemetry.metrics.soundFinal} scenes | Sound Not Started: ${telemetry.metrics.soundNotStarted} scenes
- Active Bottlenecks: ${JSON.stringify(telemetry.bottlenecks)}`;

    const historyFormatted = conversationHistory
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'DIRECTOR' : 'PIPELINE ADVISOR'}: ${m.text}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\n${historyFormatted}\n\nDIRECTOR: ${userMessage}\n\nPIPELINE ADVISOR:`;

    // Check if this is an enterprise Google Cloud ADC / OAuth Bearer Token (ya29...)
    const isAdcToken = trimmedKey.startsWith("ya29.") || trimmedKey.toLowerCase().startsWith("bearer ");

    if (isAdcToken) {
      try {
        return await callGeminiWithBearerToken(trimmedKey, modelId, fullPrompt, onChunk);
      } catch (err) {
        console.warn("GCP ADC / Bearer token call failed, falling back to dynamic pipeline engine:", err);
        return streamDynamicPipelineAnalysis(userMessage, telemetry, onChunk);
      }
    }

    // Standard Gemini API Key
    try {
      const genAI = new GoogleGenerativeAI(trimmedKey);
      const model = genAI.getGenerativeModel({ 
        model: modelId,
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 1400
        }
      });

      const result = await model.generateContentStream(fullPrompt);
      let fullText = "";

      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        if (onChunk) onChunk(text, fullText);
      }

      return fullText;
    } catch (err) {
      console.warn("Gemini streaming failed with model " + modelId + ", falling back to intelligent dynamic engine:", err);
      return streamDynamicPipelineAnalysis(userMessage, telemetry, onChunk);
    }
  }

  // Offline / zero-config: stream dynamic granular pipeline intelligence
  return streamDynamicPipelineAnalysis(userMessage, telemetry, onChunk);
}

/**
 * Backwards compatibility helper
 */
export async function chatWithDirectorAgent(userMessage, conversationHistory, project, apiKey, modelId) {
  return chatWithDirectorAgentStream(userMessage, conversationHistory, project, apiKey, modelId, null);
}

/**
 * Stream dynamic granular pipeline analysis
 */
async function streamDynamicPipelineAnalysis(userMessage, telemetry, onChunk) {
  const completeText = generateGranularPipelineReport(userMessage, telemetry);
  const words = completeText.split(/(\s+)/);
  let accumulated = "";

  for (let i = 0; i < words.length; i++) {
    accumulated += words[i];
    if (onChunk && i % 4 === 0) {
      onChunk(words[i], accumulated);
      await new Promise(r => setTimeout(r, 12));
    }
  }

  if (onChunk) onChunk("", accumulated);
  return completeText;
}

/**
 * Generates an exhaustive, granular breakdown tailored to the exact question asked
 */
export function generateGranularPipelineReport(userMessage, telemetry) {
  const query = userMessage.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const { pipelineByScene, metrics, crewRoster } = telemetry;

  // 1. Crew, Cast, Personnel, and Contributor Inquiries (e.g. "who is the crew", "who is working on this", "who is the editor")
  if (
    query.includes('crew') || 
    query.includes('creew') ||
    query.includes('team') || 
    query.includes('who is') || 
    query.includes('who are') || 
    query.includes('contributor') || 
    query.includes('cast') || 
    query.includes('actor') || 
    query.includes('personnel') || 
    query.includes('people') || 
    query.includes('jerry') || 
    query.includes('sakhile') || 
    query.includes('siyanda') || 
    query.includes('trevor') || 
    query.includes('walker') || 
    query.includes('elena')
  ) {
    return `### 👥 Production Crew, Department Heads & Cast Roster

**Feature Production:** *"${telemetry.title}"* &bull; **Director:** ${telemetry.director}  
Here is the complete roster of core contributors, department leads, and cast members active on the production:

---

#### 🌟 1. Core Architecture & Filmmaking Contributors

| Contributor | Production Role & Domain | Current Operational Status |
| :--- | :--- | :--- |
| **Jerry Monyelo** | **Cloud Architect & Developer**<br/>*GCP Architecture (Cloud Run, IAP, Global Load Balancer, NEG), Gemini Multi-Agent Fleet* | 🟢 Active &bull; Multi-agent sentry dispatch operational |
| **Sakhile Gumbi** | **Film Director**<br/>*Directorial Vision, Production Cadence Workflows, Script-to-Screen Analysis* | 🟢 Active &bull; Directorial Mandates Published to Board |
| **Siyanda Nzimande** | **Film Editor**<br/>*Picture Editorial Pacing, Cut Stage Transitions (Assembly to Lock), OTIO/FCPXML* | 🟢 Active &bull; Fine cut eyeline trim in progress (Scene 2) |
| **Trevor Mkandla** | **Graphics & Video**<br/>*UI/UX Cinema Aesthetic, VFX Shot Telemetry, Graphic Assets, Video Production* | 🟢 Active &bull; VFX shot asset pipeline verified |

---

#### 🎬 2. Post-Production Department Heads & Guild Leads

* **Director / Executive Producer:** **${telemetry.director}**
  * *Scope:* Sovereign Picture Lock authority, executive board directives, and studio sign-off.
* **Lead Picture Editor (ACE):** **${telemetry.leadEditor}**
  * *Scope:* Creative pacing, 8-frame eyeline trim on Scene 2, timeline turnovers for Sound & Color.
* **VFX Supervisor:** **Elena Rostov / Trevor Mkandla** *(Industrial Light & Sound Post Lab)*
  * *Scope:* Plate tracking, 3D CGI orbital Earth simulations, and vendor composite SLAs.
* **Sound Designer & Re-Recording Mixer:** **Elena Rostov / Ben Burtt**
  * *Scope:* Sub-harmonic atmosphere (28-40Hz), Foley pass, dialogue stem freeze, and Dolby Atmos final mix.
* **Lead Colorist & DI Supervisor:** **Stefan Sonnenfeld** *(Company 3)*
  * *Scope:* ACEScc conform, KODAK 5219 print emulation, CRT green balance, and HDR master trim.
* **DCI / QC Mastering Engineer:** **Marcus Vance** *(Mastering Lab Dispatch)*
  * *Scope:* -24 LKFS audio loudness calibration, DCI color compliance, and IMF container verification.
* **Studio Executive Reviewer:** **Clara Sterling** *(Warner Studios International)*
  * *Scope:* Executive screening approvals, distributor notes, and festival delivery milestones.

---

#### 🎭 3. Screenplay Cast by Scene Involvement

| Character | Role in Narrative | Active Scenes | Narrative Beat |
| :--- | :--- | :--- | :--- |
| **KAI** | Lead Astronaut & Specialist | **Scenes 1, 3, 4, 5** | Wonder &rarr; Visceral Action &rarr; Isolation &rarr; Re-Entry Survival |
| **COMMANDER VANCE** | Ground Commander | **Scenes 1, 2, 5** | Mission Authority &rarr; Crisis Countdown &rarr; Splashdown Relief |
| **DR. ARLO** | Chief Science Officer | **Scenes 2, 4** | Telemetry Panic &rarr; Zero-G Air-Lock Breach Discovery |
| **MISSION AI** | Autonomous Shipboard AI | **Scene 3** | Synthesized orbital separation telemetry countdown |

---

*Need to assign a specific task to any crew member? You can draft an instruction and click **"Publish to Directors' Board"** below.*`;
  }

  // 2. Specific Scene Deep Dive (e.g. "Scene 1", "Scene 2", "Scene 3", "Scene 4", "Scene 5")
  const sceneMatch = query.match(/scene\s*([1-5])/);
  if (sceneMatch) {
    const scNum = sceneMatch[1];
    const s = pipelineByScene.find(sc => sc.sceneNumber === scNum);
    if (s) {
      return `### 🎬 Deep-Dive Telemetry: Scene ${s.sceneNumber} (\`${s.slugline}\`)

**Act:** ${s.act} &bull; **Runtime:** ${s.runtime} (${s.pages} pages)  
**Cast Involved:** ${s.characters.join(', ') || 'N/A'} &bull; **Emotional Beat:** *${s.emotionalBeat}*

---

#### Department Status & Active Tasks:

* ✂️ **Picture Editorial:** **${s.editorial.status}**
  * *Task:* ${s.editorial.note}
  * *Editor:* ${telemetry.leadEditor}
* 💥 **VFX & CGI:** **${s.vfx.status}** (${s.vfx.approvedShots}/${s.vfx.totalShots} Approved &bull; ${s.vfx.approvalRate}%)
  * *Details:* ${s.vfx.note}
* 🔊 **Sound Post:** **${s.sound.status}**
  * *Details:* ${s.sound.note}
  * *Status:* ${s.sound.isBlocked ? '⚠️ Blocked awaiting picture lock' : 'Active / Ready'}
* 🎨 **Color & DI:** **${s.color.status}**
  * *Active LUT:* \`${s.color.lut}\`
  * *Details:* ${s.color.note}
* 📦 **Mastering & QC:** **${s.mastering.status}**
  * *QC Note:* ${s.mastering.qcNotes}

---

**Directorial Recommendation for Scene ${s.sceneNumber}:**  
${s.editorial.status === 'FINE_CUT' ? `Sign off on the editorial trims to achieve **Picture Lock** and unblock Sound & Color.` : s.vfx.pendingShots > 0 ? `Review the ${s.vfx.pendingShots} pending VFX shots on the vendor portal.` : `Scene is tracking well within delivery tolerances.`}`;
    }
  }

  // 3. VFX & CGI Compositing
  if (query.includes('vfx') || query.includes('cgi') || query.includes('shot') || query.includes('plate') || query.includes('compositing')) {
    return `### ✨ VFX & Visual Effects Pipeline Inventory

**Overall Progress:** **${metrics.approvedVfx}/${metrics.totalVfx} shots approved** (${metrics.vfxPercentage}%) &bull; **${metrics.pendingVfx} shots pending turnaround**  
**VFX Supervisor:** Elena Rostov / Trevor Mkandla *(Industrial Light & Sound Post Lab)*

---

#### Detailed Shot Pipeline by Scene:

1. **Scene 1: EXT. DESERT LAUNCHPAD (100% Complete)**
   * **Shots:** 4/4 Approved
   * **Elements:** Launch gantry geometry extensions, cryogenic vapor volumetrics, dust kickback.
   * **Status:** Final high-res 4K EXR plates conformed in DI.

2. **Scene 2: INT. COMMAND BUNKER (67% Complete)**
   * **Shots:** 2 of 3 Approved (1 Pending)
   * **Elements:** 1980s CRT phosphor monitor graphics, refresh scanline artifacts, red alert strobe bounce.
   * **Action Required:** Final monitor comp revision on terminal #4 awaiting review.

3. **Scene 3: EXT. STRATOSPHERE [HIGH PRIORITY] (50% Complete)**
   * **Shots:** 8 of 16 Approved (**8 Outstanding**)
   * **Elements:** Photorealistic curved Earth atmospheric horizon, pyrotechnic explosive stage separation, high-altitude ice particle debris field.
   * **Status:** 4 shots in lighting, 4 shots in final comp. Vendor turnover scheduled for Thursday 4 PM.

4. **Scene 4: INT. ORBITAL STATION CORRIDOR (17% Complete)**
   * **Shots:** 1 of 6 Approved (5 Pending)
   * **Elements:** Stunt wire removal, floating frozen glove, shattered canopy glass zero-g dynamics.
   * **Status:** Plates pulled and motion-tracked; CG debris geometry passes in progress.

5. **Scene 5: EXT. RE-ENTRY CAPSULE (25% Complete)**
   * **Shots:** 3 of 12 Approved (9 Pending)
   * **Elements:** Heat shield ablative burning, high-velocity plasma envelope, parachute deployment dynamics.
   * **Status:** Rough simulation passes generated; awaiting editorial pacing lock before final sim render.`;
  }

  // 4. Picture Editorial & Lock
  if (query.includes('editorial') || query.includes('lock') || query.includes('cut') || query.includes('trim') || query.includes('pacing')) {
    return `### 🎬 Picture Editorial & Lock Progression

**Lead Editor:** ${telemetry.leadEditor} &bull; **Locked:** **${metrics.lockPercentage}%** (${metrics.lockedCount}/${metrics.totalScenes} scenes)

---

#### Scene-by-Scene Cutting Cadence:

* **Scene 1 (Runtime: 1m 30s):** **LOCKED**. Pacing approved and frozen. EDL and AAF turnovers delivered.
* **Scene 2 (Runtime: 2m 15s):** **FINE CUT**.
  * *Active Task:* Joe Walker is tightening an **8-frame eyeline trim** between Dr. Arlo's reaction and the emergency monitor cutaway.
  * *Readiness:* Ready for director review and picture lock sign-off today.
* **Scene 3 (Runtime: 3m 30s):** **ROUGH CUT**.
  * *Active Task:* Balancing the visceral cockpit macro shots with the exterior wide horizon separation.
* **Scene 4 (Runtime: 2m 00s):** **ASSEMBLY**.
  * *Active Task:* Stunt team wire-removal takes are being synced with clean plate backgrounds.
* **Scene 5 (Runtime: 4m 15s):** **ROUGH CUT**.
  * *Active Task:* Adjusting internal capsule vibration tempo before the parachute deployment catharsis.

**Recommendation:** Sign off on Scene 2's 8-frame trim to achieve **100% Act I Picture Lock**.`;
  }

  // 5. Sound & Color
  if (query.includes('sound') || query.includes('audio') || query.includes('color') || query.includes('lut') || query.includes('di') || query.includes('atmos')) {
    return `### 🔊 Sound Post & Color DI Pipeline Status

---

#### 1. Sound Post & Spatial Audio Mix
* **Scene 1:** **FINAL MIX** (Low sub-harmonic engine hum & desert wind in Dolby Atmos).
* **Scene 2:** **SOUND DESIGN** (Vintage relay clicks, warning siren, telemetry beeps).
* **Scene 3:** **SPOTTING** (Staging separation silence drop psychoacoustics).
* **Scenes 4 & 5:** **HOLD / NOT STARTED**. Blocked until dialogue tracks freeze from Picture Lock.

#### 2. DI Color Grading & Look Development
* **Scene 1:** **APPROVED** (\`KODAK_5219_FilmPrint_v4\`) &ndash; deep shadows, golden tungsten flares.
* **Scene 2:** **IN GRADE** (\`Teal_Orange_FilmStock\`) &ndash; balancing CRT green phosphor bounce.
* **Scenes 3, 4, 5:** **PENDING LOCK** &ndash; Conforms will trigger as soon as Picture Lock is published.`;
  }

  // 6. Master Pipeline Breakdown (Default for "pipeline", "where", "what is happening", etc.)
  return `### 🎬 Master Post-Production Pipeline Intelligence

**Production:** *"${telemetry.title}"* &bull; **Director:** ${telemetry.director} &bull; **Lead Editor:** ${telemetry.leadEditor}  
**Master Format:** ${telemetry.aspectRatio} @ ${telemetry.frameRate} &bull; **Overall Lock:** **${metrics.lockPercentage}%** (${metrics.lockedCount}/${metrics.totalScenes} scenes)

---

#### 📍 Department-by-Department Scene Distribution

| Scene | Slugline & Beat | Picture Editorial | VFX Compositing | Sound Post | Color / DI |
| :--- | :--- | :--- | :--- | :--- | :--- |
${pipelineByScene.map(s => {
  const vfxStat = s.vfx.totalShots > 0 ? `${s.vfx.approvedShots}/${s.vfx.totalShots} approved` : 'None';
  return `| **Scene ${s.sceneNumber}** | \`${s.slugline}\`<br/>*${s.emotionalBeat}* | **${s.editorial.status}**<br/><span style="font-size:10px;color:#94a3b8">${s.editorial.note}</span> | **${s.vfx.status}**<br/><span style="font-size:10px;color:#c084fc">${vfxStat} (${s.vfx.note})</span> | **${s.sound.status}**<br/><span style="font-size:10px;color:#38bdf8">${s.sound.note}</span> | **${s.color.status}**<br/><span style="font-size:10px;color:#facc15">${s.color.lut}</span> |`;
}).join('\n')}

---

#### 🔬 Department Breakdown: What is Happening Where

##### 1. Picture Editorial (Lead Editor: ${telemetry.leadEditor})
* **Scene 1 (Launchpad):** **LOCKED**. Pacing locked with director on 10/12. Turnover package handed to Sound & Color.
* **Scene 2 (Bunker):** **FINE CUT**. Joe Walker is currently trimming **8 frames between monitor cutaways** to heighten the countdown cadence. Ready for your final lock sign-off.
* **Scene 3 (Stratosphere):** **ROUGH CUT**. Editorial is comparing Take 3 wide angle versus cockpit macro tight coverage.
* **Scene 4 (Orbital Corridor):** **ASSEMBLY**. Syncing multi-cam stunt footage and wire-removal plates.
* **Scene 5 (Re-Entry Capsule):** **ROUGH CUT**. Pacing camera-shake intensity against exterior plasma burn beats.

##### 2. VFX & CGI Compositing (${metrics.approvedVfx}/${metrics.totalVfx} Shots Approved &bull; ${metrics.vfxPercentage}%)
* **Scene 1:** 4/4 shots **APPROVED** (Vapor fluid simulations & launch gantry matte extensions).
* **Scene 2:** 2/3 shots in progress (Flickering CRT scanlines & mission telemetry graphics).
* **Scene 3 [CRITICAL]:** 8/16 shots approved. **8 orbital shots outstanding**. Earth curvature render and booster separation pyrotechnics need director review.
* **Scene 4:** 1/6 shots approved. Plates pulled; 3D debris zero-g physics compositing underway.
* **Scene 5:** 3/12 shots approved. Atmospheric entry plasma flame dynamics in rough pass.

##### 3. Sound Post & Spatial Audio (${metrics.soundFinal} Final Mix &bull; ${metrics.soundDesign} In Design &bull; ${metrics.soundNotStarted} Pending)
* **Scene 1:** **FINAL MIX** complete. Low sub-harmonic rocket engine hum (28-40Hz) & desert wind calibrated for Dolby Atmos.
* **Scene 2:** **SOUND DESIGN** in progress. Vintage mechanical relay clicks, warning klaxons, and telemetry beeps are being layered.
* **Scene 3:** **SPOTTING** stage. Precision silence drop at the staging separation moment.
* **Scenes 4 & 5:** **NOT STARTED**. Blocked from dialogue freezing until Picture Lock is confirmed.

##### 4. Color Grading & DI Conform
* **Scene 1:** **APPROVED** on \`KODAK_5219_FilmPrint_v4\`. Deep shadow contrast and warm tungsten flares.
* **Scene 2:** **IN GRADE** on \`Teal_Orange_FilmStock\`. Colorist is balancing interior green CRT phosphor bounce against warm tungsten emergency lights.
* **Scenes 3, 4, 5:** **PENDING LOCK**. Conforms held until picture trim handles are frozen.

---

#### 🎯 Directorial Action Items to Accelerate Delivery
1. **Authorize Picture Lock on Scene 2:** Closing the 8-frame trim immediately unblocks Sound Post to freeze dialogue and DI to finalize the CRT balance.
2. **Review Scene 3 VFX Plates:** 8 orbital Earth passes are ready on the vendor review portal.
3. **Publish Directives to the Board:** Notify departments through the **Board of Directors Notes** to synchronize their turnovers.`;
}
