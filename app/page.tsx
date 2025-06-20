import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Target, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">Dentons Decision Support Portal</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900">
                How it Works
              </Link>
              <Link href="#assessments" className="text-slate-600 hover:text-slate-900">
                Assessments
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Make Better Decisions, Faster</h2>
            <p className="text-xl text-slate-600 mb-8">
              A lightweight internal tool that enables Dentons teams to make better, faster, and more consistent
              decisions before investing time or budget into new technology or strategic initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/software-assessment">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                  Start Software Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/initiative-assessment">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                >
                  Evaluate Initiative
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Use Cases */}
      <section id="assessments" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Two Main Assessment Types</h3>
            <p className="text-lg text-slate-600">Choose the assessment that matches your decision-making needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-slate-300 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl">Software Purchase Assessment</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Evaluate whether proposed software is genuinely needed and avoid duplicate purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Assess genuine need vs. existing tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Structured comparison framework</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Cost-benefit analysis</span>
                  </li>
                </ul>
                <Link href="/software-assessment">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Assessment</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-slate-300 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-xl">Strategic Initiative Feasibility</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Evaluate whether a new initiative is realistically achievable with current resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Readiness and alignment assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Force field analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Risk identification</span>
                  </li>
                </ul>
                <Link href="/initiative-assessment">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Assessment</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h3>
            <p className="text-lg text-slate-600">Three guiding principles for better decision-making</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-700">1</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Self-Service</h4>
              <p className="text-slate-600">Let teams answer key questions before escalating to leadership or IT</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">2</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Structure over Gut-Feel</h4>
              <p className="text-slate-600">Use proven tools like force field analysis and feasibility scoring</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-700">3</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Transparency</h4>
              <p className="text-slate-600">Make rationale visible and defensible to leadership and stakeholders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 Dentons Decision Support Portal. Internal use only.</p>
        </div>
      </footer>
    </div>
  )
}
