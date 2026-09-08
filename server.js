import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  extractGranularPipelineTelemetry, 
  generateGranularPipelineReport 
} from './src/services/directorAgentService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8080', 10);
const DIST_DIR = path.join(__dirname, 'dist');
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.VITE_GCP_PROJECT_ID || 'ace-vial-371506';
const REGION = process.env.GCP_REGION || process.env.VITE_GCP_REGION || 'europe-west1';

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Automatically retrieves Google Cloud Access Token using Cloud Run Metadata Server
 * or local gcloud ADC when running outside Cloud Run.
 */
async function getGcpAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  // 1. Check Google Cloud Instance Metadata Server (Cloud Run / GCE)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const metaRes = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      {
        headers: { 'Metadata-Flavor': 'Google' },
        signal: controller.signal
      }
    );
    clearTimeout(timer);
    if (metaRes.ok) {
      const data = await metaRes.json();
      if (data.access_token) {
        cachedToken = data.access_token;
        tokenExpiresAt = Date.now() + ((data.expires_in || 3600) * 1000);
        console.log('[Server] Successfully retrieved access token from Cloud Run Metadata Server');
        return cachedToken;
      }
    }
  } catch (e) {
    // Not running on GCP or metadata server unreachable
  }

  // 2. Check process environment variables
  const envToken = process.env.GCP_ACCESS_TOKEN || process.env.VITE_GCP_ACCESS_TOKEN;
  if (envToken && envToken.trim().length > 0) {
    return envToken.trim();
  }

  // 3. In local development outside Cloud Run, attempt gcloud auth print-access-token
  try {
    const { execSync } = await import('child_process');
    const token = execSync('gcloud auth print-access-token', { encoding: 'utf8', timeout: 4000 }).trim();
    if (token && token.startsWith('ya29.')) {
      cachedToken = token;
      tokenExpiresAt = Date.now() + (3000 * 1000);
      console.log('[Server] Retrieved access token from local gcloud ADC');
      return cachedToken;
    }
  } catch (e) {
    // gcloud not available or not logged in
  }

  return null;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // Health check endpoint
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'blockbuster-agentic-system',
      projectId: PROJECT_ID,
      region: REGION,
      hasToken: !!cachedToken
    }));
    return;
  }

  // Chat API streaming endpoint
  if (pathname === '/api/chat' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyStr || '{}');
        const { message, history = [], project = {}, modelId = 'gemini-2.0-flash' } = payload;
        const telemetry = extractGranularPipelineTelemetry(project);

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });

        const token = await getGcpAccessToken();

        if (token) {
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

          const historyFormatted = history
            .map(m => `${m.role === 'user' ? 'DIRECTOR' : 'PIPELINE ADVISOR'}: ${m.text}`)
            .join('\n\n');

          const fullPrompt = `${systemPrompt}\n\n${historyFormatted}\n\nDIRECTOR: ${message}\n\nPIPELINE ADVISOR:`;

          const vertexUrl = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${modelId}:streamGenerateContent?alt=sse`;

          try {
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
                const chunkStr = decoder.decode(value, { stream: true });
                res.write(chunkStr);
              }
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
          } catch (vErr) {
            console.warn('[Server] Vertex AI call failed, falling back to dynamic pipeline engine:', vErr.message);
          }
        }

        // Offline / Dynamic Pipeline Engine Fallback
        const fullReport = generateGranularPipelineReport(message, telemetry);
        const words = fullReport.split(/(\s+)/);
        for (let i = 0; i < words.length; i += 3) {
          const slice = words.slice(i, i + 3).join('');
          res.write(`data: ${JSON.stringify({ text: slice })}\n\n`);
          await new Promise(r => setTimeout(r, 20));
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (err) {
        console.error('[Server] Chat API error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static file serving from dist/
  let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      ...(ext === '.html' ? { 'Cache-Control': 'no-cache' } : { 'Cache-Control': 'public, max-age=31536000' })
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Blockbuster System running on http://0.0.0.0:${PORT}`);
  console.log(`[Server] Project: ${PROJECT_ID} | Region: ${REGION}`);
});
