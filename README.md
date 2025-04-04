# SmartStock: Warehouse Management System

SmartStock was born from the recognition that traditional warehouse management systems often fall short in meeting the dynamic needs of modern businesses. Our platform bridges the gap between inventory control and operational efficiency, providing a comprehensive solution that grows with your business. Unlike generic inventory trackers, SmartStock offers an intuitive, feature-rich environment where warehouse managers and staff can seamlessly monitor stock levels, process orders, and make data-driven decisions.

The system was designed with versatility in mind, catering to businesses of all sizes—from small operations managing a single warehouse to enterprises overseeing multiple facilities across different locations. SmartStock acknowledges that warehouse management extends beyond simple stock counting; it encompasses the entire lifecycle of products from receipt to shipment, with critical touchpoints for quality control, reordering, and analytics.

At its core, SmartStock exists to eliminate the common pain points in warehouse operations: stockouts, overstocking, inefficient order processing, and lack of visibility into inventory value and movement patterns. By centralizing these functions in a user-friendly interface, we empower businesses to optimize their operations, reduce costs, and improve customer satisfaction through timely order fulfillment and accurate inventory management.

---

## Key Features

### Inventory Management

- **Product Tracking**: Monitor inventory levels for all products in your warehouse
- **Restock Notifications**: Automated alerts when inventory falls below defined thresholds
- **Inventory Analytics**: Visualize inventory trends and value over time

### Product Management

- **Detailed Product Records**: Store comprehensive product information including:
  - Name, description, and category
  - SKU and pricing information
  - Inventory quantity and restock thresholds
  - Product images and media
- **Product Status Control**: Mark products as active, draft, or archived
- **Customer Association**: Link products to specific customer accounts

### Order Processing

- **Order Creation**: Generate new orders with product selection and quantity
- **Fulfillment Tracking**: Monitor order status from pending to fulfilled
- **Automated Inventory Adjustment**: Inventory levels automatically update when orders are fulfilled

### Analytics & Reporting

- **Dashboard Overview**: Get a quick snapshot of warehouse performance
- **Inventory Valuation**: Track the total value of inventory in your warehouse
- **Activity Logging**: Maintain detailed records of all warehouse activities

### User Management

- **Organization-Based Access**: Manage multiple warehouses under different organizations
- **Role-Based Permissions**: Control access with admin and manager roles
- **Secure Authentication**: Login with Google or GitHub accounts

---

## Technical Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Recharts, Tanstack Query, Tanstack Table, React Hook Form, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: OAuth (Google, GitHub)
- **Deployment**: Vercel

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher) or **yarn** (v1.22 or higher)
- **Git** for version control
- **Docker Desktop** for supabase local development instance
- **Supabase** account for supabase cloud instance
- **VS Code** or any other code editor with TypeScript support

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/hvpham-yorku/project-jume-group-9.git
```

2. Install dependencies:

```bash
npm i
```

3. Start Supabase Instance:

```bash
npm run supabase:start
```

4. Start App:

```bash
npm run dev
```

---

## Contribution

- Make a new feature branch (naming convention: feature/feature-name)
- Make changes
- Commit changes with a descriptive message
- Push changes to the feature branch
- Make a pull request to the main branch
- Wait for approval
- Merge the pull request
