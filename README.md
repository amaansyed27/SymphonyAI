# SymphonyAI: AI-Powered Project Builder

SymphonyAI is an interactive, AI-driven platform for rapidly planning, designing, and deploying modern web, mobile, desktop, or proprietary software projects. It guides users through every stage of the product development lifecycle, leveraging generative AI to provide tailored recommendations, feature brainstorming, tech stack selection, UI/UX design, builder tool suggestions, and deployment strategies.

## Features

- **Guided Project Creation:**
  - Step-by-step wizard for defining platform, audience, budget, timeline, and experience level.
  - Dynamic questionnaire to collect project requirements.

- **Feature Brainstorming:**
  - AI-powered generation of must-have and optional features based on project context.
  - Interactive chat for feature ideation and refinement.

- **Tech Stack Recommendations:**
  - AI suggests three stack options (Budget-Friendly, Balanced, Premium) tailored to your needs.
  - Considers platform, project type, audience, budget, and experience.

- **UI/UX Design Guidance:**
  - AI-generated color palettes, design styles, and inspiration sources.
  - UI flow generation for mapping user journeys and app screens.

- **Builder Tools Selection:**
  - Curated list of AI-powered and traditional development tools for each platform.
  - AI-enhanced tool info: pricing, features, reviews, setup time, and best use cases.
  - Chat-based setup and troubleshooting for selected tools.

- **Deployment Recommendations:**
  - AI-driven analysis of deployment platforms (Vercel, Netlify, Railway, etc.)
  - JSON-formatted recommendations: pricing, pros/cons, setup steps, scalability, and cost estimates.
  - CI/CD, domain, and security best practices.

- **Modular Roadmap:**
  - Side panel navigation for each stage: Name/Logo, Stack, Features, UI, Builder Tools, Deployment.
  - Progress tracking and stage completion.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI Integration:** Google Gemini API (via custom `useGemini` hook)

## Key Files & Structure

- `src/components/` — Main UI components and roadmap sections:
  - `SidePanel.tsx` — Orchestrates the multi-stage workflow.
  - `sections/` — Each stage (StackSelect, FeatureBrainstorm, UIDesign, UIFlow, BuilderTools, Deployment) is a modular React component.
- `src/hooks/useGemini.ts` — Handles all AI interactions (content, structured data, logo generation).
- `src/types/index.ts` — TypeScript interfaces for project data, features, tech stack, UI, tools, and deployment.
- `tailwind.config.js` — Tailwind CSS configuration.
- `vite.config.ts` — Vite build configuration.

## How It Works

1. **Start a New Project:**
   - Answer a guided questionnaire about your app idea.
2. **Feature Brainstorm:**
   - Let AI suggest and refine must-have features.
3. **Select Tech Stack:**
   - Get AI recommendations for frontend, backend, database, and hosting.
4. **Design UI/UX:**
   - Receive color palettes, design styles, and user flow diagrams.
5. **Choose Builder Tools:**
   - Pick from AI-powered and traditional dev tools, with AI guidance for setup.
6. **Plan Deployment:**
   - Get tailored deployment strategies, cost analysis, and best practices.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open in your browser:**
   - Visit [http://localhost:5173](http://localhost:5173)

## Customization

- **AI API Key:**
  - The app requires a Google Gemini API key for AI features. Enter your key when prompted.
- **Extend Stages:**
  - Add new roadmap stages by creating a new section in `src/components/sections/` and updating `SidePanel.tsx`.

## Example Use Case

- **Demo Project:**
  - Platform: Web Application
  - Type: Social media for fitness enthusiasts
  - Audience: Fitness enthusiasts, trainers
  - Budget: Medium ($500-$2000/month)
  - Timeline: Few months
  - Experience: Intermediate developer

## License

MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ using React, TypeScript, Tailwind CSS, and Google Gemini AI.*
