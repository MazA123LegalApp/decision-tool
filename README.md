# Dentons Decision Support Portal

A lightweight internal web tool that enables Dentons teams to make better, faster, and more consistent decisions before investing time or budget into new technology or strategic initiatives.

## Features

### 🎯 Two Main Assessment Types

1. **Software Purchase Assessment**
   - Assess genuine need vs. existing tools
   - Structured comparison framework
   - Cost-benefit analysis
   - Avoid duplicate tech purchases

2. **Strategic Initiative Feasibility**
   - Readiness and alignment assessment
   - Force field analysis
   - Risk identification
   - Resource availability evaluation

### 💡 Guiding Principles

- **Self-service**: Let teams answer key questions before escalating
- **Structure over gut-feel**: Use tools like force field analysis and feasibility scoring
- **Transparency**: Make rationale visible and defensible to leadership

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd dentons-decision-portal
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect this as a Next.js project and deploy it

### Deploy to GitHub Pages

1. Install `gh-pages` package:
\`\`\`bash
npm install --save-dev gh-pages
\`\`\`

2. Add these scripts to your `package.json`:
\`\`\`json
{
  "scripts": {
    "export": "next build && next export",
    "deploy": "gh-pages -d out"
  }
}
\`\`\`

3. Update `next.config.js`:
\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
\`\`\`

4. Deploy:
\`\`\`bash
npm run export
npm run deploy
\`\`\`

## Usage

### Software Purchase Assessment

1. Navigate to the Software Assessment page
2. Fill out the 4-step assessment form:
   - Basic Information
   - Requirements & Budget
   - Alternatives & Risk
   - Implementation & Review
3. Generate and download your assessment report

### Strategic Initiative Assessment

1. Navigate to the Initiative Assessment page
2. Complete the 4-step evaluation:
   - Initiative Overview
   - Resources & Timeline
   - Force Field Analysis
   - Risk & Success Metrics
3. Review feasibility score and recommendations

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                    # Home page
│   ├── software-assessment/        # Software assessment flow
│   ├── software-results/           # Software assessment results
│   ├── initiative-assessment/      # Initiative assessment flow
│   ├── initiative-results/         # Initiative assessment results
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   └── ui/                         # shadcn/ui components
├── lib/
│   └── utils.ts                    # Utility functions
└── public/                         # Static assets
\`\`\`

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for internal use at Dentons only.
