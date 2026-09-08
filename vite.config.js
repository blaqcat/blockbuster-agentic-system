import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function localApiChatPlugin() {
  return {
    name: 'local-api-chat',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const { execSync } = await import('child_process');
              let token = process.env.GCP_ACCESS_TOKEN || process.env.VITE_GCP_ACCESS_TOKEN;
              if (!token) {
                try {
                  token = execSync('gcloud auth print-access-token', { encoding: 'utf8', timeout: 4000 }).trim();
                } catch (e) {}
              }

              const payload = JSON.parse(bodyStr || '{}');
              const { message, history = [], project = {}, modelId = 'gemini-2.0-flash' } = payload;
              const { extractGranularPipelineTelemetry, generateGranularPipelineReport } = await import('./src/services/directorAgentService.js');
              const telemetry = extractGranularPipelineTelemetry(project);

              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              });

              if (token && token.startsWith('ya29.')) {
                const projectId = process.env.VITE_GCP_PROJECT_ID || 'ace-vial-371506';
                const region = process.env.VITE_GCP_REGION || 'europe-west1';
                const systemPrompt = `You are the Executive Director's Master Post-Production Supervisor & Senior Pipeline Strategist for the feature film "${telemetry.title}".
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

                const historyFormatted = history
                  .map(m => `${m.role === 'user' ? 'DIRECTOR' : 'PIPELINE ADVISOR'}: ${m.text}`)
                  .join('\n\n');
                const fullPrompt = `${systemPrompt}\n\n${historyFormatted}\n\nDIRECTOR: ${message}\n\nPIPELINE ADVISOR:`;

                const vertexUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${modelId}:streamGenerateContent?alt=sse`;
                const vertexRes = await fetch(vertexUrl, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                    generationConfig: { temperature: 0.25, maxOutputTokens: 1400 }
                  })
                });

                if (vertexRes.ok && vertexRes.body) {
                  const reader = vertexRes.body.getReader();
                  const decoder = new TextDecoder();
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    res.write(decoder.decode(value, { stream: true }));
                  }
                  res.write('data: [DONE]\n\n');
                  res.end();
                  return;
                }
              }

              // Dynamic fallback
              const report = generateGranularPipelineReport(message, telemetry);
              const words = report.split(/(\s+)/);
              for (let i = 0; i < words.length; i += 3) {
                res.write(`data: ${JSON.stringify({ text: words.slice(i, i + 3).join('') })}\n\n`);
                await new Promise(r => setTimeout(r, 20));
              }
              res.write('data: [DONE]\n\n');
              res.end();
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localApiChatPlugin()],
  envPrefix: ['VITE_', 'GEMINI_', 'GCP_'],
  server: {
    port: 3000,
    open: true
  }
});
