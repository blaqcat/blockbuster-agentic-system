# Cloud Run & Identity-Aware Proxy (IAP) Deployment Guide

This document details the production deployment and security architecture of **Blockbuster** on **Google Cloud Run** with **Identity-Aware Proxy (IAP)** and an **External HTTPS Load Balancer**.

---

## 🏗️ Architecture Overview

```
[ Director / Editor Browser ]
              │
              ▼ (HTTPS : 443)
┌─────────────────────────────────────────────────────────────┐
│  Google Cloud Global External HTTPS Load Balancer           │
│  IP: 34.95.121.204                                         │
│  Forwarding Rule: blockbuster-forwarding-rule               │
│  URL Map: blockbuster-url-map                               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Identity-Aware Proxy (IAP) Verification Layer              │
│  • Google Workspace / Cloud Identity Authentication         │
│  • IAM Role: roles/iap.httpsResourceAccessor                │
└─────────────────────────────┬───────────────────────────────┘
                              │ (Authenticated Traffic Only)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Global Backend Service: blockbuster-backend                │
│  Serverless Network Endpoint Group (NEG): blockbuster-neg   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Google Cloud Run (Region: europe-west1)                    │
│  Service: blockbuster-app                                   │
│  Ingress Policy: internal-and-cloud-load-balancing          │
│  Image: NGINX Alpine Production Container SPA               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployed Resources Summary (Project: `ace-vial-371506`)

| Resource | Name / Endpoint | Details |
| :--- | :--- | :--- |
| **Cloud Run Service** | `blockbuster-app` | `https://blockbuster-app-404320605842.europe-west1.run.app` |
| **Serverless NEG** | `blockbuster-neg` | Region: `europe-west1` |
| **Backend Service** | `blockbuster-backend` | Global HTTP/HTTPS Backend |
| **URL Map** | `blockbuster-url-map` | Routes root traffic to `blockbuster-backend` |
| **Target HTTP Proxy** | `blockbuster-http-proxy` | HTTP Load Balancer Proxy |
| **Static Frontend IP** | `34.95.121.204` | Global IPv4 Reserved Address |
| **Global Forwarding Rule** | `blockbuster-forwarding-rule` | Port 80 / 443 Entrypoint |

---

## 🔐 Enabling Identity-Aware Proxy (IAP) & Granting Access

### Step 1: Configure OAuth Consent Screen & Credentials in GCP Console
1. In Google Cloud Console, navigate to **APIs & Services &rarr; OAuth consent screen**.
2. Select **Internal** (for your Google Workspace org) or **External**, set the Application name to **Blockbuster Film Suite**, and save.
3. Navigate to **APIs & Services &rarr; Credentials &rarr; Create Credentials &rarr; OAuth client ID**.
4. Set Application Type to **Web application**, Name to `Blockbuster IAP Client`.
5. Add Authorized redirect URI:
   ```
   https://iap.googleapis.com/v1/oauth/clientIds/YOUR_CLIENT_ID:handleRedirect
   ```
6. Copy the generated **Client ID** and **Client Secret**.

---

### Step 2: Enable IAP on the Backend Service via CLI
Run the following command in PowerShell / Bash with your OAuth credentials:

```bash
gcloud compute backend-services update blockbuster-backend \
    --global \
    --iap=enabled,oauth2-client-id=YOUR_CLIENT_ID,oauth2-client-secret=YOUR_CLIENT_SECRET \
    --project=ace-vial-371506
```

---

### Step 3: Grant Access to Directors, Editors, & Department Leads
Grant individual users or groups the `roles/iap.httpsResourceAccessor` role:

```bash
# Grant access to a director or editor Google account
gcloud iap web add-iam-policy-binding \
    --resource-type=backend-services \
    --service=blockbuster-backend \
    --member='user:jerry@djehuti.org' \
    --role='roles/iap.httpsResourceAccessor' \
    --project=ace-vial-371506

# Or grant access to an entire Google Workspace group
gcloud iap web add-iam-policy-binding \
    --resource-type=backend-services \
    --service=blockbuster-backend \
    --member='group:post-production-team@yourdomain.com' \
    --role='roles/iap.httpsResourceAccessor' \
    --project=ace-vial-371506
```

---

### Step 4: Lock Down Direct Cloud Run Ingress
To ensure zero bypass of IAP authentication, restrict Cloud Run ingress to only accept traffic from the Load Balancer:

```bash
gcloud run services update blockbuster-app \
    --region=europe-west1 \
    --ingress=internal-and-cloud-load-balancing \
    --project=ace-vial-371506
```

---

## 🔄 Updating / Redeploying the Application

When code changes are made, deploy a new revision to Cloud Run seamlessly:

```bash
gcloud run deploy blockbuster-app \
    --source . \
    --region=europe-west1 \
    --project=ace-vial-371506
```
