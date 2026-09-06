import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini-powered Script Breakdown & Post-Production Department Pipeline Synthesizer
 */
export async function analyzeScriptWithGemini(scriptText, apiKey) {
  if (!apiKey || !apiKey.trim()) {
    return simulateScriptBreakdown(scriptText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert Hollywood Post-Production Supervisor, Lead Film Editor (ACE), and Technical Director.
Analyze the following screenplay text and break it down into structured Acts and Scenes with departmental tracking for Picture Editing, Sound Post, VFX, Color/Grading, and Mastering.

Return ONLY a valid JSON object matching this exact schema without markdown backticks:
{
  "title": "Extracted or inferred title",
  "director": "Extracted or inferred Director name",
  "leadEditor": "Extracted or inferred Lead Editor name",
  "scenes": [
    {
      "id": "sc_1",
      "act": "Act I",
      "sceneNumber": "1",
      "slugline": "EXT. LOCATION - TIME",
      "pages": 1.5,
      "runtimeEst": "1m 30s",
      "characters": ["NAME1", "NAME2"],
      "emotionalBeat": "Tension / Pacing description",
      "scriptSnippet": "Key dialogue or action snippet",
      "picture": { "status": "ROUGH_CUT", "note": "Editorial cut note and take recommendation" },
      "sound": { "status": "SPOTTING", "note": "Specific sound design, Foley, or dialogue cue" },
      "vfx": { "status": "IN_PROGRESS", "shotsCount": 3, "shotsApproved": 1, "note": "VFX shot description (plates, 3D, CGI)" },
      "color": { "status": "PENDING_LOCK", "lut": "Recommended LUT/look", "note": "Color palette mood" },
      "mastering": { "status": "PENDING", "qcNotes": "Aspect ratio and audio specs" }
    }
  ]
}

Screenplay Content:
${scriptText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean potential markdown fencing
    const cleanJson = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn("Gemini API call failed or timed out, using fallback parser:", error);
    return simulateScriptBreakdown(scriptText);
  }
}

function simulateScriptBreakdown(scriptText) {
  const lines = scriptText.split('\n');
  const scenes = [];
  let currentAct = "Act I";
  let sceneIndex = 1;
  let title = "UNTITLED PROJECT";
  let director = "Director (TBD)";
  let leadEditor = "Lead Editor (TBD)";

  // Detect header metadata
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toUpperCase().startsWith("TITLE:")) {
      title = trimmed.substring(6).trim();
    } else if (trimmed.toUpperCase().startsWith("DIRECTOR:")) {
      director = trimmed.substring(9).trim();
    } else if (trimmed.toUpperCase().startsWith("LEAD EDITOR:")) {
      leadEditor = trimmed.substring(12).trim();
    }
  }

  // Detect scenes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes("=== ACT II") || line.includes("ACT 2") || line.includes("ACT IIA")) {
      currentAct = "Act IIA";
    } else if (line.includes("=== ACT IIB") || line.includes("ACT 2B")) {
      currentAct = "Act IIB";
    } else if (line.includes("=== ACT III") || line.includes("ACT 3")) {
      currentAct = "Act III";
    } else if (
      line.startsWith("EXT.") || 
      line.startsWith("INT.") || 
      line.startsWith("EXT/") || 
      line.startsWith("INT/") ||
      line.startsWith("SCENE")
    ) {
      const snippetLines = lines.slice(i + 1, i + 6).filter(l => l.trim().length > 0 && !l.startsWith("===") && !l.startsWith("EXT.") && !l.startsWith("INT."));
      const snippet = snippetLines.join(' ').slice(0, 180);
      
      // Extract characters mentioned in capitalized words in snippet
      const words = snippet.split(/\s+/);
      const characters = Array.from(new Set(
        words
          .filter(w => /^[A-Z]{3,12}$/.test(w.replace(/[^A-Z]/g, '')) && !['THE','AND','INT','EXT','DAY','NIGHT','FOR','NOT','OUT'].includes(w.replace(/[^A-Z]/g, '')))
          .map(w => w.replace(/[^A-Z]/g, ''))
      )).slice(0, 3);

      const isNight = line.toUpperCase().includes("NIGHT") || line.toUpperCase().includes("DUSK");
      const isExt = line.toUpperCase().includes("EXT.");

      scenes.push({
        id: `sc_${sceneIndex}`,
        act: currentAct,
        sceneNumber: `${sceneIndex}`,
        slugline: line,
        pages: +(1 + Math.random() * 2).toFixed(2),
        runtimeEst: `${Math.floor(1 + Math.random() * 2)}m ${Math.floor(10 + Math.random() * 45)}s`,
        characters: characters.length > 0 ? characters : ["KAI", "PROTAGONIST"],
        emotionalBeat: sceneIndex === 1 ? "Exposition & Setup" : sceneIndex % 2 === 0 ? "Rising Action / Conflict" : "High Tension Climax",
        scriptSnippet: snippet || "Action and dialogue as indicated in director's shooting script.",
        picture: { 
          status: sceneIndex === 1 ? "LOCKED" : sceneIndex % 2 === 0 ? "FINE_CUT" : "ROUGH_CUT", 
          note: `Editorial pass for Scene ${sceneIndex}. Check coverage angles.` 
        },
        sound: { 
          status: sceneIndex === 1 ? "FINAL_MIX" : "DESIGN", 
          note: isNight ? "Heavy ambient room tone, sub bass drone." : "Exterior natural environment bed." 
        },
        vfx: { 
          status: isExt ? "IN_PROGRESS" : "PLATES_PULLED", 
          shotsCount: isExt ? 8 : 2, 
          shotsApproved: isExt ? 3 : 1, 
          note: isExt ? "Atmospheric environmental CGI extension." : "Screen graphics insert comp." 
        },
        color: { 
          status: sceneIndex === 1 ? "APPROVED" : "IN_GRADE", 
          lut: isNight ? "Teal_Orange_FilmPrint_v3" : "Warm_Daylight_Kodak", 
          note: isNight ? "Cyan shadows, neon accents." : "Golden natural skin tones." 
        },
        mastering: { 
          status: sceneIndex === 1 ? "PASSED" : "PENDING", 
          qcNotes: "DCI Compliant 2.39:1 scope." 
        }
      });
      sceneIndex++;
    }
  }

  return {
    title: title !== "UNTITLED PROJECT" ? title : "PARSED PRODUCTION SCRIPT",
    director: director !== "Director (TBD)" ? director : "Denis Villeneuve",
    leadEditor: leadEditor !== "Lead Editor (TBD)" ? leadEditor : "Joe Walker, ACE",
    scenes: scenes.length > 0 ? scenes : [
      {
        id: "sc_1",
        act: "Act I",
        sceneNumber: "1",
        slugline: "INT. PRODUCTION EDITING SUITE - DAY",
        pages: 1.0,
        runtimeEst: "1m 00s",
        characters: ["DIRECTOR", "LEAD EDITOR"],
        emotionalBeat: "Creative Alignment",
        scriptSnippet: "The director points to the timeline. 'Let's tighten this cut.'",
        picture: { status: "ROUGH_CUT", note: "First assembly cut." },
        sound: { status: "SPOTTING", note: "Ambient room tone." },
        vfx: { status: "PLATES_PULLED", shotsCount: 2, shotsApproved: 0, note: "Monitor insert." },
        color: { status: "PENDING_LOCK", lut: "Rec709_Standard", note: "Standard reference." },
        mastering: { status: "PENDING", qcNotes: "Pending lock." }
      }
    ]
  };
}
