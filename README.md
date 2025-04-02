# 📦 SmartStock – Inventory Management System

SmartStock is a full-stack, real-time inventory management system designed to help warehouse teams manage orders, products, customers, and analytics efficiently. Built with modular architecture and real-time integration, SmartStock simplifies stock tracking across multiple warehouses with support for role-based access and modern UI features.

---

## 🚀 Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Shadcn UI
- **Backend:** Supabase (PostgreSQL)
- **Charts & Visuals:** Recharts
- **Auth:** OAuth (Role-based access control)
- **Version Control:** Git, GitHub

---

## ✨ Key Features & Breakdown

| Feature Area                        | Description                                                                 | Assigned To           |
|------------------------------------|-----------------------------------------------------------------------------|------------------------|
| 🔐 **Authentication & Backend**    | Role-based login, multi-tenancy support, seeded database, pagination logic | Max                    |
| 📦 **Orders & Products**           | CRUD for orders/products, fulfillment status, stock notifications          | Max, Jay               |
| 👥 **Customers & Activity Logs**   | Manage customer info, log system updates to orders/products                 | Max, Nams              |
| 🏠 **Home, Analytics & Profile**   | Dashboard UI, analytics charts, profile editor (with default avatar)       | Max, Erfan             |

**UI Design System:** Built using Shadcn UI component library and Tailwind CSS for rapid styling.  
**Data Sync:** Powered by Supabase for real-time updates across modules.

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hvpham-yorku/project-jume-group-9.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add environment variables
Create a `.env.local` file in the root directory and add:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the development server
```bash
npm run dev
```
---

## 👥 Team Members

| Name              | Role & Responsibilities                            |
|-------------------|-----------------------------------------------------|
| **Erfan Razmand** | Home Page, Analytics Charts, Profile Page           |
| **Jay Patel**     | Orders Module, Product Updates                      |
| **Max Eskandari** | Auth, Backend Logic, Seeding, Products, Customers   |
| **Usman Shahzad** | Customer Module, Documentation, Testing             |

---

## 🧠 System Capabilities

SmartStock is built with scalability and usability in mind:
- Modular, component-based architecture (Next.js)
- Real-time data sync with Supabase
- UI access control based on user role
- Filtered views and forms based on warehouse context
- Designed for internal teams in logistics, retail, or warehouse environments

---

## 📝 License

This repository is for educational use only. Developed by Team JUME (2025).
