# SaaS Analytics Dashboard

An AI-powered SaaS analytics dashboard built with **Next.js, TypeScript, and the AI SDK**. The application provides interactive analytics for key SaaS metrics such as revenue, users, sales, sessions, and churn, along with a conversational AI assistant for querying and understanding historical metric data.

The project is designed as a **frontend-focused analytics application** with a centralized mock data layer and AI-powered tool calling.

## ✨ Features

* 📊 Interactive SaaS analytics dashboard
* 💰 Revenue, MRR, and sales analytics
* 👥 User activity and growth analytics
* 📈 Historical metric charts and trends
* 🖥️ Session and engagement analytics
* 📉 Churn rate analytics
* 🤖 AI-powered analytics assistant
* 🔎 Structured AI tool calling for metric queries
* ⚡ Streaming AI responses
* 🧠 AI-generated metric insights
* 🛡️ Structured input validation with Zod
* ⚠️ Tool execution error handling
* 📱 Responsive dashboard interface
* ⚙️ Settings and system health pages
* 🚀 Vercel deployment

---

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **AI SDK**
* **Groq / Llama 3.3 70B**
* **Zod**
* **Vercel**

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm, yarn, pnpm, or bun
* A Groq API key for the AI assistant

### Installation

Clone the repository:

```bash
git clone https://github.com/Ramaza413/Frontend-Capstone.git
cd Frontend-Capstone
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> Never commit your actual API key to GitHub.

You can also create a `.env.example` file containing:

```env
GROQ_API_KEY=
```

---

## ▶️ Run the Development Server

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

in your browser.

---

# 🤖 AI Analytics Assistant

The dashboard includes a conversational AI assistant that allows users to ask questions about SaaS metrics and historical performance.

The assistant uses **AI SDK tool calling** to query structured metric data from the centralized analytics data layer.

### AI Flow

```text
User Question
      ↓
AI Chat Interface
      ↓
/api/chat
      ↓
Groq / Llama 3.3 70B
      ↓
queryMetric Tool
      ↓
Centralized Mock Data
      ↓
Metric Results
      ↓
AI-generated Response
```

The current project uses **deterministic mock analytics data** because it is a frontend-focused project without a backend or database.

The data layer is structured so that it can later be replaced with real API or database queries without changing the dashboard or AI tool contract.

---

## 🔎 `queryMetric`

The `queryMetric` tool fetches historical daily values for supported SaaS metrics.

### Supported Metrics

* `mrr`
* `activeUsers`
* `churnRate`

### Input Schema

| Field    | Type                                    | Required | Description                                    |
| -------- | --------------------------------------- | -------- | ---------------------------------------------- |
| `metric` | `"mrr" \| "activeUsers" \| "churnRate"` | Yes      | Metric to query                                |
| `days`   | `number (1–30)`                         | No       | Number of recent days to return. Defaults to 7 |

### Example

```json
{
  "metric": "mrr",
  "days": 7
}
```

### Return Shape

```ts
{
  metric: string;
  points: {
    date: string;
    value: number;
  }[];
  average: number;
  trend: "up" | "down";
}
```

### Error Handling

The tool supports an intentional error state for unsupported history ranges.

Requests for more than **25 days** trigger an error:

```text
Only 25 days of reliable history exist for "mrr".
Try a smaller range.
```

This demonstrates how the application handles tool execution failures.

---

# 📊 Dashboard Sections

The application includes:

* **Dashboard** — Overview of key SaaS metrics
* **Revenue** — Revenue and MRR analytics
* **Users** — User activity and growth
* **Sales** — Sales performance
* **Sessions** — Session and engagement metrics
* **Reports** — Analytics reports
* **Settings** — Application settings
* **Health** — System health information
* **AI Assistant** — Conversational analytics powered by AI

---

# 📁 Project Structure

```text
Frontend-Capstone/
├── app/
│   ├── api/
│   │   └── chat/
│   ├── components/
│   ├── dashboard/
│   ├── reports/
│   ├── revenue/
│   ├── sales/
│   ├── sessions/
│   ├── users/
│   ├── settings/
│   └── health/
│
├── lib/
│   └── ai/
│       ├── config.ts
│       ├── mockData.ts
│       └── tools.ts
│
├── public/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🧩 Data Architecture

The dashboard uses a centralized mock data layer located at:

```text
lib/ai/mockData.ts
```

This file provides shared data functions for:

* Revenue
* Users
* Sales
* Sessions
* Churn rate
* Table data
* Analytics summaries

The AI tool consumes the same metric data used by the dashboard.

This prevents the AI assistant and dashboard from relying on separate metric sources.

---

# 🌐 Live Demo

**Live Application:**

https://frontend-capstone-opal.vercel.app/

**GitHub Repository:**

https://github.com/Ramaza413/Frontend-Capstone

---

# 🔮 Future Improvements

The current project is frontend-focused. Future versions could include:

* Connect analytics to a real backend/database
* Replace mock data with real-time analytics
* Add authentication and user-specific dashboards
* Add additional AI analytics tools
* Add exportable reports
* Add advanced filtering and date ranges
* Add automated insights and anomaly detection
* Add unit and integration tests
* Add real-time dashboard updates

---

# 📚 Learn More

To learn more about Next.js, visit:

* https://nextjs.org/docs
* https://nextjs.org/learn

---

# 🚀 Deployment

The application can be deployed using Vercel.

Build the application:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

For production deployment, configure the required environment variables in your hosting platform.

```
```
