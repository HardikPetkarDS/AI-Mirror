# AI Mirror — Virtual Shopping Mirror & Smart Fitting Room Platform

> **AI Mirror** is a commercial-grade, scalable web application combining real-time camera interaction, multi-store fashion product discovery, AI Virtual Try-On pipelines, and an intelligent Size Recommendation Engine with personalized fit feedback learning.

---

## 📌 Architecture Overview

```
                    USER
                      |
                      v
               NETLIFY FRONTEND
                 Next.js 14
                      |
                      | HTTPS API
                      v
                FASTAPI BACKEND
                      |
             +--------+--------+
             |                 |
             v                 v
         DATABASE          AI SERVICES
       SQLite / Postgres   VTON / CV
                           GPU / API
```

---

## ✨ Core Product Features

1. **Live Camera Mirror Viewport**:
   - WebRTC browser camera feed with real-time posture landmark tracking.
   - Live camera positioning feedback (*"Move slightly backward"*, *"Full body detected"*, *"Good lighting"*).
   - Camera switching & privacy-first frame snapshot capture.

2. **Normalized Multi-Store Catalog & Search**:
   - `ProductProvider` interface supporting official retailer APIs and affiliate feeds.
   - Includes adapters for **Myntra, Nykaa, AJIO, Amazon Fashion, Zara & H&M**.
   - Search by query (*"black shirt"*, *"blue jeans"*), filter by store, category, price, discount, and fit type.
   - Direct retailer referral link tracking (`AffiliateClick`).

3. **Pluggable Virtual Try-On Pipeline (`VirtualTryOnProvider`)**:
   - Configurable VTON provider supporting real cloud GPU API models (e.g. IDM-VTON / Fal.ai via `VIRTUAL_TRYON_API_KEY`).
   - High-fidelity local neural composite fallback pipeline (garment segmentation, shoulder/torso warping, edge blending, color & lighting preservation) for local MVP execution.

4. **AI Size Recommendation Engine (`SizeRecommendationEngine`)**:
   - Evaluates estimated body measurements (shoulder, chest, waist) against retailer product size charts.
   - Adjusts for user fit preferences (*Slim Fit, Regular Fit, Relaxed Fit, Oversized*).
   - Returns recommended size, **confidence percentage score** (e.g. 91%), detailed fit breakdown (Shoulder, Chest, Waist, Length), alternative size choices, and human-readable explanation.

5. **Personalized Fit Feedback Learning Loop**:
   - Logs user fit feedback (*"Too tight"*, *"Fits perfectly"*, *"Too loose"*) in `FitFeedback`.
   - Dynamically recalibrates future size recommendations for specific brands & categories based on historical feedback.

6. **Outfit Builder & "Complete My Look" AI**:
   - Combine tops, bottoms, jackets, and footwear into a unified look.
   - Calculate total price and buy full outfit across multiple retailers in one click.

---

## 🛠️ Project Structure

```
ai-mirror/
├── frontend/                 # Next.js 14 App Router, React, Tailwind CSS, TypeScript
│   ├── src/
│   │   ├── app/              # Next.js App Router (layout, page, globals.css)
│   │   ├── components/       # Navbar, HeroSection, CameraMirror, ProductDrawer, TryOnModal, OutfitBuilderView, UserProfileView
│   │   ├── hooks/            # useCamera
│   │   ├── lib/              # API Client (api.ts using NEXT_PUBLIC_API_URL)
│   │   └── types/            # TypeScript interfaces
│   ├── netlify.toml          # Netlify build configuration
│   ├── .nvmrc                # Node 20 version specification
│   ├── .env.example          # Environment variables template
│   └── package.json
├── backend/                  # FastAPI Python Service
│   ├── app/
│   │   ├── main.py           # FastAPI app & CORS configuration
│   │   ├── api/v1/           # v1 REST API endpoints (auth, products, tryon, user, outfits)
│   │   ├── core/             # Configuration (BACKEND_ALLOWED_ORIGINS), Database engine, Security
│   │   ├── models/           # SQLAlchemy DB Models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic (ProductService, AuthService, AIService)
│   │   └── providers/        # Retailer Provider adapters (Mock, Myntra, Nykaa, AJIO, Amazon)
│   ├── tests/                # Automated pytest suite (test_backend.py)
│   ├── database/             # DB Seed script (seed_db.py)
│   ├── .env.example          # Backend Environment template
│   └── requirements.txt
├── ai/                       # AI Computer Vision Pipeline
│   ├── pose/                 # PoseEstimationProvider & MediaPipe detector
│   ├── body_analysis/        # BodyMeasurementProvider landmark estimation
│   ├── virtual_try_on/       # VirtualTryOnProvider (Fal.ai IDM-VTON + local neural composite fallback)
│   └── size_recommendation/  # SizeRecommendationEngine multi-factor algorithm
├── netlify.toml              # Root monorepo Netlify configuration
├── .nvmrc                    # Root Node 20 version specification
├── scripts/                  # Development setup & execution scripts
├── docker-compose.yml        # Docker orchestration configuration
└── README.md
```

---

## 🚀 Quick Start Guide (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 20+ & NPM

### 1. Automated Setup Script
Run the automated setup script in PowerShell:
```powershell
cd D:\ai-mirror
.\scripts\setup.ps1
```

### 2. Manual Execution

#### Terminal 1 — Backend (FastAPI)
```powershell
cd D:\ai-mirror\backend
$env:PYTHONPATH="..;."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API documentation available at: `http://localhost:8000/docs`

#### Terminal 2 — Frontend (Next.js)
```powershell
cd D:\ai-mirror\frontend
npm run dev
```
Open website at: `http://localhost:3000`

---

## 🌐 Production Deployment

### 1. Frontend Deployment on Netlify

1. Push your repository to GitHub / GitLab.
2. In Netlify Dashboard, select **"Import from Git"** and choose your repository.
3. Configure Monorepo Build Settings:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/.next` (or `.next` if base is set to `frontend`)
   - **Node.js Version**: `20` (configured automatically via `.nvmrc` and `netlify.toml`)
4. Configure Environment Variables in Netlify UI:
   - `NEXT_PUBLIC_API_URL`: Set to your deployed FastAPI backend URL (e.g. `https://api.yourdomain.com/api/v1`)
5. Click **Deploy Site**.

### 2. Backend Deployment (FastAPI)

Deploy the FastAPI backend independently to AWS EC2, Railway, Render, DigitalOcean, or GCP Cloud Run.

Configure Backend Environment Variables:
```env
DATABASE_URL=postgresql://user:password@postgres-host:5432/ai_mirror_db
SECRET_KEY=your_production_jwt_secret_key
BACKEND_ALLOWED_ORIGINS=https://your-site.netlify.app
VIRTUAL_TRYON_PROVIDER=fal_ai
VIRTUAL_TRYON_API_KEY=your_fal_ai_key
```

### 3. AI / Virtual Try-On Services

The heavy GPU-dependent VTON pipeline is completely decoupled from the Netlify frontend. In production:
- The FastAPI backend delegates VTON synthesis to cloud GPU providers (e.g. Fal.ai / Replicate / custom GPU server) via `VirtualTryOnProvider`.
- No API keys or GPU code are included in the Netlify static frontend bundle.

---

## 🧪 Testing

### Backend Automated Test Suite
Run the test suite covering authentication, product search, retailer filtering, pose estimation, size recommendation engine, and try-on pipeline:
```powershell
cd D:\ai-mirror\backend
$env:PYTHONPATH="..;."
python -m pytest tests/test_backend.py -v
```

### Frontend Production Build Test
Verify the frontend Next.js compilation:
```powershell
cd D:\ai-mirror\frontend
npm run build
```

---

## 🔒 Privacy Assurance

Camera streams remain in the user's browser via WebRTC `MediaDevices` API. Image frames are only transmitted to the backend when the user explicitly clicks **"Try On"** or **"Capture Frame"**. Raw images are not stored permanently on disk.
