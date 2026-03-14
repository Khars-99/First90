# FIRST 90: GTM Diagnostic Engine

A Neo-Brutalist React application that acts as a ruthless Chief Operating Officer. It takes your business context and uses Google's Gemini AI to generate a highly actionable, structured 90-day operational brief in seconds.

## 🌟 Features

- **Two Diagnostic Modes**:
  - **Quick Scan**: Fast insights based on company name, sector, and stage.
  - **Deep Diagnostic**: Comprehensive analysis requiring inputs on revenue trajectory, acquisition channels, cash flow, team structure, and operational bottlenecks.
- **AI-Powered Insights**: Uses `gemini-3.1-pro-preview` to generate structured JSON responses containing:
  - The single biggest lever to pull right now.
  - Key friction points across Revenue, Operations, and Reporting.
  - A concrete 3-5 step 90-day plan.
  - "The Question You're Not Asking" (a provocative truth).
  - (Deep Mode) Team & Org Risk, Financial Risk, and "The Hardest Thing".
- **Neo-Brutalist Design System**: Features a custom "Dewy Morning" color palette, thick borders, hard offset shadows, and bold typography.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini API)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Inter (Google Fonts)

## 🎨 Design System ("Dewy Morning" Neo-Brutalism)

This project strictly adheres to a Neo-Brutalist aesthetic:
- **Colors**: 
  - Background: `#F7FAF9`
  - Surfaces: `#FFFFFF`
  - Primary Accent: `#A3C9C7`
  - Secondary Accents: `#B8C5D6`, `#F2D5AE`
  - Structure/Text: `#000000`
- **Typography**: `Inter` (sans-serif) for UI, system monospace for numbers/tags. Headings use `font-black`, `uppercase`, and `tracking-tighter`.
- **Structure**: Elements use `border-[3px] border-black` and `shadow-[4px_4px_0px_0px_#000000]`. No rounded corners.
- **Interactions**: Hover states translate elements up/left (`hover:-translate-x-1 hover:-translate-y-1`) and expand shadows (`hover:shadow-[8px_8px_0px_0px_#000000]`).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository** (if applicable) or download the source code.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000` (or the port specified by Vite).

## 🧠 How the AI Works

The application constructs a dynamic prompt based on the user's form inputs. It uses the `@google/genai` SDK's `responseSchema` feature to force the Gemini model to return a strictly typed JSON object. This ensures the UI never breaks and the output is consistently formatted into the correct sections.

## 📁 Project Structure

- `/src/App.tsx` - The main application component containing the form, state management, and AI logic.
- `/src/index.css` - Global CSS containing the Tailwind imports and font definitions.
- `/src/main.tsx` - The React entry point.
- `.env.example` - Example environment variables file.

## 📝 License

MIT License - feel free to use this as a subpage in your portfolio or adapt it for your own projects!
