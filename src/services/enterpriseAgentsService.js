import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Enterprise Multi-Agent Configuration for Film Post-Production
 */
export const ENTERPRISE_AGENTS_CONFIG = [
  {
    id: "agent_supervisor",
    name: "Master Post Supervisor Agent",
    role: "Orchestrator & Milestone Sentry",
    department: "All Departments",
    icon: "ShieldAlert",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    description: "Evaluates cross-department blockers, festival delivery dates, and orchestrates sub-agents."
  },
  {
    id: "agent_picture",
    name: "Editorial Cut Sentry",
    role: "Picture Department Runner",
    department: "Picture Editing",
    icon: "Film",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    description: "Monitors scene assemblies, detects unaddressed director notes, and pushes for Picture Lock."
  },
  {
    id: "agent_sound",
    name: "Sound & Mix Dispatcher",
    role: "Audio Post Runner",
    department: "Sound Post",
    icon: "Volume2",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    description: "Tracks spotting sheets, ADR cue readiness, Foley logs, and final 5.1/Dolby Atmos delivery."
  },
  {
    id: "agent_vfx",
    name: "VFX Pipeline Warden",
    role: "VFX & CGI Vendor Tracker",
    department: "VFX & Graphics",
    icon: "Sparkles",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    description: "Audits plate pulls, composite turnarounds, vendor turnaround SLAs, and director sign-offs."
  },
  {
    id: "agent_color",
    name: "Color Conform Auditor",
    role: "DI & Colorist Runner",
    department: "Color & Grading",
    icon: "Palette",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    description: "Verifies CDL/EDL conforms against locked cuts, look-dev LUTs, and HDR trim passes."
  },
  {
    id: "agent_mastering",
    name: "DCI / QC Compliance Inspector",
    role: "Mastering & Deliverables Sentry",
    department: "Mastering & QC",
    icon: "CheckCircle2",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    description: "Runs automated loudness tests (-24 LKFS), dead-pixel detection, and IMF/DCP packaging audits."
  }
];

/**
 * Runs an autonomous audit across all scenes and generates department reminders using Gemini
 */
export async function runEnterpriseAgentAudit(project, apiKey) {
  if (apiKey && apiKey.trim()) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are the Google Cloud Gemini Enterprise Multi-Agent Film Orchestrator for the production "${project.title}".
Analyze the project scenes and department statuses below. Identify bottlenecks, delays, and critical reminders for Picture, Sound, VFX, Color, and Mastering.

Return ONLY a valid JSON array of actionable reminder objects with this exact schema:
[
  {
    "id": "rem_1",
    "agentId": "agent_vfx",
    "agentName": "VFX Pipeline Warden",
    "targetDepartment": "VFX & Graphics",
    "recipient": "Lead VFX Vendor / Supervisor",
    "channel": "Slack / Google Chat #vfx-turnaround",
    "priority": "HIGH",
    "sceneNumber": "3",
    "message": "Detailed reminder message with specific scene requirements and turnaround deadline",
    "status": "QUEUED"
  }
]

Project Data:
${JSON.stringify(project.scenes, null, 2)}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanJson = response.text().trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Gemini Enterprise Agent API fallback:", e);
    }
  }

  // Fallback intelligent agentic rule engine
  return generateSimulatedReminders(project);
}

function generateSimulatedReminders(project) {
  const reminders = [];
  let idCounter = 1;

  project.scenes.forEach(s => {
    // Picture Edit Reminders
    if (s.picture.status === 'ASSEMBLY' || s.picture.status === 'ROUGH_CUT') {
      reminders.push({
        id: `rem_${idCounter++}`,
        agentId: "agent_picture",
        agentName: "Editorial Cut Sentry",
        targetDepartment: "Picture Editing",
        recipient: "Lead Editor (Joe Walker, ACE)",
        channel: "Google Chat #editorial-war-room",
        priority: s.picture.status === 'ASSEMBLY' ? "HIGH" : "MEDIUM",
        sceneNumber: s.sceneNumber,
        message: `Scene ${s.sceneNumber} (${s.slugline}) is in ${s.picture.status}. Director requested fine cut review for '${s.emotionalBeat}'. Pushing for picture lock.`,
        status: "QUEUED"
      });
    }

    // VFX Reminders
    if (s.vfx.shotsCount > s.vfx.shotsApproved) {
      const pending = s.vfx.shotsCount - s.vfx.shotsApproved;
      reminders.push({
        id: `rem_${idCounter++}`,
        agentId: "agent_vfx",
        agentName: "VFX Pipeline Warden",
        targetDepartment: "VFX & Graphics",
        recipient: "VFX Producer & Comp Lead",
        channel: "Slack #vfx-deliveries-ilm",
        priority: pending > 5 ? "URGENT" : "HIGH",
        sceneNumber: s.sceneNumber,
        message: `Scene ${s.sceneNumber} has ${pending} pending VFX shots out of ${s.vfx.shotsCount}. Turnaround required for Director screening.`,
        status: "QUEUED"
      });
    }

    // Color & Conform Reminders
    if (s.picture.status === 'LOCKED' && s.color.status === 'PENDING_LOCK') {
      reminders.push({
        id: `rem_${idCounter++}`,
        agentId: "agent_color",
        agentName: "Color Conform Auditor",
        targetDepartment: "Color & Grading",
        recipient: "Senior Colorist / DI House",
        channel: "Email / Webhook [Company 3]",
        priority: "MEDIUM",
        sceneNumber: s.sceneNumber,
        message: `Scene ${s.sceneNumber} Picture is LOCKED. Pulling EDL conform for Look-dev (${s.color.lut || 'FilmPrint'}).`,
        status: "QUEUED"
      });
    }

    // Sound Reminders
    if (s.sound.status === 'NOT_STARTED' || s.sound.status === 'SPOTTING') {
      reminders.push({
        id: `rem_${idCounter++}`,
        agentId: "agent_sound",
        agentName: "Sound & Mix Dispatcher",
        targetDepartment: "Sound Post",
        recipient: "Supervising Sound Editor",
        channel: "Slack #sound-foley-adr",
        priority: "MEDIUM",
        sceneNumber: s.sceneNumber,
        message: `Spotting session pending for Scene ${s.sceneNumber}. Required audio pass: ${s.sound.note || 'Atmospheric bed & dialogue sync'}.`,
        status: "QUEUED"
      });
    }
  });

  return reminders.slice(0, 8);
}
