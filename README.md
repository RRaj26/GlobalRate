# 🌍 GlobalRate Pro — Real-Time Currency Dashboard & Converter

> **A premium, real-time currency conversion and rate-tracking dashboard built with React 19, Tailwind CSS v4, Framer Motion, and Recharts.**

🔗 **Live Demo:** [https://global-rate.vercel.app/](https://global-rate.vercel.app/)  
📦 **GitHub Repository:** [https://github.com/RRaj26/GlobalRate](https://github.com/RRaj26/GlobalRate)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Key Features ](#-key-features)
- [🛠️ Tech Stack & Dependencies](#%EF%B8%8F-tech-stack--dependencies)
- [📂 Project Architecture](#-project-architecture)
- [📡 API & Data Flow](#-api--data-flow)
- [🚀 Getting Started](#-getting-started)
- [📜 Available Scripts](#-available-scripts)
- [⚠️ Disclaimer & License](#%EF%B8%8F-disclaimer--license)

---

## 🌐 Overview

**GlobalRate Pro** is a modern, responsive web application designed for seamless currency conversion and exchange rate tracking. Featuring a dark-mode first design, glassmorphic UI elements, interactive charts, and real-time exchange rates for over 150+ fiat currencies worldwide, GlobalRate Pro delivers a fast, intuitve, and feature-rich user experience.

---

## ✨ Key Features 

### 1. 🔀 Real-Time Two-Way Converter
- Instant bidirectional conversion between any two currencies.
- Input editing from either **From** or **To** field automatically recalculates the opposite amount.
- **Preset Quick-Amount Chips:** One-click shortcuts for $100, $500, $1,000, $5,000, and $10,000.
- **180° Swap Button:** Animated currency swapping powered by Framer Motion.

### 2. 🔍 Searchable Currency Dropdown
- Custom dropdown modal with a real-time search bar.
- Filters by **Currency Code** (e.g., `USD`, `EUR`, `INR`) or **Full Name** (e.g., `US Dollar`, `Indian Rupee`).
- **Flag Emoji Integration:** Automatically maps 150+ ISO currency codes to national flag icons.
- **Fiat Currency Filtering:** Automatically excludes cryptocurrencies to display official fiat currencies only.

### 3. ⭐ Favorites System
- Star/bookmark favorite currencies directly from the dropdown or favorites bar.
- Quick-selection chips for both source and destination inputs.
- Dedicated **Favorite Currencies** manager card.
- Persistent state saved automatically in `localStorage`.

### 4. 📈 Interactive Exchange Rate Trend Charts
- Visualizes historical rate trends using **Recharts AreaChart** with custom gradients and tooltips.
- **Time Range Toggle:** Switch between 7-Day (7D) and 30-Day (30D) trend views.

### 5. 📜 Calculation History Log
- Click **Save to History** to record past calculations with exact amounts and timestamps.
- Displays up to 10 recent entries with a **Clear History** option.
- Saved across browser sessions in `localStorage`.

### 6. 📊 Popular Rates Overview Panel
- Live overview comparing major global currencies (USD, EUR, GBP, JPY, AUD, CAD, AED) against the currently selected base currency.

### 7. ⏳ Shimmer Skeleton Loaders
- Custom animated skeleton screens (`ConverterSkeleton`, `RatesSkeleton`, `ChartSkeleton`) prevent layout shifts during initial API data fetching.

### 8. 🔄 Background Auto-Refresh
- Exchange rates refresh automatically in the background every 60 seconds without disrupting user input.

### 9. 🎨 Premium UI & Design Tokens
- Tailwind CSS v4 design system with custom CSS variables.
- Smooth glassmorphic containers, subtle background grid overlay, custom scrollbars, and fluid micro-animations.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | [React](https://react.dev/) | `^19.2.7` | UI component library |
| **Build Tool** | [Vite](https://vite.dev/) | `^8.1.1` | Next-generation frontend tooling |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.3.2` | Utility-first CSS framework |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | `^12.42.2` | Production-ready animation engine |
| **Charts** | [Recharts](https://recharts.org/) | `^3.9.2` | Composable charting library |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.24.0` | Modern SVG icons |
| **Linter** | [Oxlint](https://github.com/oxc-project/oxc) | `^1.71.0` | High-performance JavaScript linter |

---

## 📂 Project Architecture

```
GlobalRate/
├── public/                     # Static public assets
├── src/
│   ├── Components/
│   │   ├── InputBox.jsx        # Searchable currency selector & amount input
│   │   ├── SkeletonLoaders.jsx # Animated shimmer loading states
│   │   └── index.js            # Central component export barrel
│   ├── Hooks/
│   │   └── useCurrencyInfo.js  # Custom hook for currency rate fetching
│   ├── App.css                 # Component specific styles
│   ├── App.jsx                 # Main application dashboard layout & state
│   ├── index.css               # Design system tokens, grid overlay & scrollbar rules
│   └── main.jsx                # React application entry point
├── .oxlintrc.json              # Oxlint configuration
├── index.html                  # HTML entry template
├── package.json                # Project dependencies & scripts
├── README.md                   # Project documentation
└── vite.config.js              # Vite bundler configuration
```

---

## 📡 API & Data Flow

GlobalRate Pro consumes live exchange rates from **Fawaz Ahmed's Currency API**:

1. **Exchange Rates Endpoint:**
   `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{baseCurrency}.json`
2. **Currency Names Endpoint:**
   `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RRaj26/GlobalRate.git
   cd GlobalRate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` — Starts the Vite local development server with HMR.
- `npm run build` — Compiles and bundles production-ready assets into the `dist/` folder.
- `npm run lint` — Runs `oxlint` for fast code linting.
- `npm run preview` — Locally previews the built production bundle.

---

## ⚠️ Disclaimer & License

### Disclaimer
GlobalRate Pro is a personal portfolio project created for educational and demonstration purposes. Exchange rate data is retrieved from public APIs and is intended solely for general informational purposes. It should not be used as financial, investment, or trading advice.

### License
Distributed under the **MIT License**. See `LICENSE` for more information.

