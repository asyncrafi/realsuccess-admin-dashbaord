# RealSuccess Admin Dashboard

Production-ready enterprise administration portal built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Designed and integrated to provide complete real-time management over the **RealSuccess Event Companion** ecosystem.

---

## 🌐 Live Production Links

| Service | URL | Description |
|---|---|---|
| **Live Admin Dashboard** | `https://admin.ourrealsuccess.com/` | Web Admin Management Portal |
| **Backend API Gateway** | `https://api.ourrealsuccess.com/` | Django REST Framework API |
| **Interactive API Docs** | `https://api.ourrealsuccess.com/api/docs/` | Swagger / OpenAPI 3.0 Documentation |
| **Public Privacy Policy** | `https://admin.ourrealsuccess.com/privacy-policy` | Compliance Web Page for App Store & Google Play |
| **Public Terms & Conditions**| `https://admin.ourrealsuccess.com/terms-conditions` | Compliance Web Page for App Store & Google Play |

---

## 🔑 Default Superuser Credentials

- **Email**: `admin@ourrealsuccess.com`
- **Password**: `Admin@RealSuccess2026!`
- **Role**: Platform Administrator / Superuser

---

## ✨ Core Features & Module Overview

- **📊 Dashboard & Real-Time Analytics**:
  - Live revenue stats, total active attendees, registered tickets, and attendance trends.
  - Interactive charts and breakdown cards.
- **📅 Events Management**:
  - Create, schedule, and edit multi-day summits and events.
  - Manage event access codes, venues, dates, and live countdown banners.
- **🎤 Schedule & Speakers Directory**:
  - Multi-track timeline scheduling with keynote and workshop session categorization.
  - Comprehensive speaker profiles, expertise tags, and bios.
- **🎟️ Tickets & Attendees Roster**:
  - Issue, track, and validate tickets (VIP, General Admission).
  - On-site QR badge check-in status and attendee exports.
- **📢 Priority Announcements & Banners**:
  - Broadcast real-time urgent updates, venue notifications, and takeaway handouts directly to the mobile app.
- **📁 Resources & Downloads Library**:
  - Upload event PDFs, presentations, spreadsheets, and workbooks with real-time download counters.
- **💬 Team Messaging & Concierge**:
  - Direct coordinator communications and VIP concierge chat monitoring.
- **⚙️ Profile & Settings Management (Live Backend Sync)**:
  - **Edit Profile**: Live updates to admin name and contact info via backend API.
  - **Change Password**: Secure password update with real-time validation.
  - **Privacy Policy & Terms**: Dynamic rich-text editor updating the production database in real time.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner Toasts
- **HTTP Client**: Fetch API with unified bearer token management

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### 2. Installation
```bash
git clone git@github.com:asyncrafi/realsuccess-admin-dashbaord.git
cd realsuccess-admin-dashbaord

npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://api.ourrealsuccess.com
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🐳 Docker Deployment

A production-optimized multi-stage `Dockerfile` is included:

```bash
# Build the Docker image
docker build -t realsuccess-admin-dashboard .

# Run the container on port 3000
docker run -d -p 3000:3000 --name realsuccess_frontend realsuccess-admin-dashboard
```
