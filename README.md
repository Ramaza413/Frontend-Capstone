# SaaS Analytics Dashboard

An AI-powered SaaS analytics dashboard built with **Next.js**. The application provides interactive analytics for key SaaS metrics such as revenue, users, sales, sessions, and churn, along with a conversational AI assistant for querying and understanding metric data.

## ✨ Features

* 📊 Interactive analytics dashboard
* 💰 Revenue, sales, and user metrics
* 📈 Historical metric charts and trends
* 👥 Active users and session analytics
* 🤖 AI-powered analytics assistant
* 🔎 AI tool for querying metric history
* ⚡ Streaming AI responses
* 🛠️ Tool-calling with structured inputs
* 📱 Responsive dashboard interface
* ⚙️ Settings and system health pages
* 🚀 Deployed with Vercel

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **AI SDK**
* **Groq / Llama**
* **Zod**
* **Vercel**

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

### Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> Never commit your actual API key to GitHub.

You can also create a `.env.example` file containing:

```env
GROQ_API_KEY=
```

### Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🤖 AI Analytics Assistant

The dashboard includes a conversational AI assistant that can query SaaS metrics and provide information about historical performance.

The assistant uses AI tool calling to execute structured metric queries.

### `queryMetric`

Fetches historical daily values for a SaaS metric.

#### Input Schema

| Field    | Type                                    | Required | Description                                    |
| -------- | --------------------------------------- | -------- | ---------------------------------------------- |
| `metric` | `"mrr" \| "activeUsers" \| "churnRate"` | Yes      | Metric to query                                |
| `days`   | `number (1–25)`                         | No       | Number of recent days to return. Defaults to 7 |

#### Example

```json
{
  "metric": "mrr",
  "days": 7
}
```

#### Return Shape

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

The tool intentionally handles unsupported requests through its error state.

Requests for more than **25 days** trigger an error, allowing the UI to demonstrate how tool execution failures are handled by the AI assistant.

## 📊 Dashboard Sections

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

## 📁 Project Structure

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
├── lib/
│   └── ai/
│       └── tools.ts
├── public/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🌐 Live Demo

**Live Application:**
https://frontend-capstone-opal.vercel.app/

**GitHub Repository:**
https://github.com/Ramaza413/Frontend-Capstone

## 🔮 Future Improvements

* Connect analytics to a real backend/database
* Replace mock metric data with real-time data
* Add authentication and user-specific dashboards
* Add more AI-powered analytics tools
* Add exportable reports
* Add advanced filtering and date ranges
* Add automated insights and anomaly detection
* Add unit and integration tests

## 📚 Learn More

To learn more about Next.js, check out the official documentation:

* https://nextjs.org/docs
* https://nextjs.org/learn

## 🚀 Deployment

The application can be deployed using Vercel.

```bash
npm run build
npm run start
```

For production deployment, configure the required environment variables in your hosting platform.
