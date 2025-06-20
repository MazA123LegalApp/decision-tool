"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Zap } from "lucide-react"

interface AssessmentData {
  softwareName: string
  requestingTeam: string
  businessNeed: string
  currentSolution: string
  urgency: string
  budget: string
  users: string
  alternatives: string[]
  riskTolerance: string
  implementation: string
}

export default function SoftwareAssessment() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<AssessmentData>({
    softwareName: "",
    requestingTeam: "",
    businessNeed: "",
    currentSolution: "",
    urgency: "",
    budget: "",
    users: "",
    alternatives: [],
    riskTolerance: "",
    implementation: "",
  })

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleAlternativeChange = (alternative: string, checked: boolean) => {
    if (checked) {
      setData((prev) => ({ ...prev, alternatives: [...prev.alternatives, alternative] }))
    } else {
      setData((prev) => ({ ...prev, alternatives: prev.alternatives.filter((a) => a !== alternative) }))
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="softwareName">Software/Tool Name</Label>
              <Input
                id="softwareName"
                value={data.softwareName}
                onChange={(e) => setData((prev) => ({ ...prev, softwareName: e.target.value }))}
                placeholder="e.g., Slack, Microsoft Project, Adobe Creative Suite"
              />
            </div>
            <div>
              <Label htmlFor="requestingTeam">Requesting Team/Region</Label>
              <Input
                id="requestingTeam"
                value={data.requestingTeam}
                onChange={(e) => setData((prev) => ({ ...prev, requestingTeam: e.target.value }))}
                placeholder="e.g., London Office, Marketing Team, IT Department"
              />
            </div>
            <div>
              <Label htmlFor="businessNeed">Business Need Description</Label>
              <Textarea
                id="businessNeed"
                value={data.businessNeed}
                onChange={(e) => setData((prev) => ({ ...prev, businessNeed: e.target.value }))}
                placeholder="Describe the specific business problem this software would solve..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="currentSolution">Current Solution (if any)</Label>
              <Textarea
                id="currentSolution"
                value={data.currentSolution}
                onChange={(e) => setData((prev) => ({ ...prev, currentSolution: e.target.value }))}
                placeholder="How are you currently handling this need? What tools are you using?"
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>How urgent is this need?</Label>
              <RadioGroup
                value={data.urgency}
                onValueChange={(value) => setData((prev) => ({ ...prev, urgency: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical">Critical - Blocking daily operations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High - Significant efficiency gains expected</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium - Would be helpful but not essential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low - Nice to have</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="budget">Estimated Annual Budget</Label>
              <RadioGroup
                value={data.budget}
                onValueChange={(value) => setData((prev) => ({ ...prev, budget: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under-1k" id="under-1k" />
                  <Label htmlFor="under-1k">Under $1,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1k-5k" id="1k-5k" />
                  <Label htmlFor="1k-5k">$1,000 - $5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5k-25k" id="5k-25k" />
                  <Label htmlFor="5k-25k">$5,000 - $25,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-25k" id="over-25k" />
                  <Label htmlFor="over-25k">Over $25,000</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="users">Expected Number of Users</Label>
              <Input
                id="users"
                value={data.users}
                onChange={(e) => setData((prev) => ({ ...prev, users: e.target.value }))}
                placeholder="e.g., 5, 50, 500"
                type="number"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Have you considered these alternatives?</Label>
              <div className="space-y-3 mt-3">
                {[
                  "Existing Dentons tools/software",
                  "Free or open-source alternatives",
                  "Manual processes/workarounds",
                  "Training on current tools",
                  "Process improvements without new software",
                ].map((alternative) => (
                  <div key={alternative} className="flex items-center space-x-2">
                    <Checkbox
                      id={alternative}
                      checked={data.alternatives.includes(alternative)}
                      onCheckedChange={(checked) => handleAlternativeChange(alternative, checked as boolean)}
                    />
                    <Label htmlFor={alternative}>{alternative}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Risk Tolerance</Label>
              <RadioGroup
                value={data.riskTolerance}
                onValueChange={(value) => setData((prev) => ({ ...prev, riskTolerance: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="risk-low" />
                  <Label htmlFor="risk-low">Low - Prefer proven, established solutions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="risk-medium" />
                  <Label htmlFor="risk-medium">Medium - Open to newer solutions with good reviews</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="risk-high" />
                  <Label htmlFor="risk-high">High - Willing to try cutting-edge solutions</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="implementation">Implementation Plan</Label>
              <Textarea
                id="implementation"
                value={data.implementation}
                onChange={(e) => setData((prev) => ({ ...prev, implementation: e.target.value }))}
                placeholder="How do you plan to implement this software? Who will manage it? What's the timeline?"
                rows={4}
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Software:</strong> {data.softwareName || "Not specified"}
                </p>
                <p>
                  <strong>Team:</strong> {data.requestingTeam || "Not specified"}
                </p>
                <p>
                  <strong>Urgency:</strong> {data.urgency || "Not specified"}
                </p>
                <p>
                  <strong>Budget:</strong> {data.budget || "Not specified"}
                </p>
                <p>
                  <strong>Users:</strong> {data.users || "Not specified"}
                </p>
                <p>
                  <strong>Alternatives Considered:</strong> {data.alternatives.length} options
                </p>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Software Purchase Assessment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Basic Information"}
                {step === 2 && "Requirements & Budget"}
                {step === 3 && "Alternatives & Risk"}
                {step === 4 && "Implementation & Review"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Tell us about the software you're considering"}
                {step === 2 && "Help us understand the urgency and scope"}
                {step === 3 && "Consider alternatives and assess risk tolerance"}
                {step === 4 && "Plan implementation and review your assessment"}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrev} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Link href={`/software-results?data=${encodeURIComponent(JSON.stringify(data))}`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  Generate Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
