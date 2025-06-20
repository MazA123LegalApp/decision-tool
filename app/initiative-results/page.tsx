"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  TrendingUp,
  Users,
  Shield,
  Cog,
  Building,
  AlertCircle,
} from "lucide-react"

interface InitiativeData {
  initiativeName: string
  initiativeOwner: string
  region: string
  description: string
  objectives: string
  projectSize: string
  requirements: any[]
  capabilityMapping: any[]
  strategicAlignment: number
  alignmentJustification: string
  leadershipSupport: number
  culturalReadiness: number
  changeCapacity: number
  internalCapability: number
  resourceAvailability: number
  skillsGap: string
  systemsCompatibility: number
  dataRequirements: string
  technicalComplexity: string
  governanceStructure: number
  stakeholderEngagement: number
  rolesClarity: string
  enablers: any[]
  barriers: any[]
  decisionCriteria: any[]
  expectedUsers: string
  annualCostExisting: string
  annualCostNew: string
  implementationWeeks: string
  trainingNeeded: boolean
  productivityGain: string
}

interface FeasibilityScores {
  strategicAlignment: number
  organizationalReadiness: number
  deliveryCapacity: number
  technologyFit: number
  governance: number
  riskProfile: number
}

export default function InitiativeResults() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<InitiativeData | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [feasibilityRating, setFeasibilityRating] = useState("")
  const [scores, setScores] = useState<FeasibilityScores>({
    strategicAlignment: 0,
    organizationalReadiness: 0,
    deliveryCapacity: 0,
    technologyFit: 0,
    governance: 0,
    riskProfile: 0,
  })
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [riskFactors, setRiskFactors] = useState<string[]>([])

  useEffect(() => {
    const dataParam = searchParams.get("data")
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam))
        setData(parsedData)

        // Calculate comprehensive feasibility scores
        const calculatedScores = calculateFeasibilityScores(parsedData)
        setScores(calculatedScores)

        // Calculate overall score
        const overall =
          Object.values(calculatedScores).reduce((sum, score) => sum + score, 0) / Object.keys(calculatedScores).length
        setOverallScore(Math.round(overall))

        // Generate rating and recommendations
        const { rating, recs, risks } = generateFeasibilityAssessment(overall, calculatedScores, parsedData)
        setFeasibilityRating(rating)
        setRecommendations(recs)
        setRiskFactors(risks)
      } catch (error) {
        console.error("Error parsing data:", error)
      }
    }
  }, [searchParams])

  const calculateFeasibilityScores = (data: InitiativeData): FeasibilityScores => {
    // Strategic Alignment (0-100)
    const strategicAlignment = (data.strategicAlignment || 3) * 20

    // Organizational Readiness (0-100)
    const organizationalReadiness = Math.round(
      (((data.leadershipSupport || 3) + (data.culturalReadiness || 3) + (data.changeCapacity || 3)) / 3) * 20,
    )

    // Delivery Capacity (0-100)
    const deliveryCapacity = Math.round((((data.internalCapability || 3) + (data.resourceAvailability || 3)) / 2) * 20)

    // Technology Fit (0-100)
    let technologyFit = (data.systemsCompatibility || 3) * 20
    if (data.technicalComplexity === "high") technologyFit -= 20
    else if (data.technicalComplexity === "medium") technologyFit -= 10
    technologyFit = Math.max(0, Math.min(100, technologyFit))

    // Governance (0-100)
    const governance = Math.round((((data.governanceStructure || 3) + (data.stakeholderEngagement || 3)) / 2) * 20)

    // Risk Profile (0-100) - Higher score means lower risk
    const enablerScore = data.enablers?.reduce((sum, e) => sum + (e.impact || 0), 0) || 0
    const barrierScore = data.barriers?.reduce((sum, b) => sum + (b.impact || 0), 0) || 0
    const riskProfile = Math.max(0, Math.min(100, 50 + (enablerScore - barrierScore) * 5))

    return {
      strategicAlignment,
      organizationalReadiness,
      deliveryCapacity,
      technologyFit,
      governance,
      riskProfile,
    }
  }

  const generateFeasibilityAssessment = (overallScore: number, scores: FeasibilityScores, data: InitiativeData) => {
    let rating = ""
    let recs: string[] = []
    const risks: string[] = []

    // Determine overall rating
    if (overallScore >= 75) {
      rating = "GREEN - LIKELY TO SUCCEED"
      recs = [
        "Proceed with initiative planning and resource allocation",
        "Establish project governance and success metrics",
        "Begin stakeholder communication and change management",
        "Develop detailed implementation roadmap",
        "Monitor progress against feasibility assumptions",
      ]
    } else if (overallScore >= 50) {
      rating = "AMBER - CONDITIONAL SUCCESS"
      recs = [
        "Address identified risk factors before full commitment",
        "Develop mitigation strategies for key barriers",
        "Consider phased or pilot approach",
        "Strengthen stakeholder engagement and support",
        "Reassess feasibility after addressing critical gaps",
      ]
    } else {
      rating = "RED - HIGH RISK"
      recs = [
        "Significant concerns identified - reconsider initiative",
        "Address fundamental readiness and capability gaps",
        "Consider alternative approaches or timing",
        "Seek expert consultation and additional resources",
        "Revisit initiative scope and objectives",
      ]
    }

    // Identify specific risk factors
    if (scores.strategicAlignment < 60) risks.push("Poor strategic alignment")
    if (scores.organizationalReadiness < 60) risks.push("Organization not ready for change")
    if (scores.deliveryCapacity < 60) risks.push("Insufficient delivery capacity")
    if (scores.technologyFit < 60) risks.push("Technology compatibility issues")
    if (scores.governance < 60) risks.push("Weak governance structure")
    if (scores.riskProfile < 60) risks.push("High barrier-to-enabler ratio")

    // Additional risk factors based on data
    if (data.projectSize === "large" && scores.organizationalReadiness < 70) {
      risks.push("Large initiative with organizational readiness concerns")
    }
    if (data.technicalComplexity === "high" && scores.technologyFit < 70) {
      risks.push("High technical complexity with system compatibility issues")
    }
    if (data.barriers?.length > data.enablers?.length) {
      risks.push("More barriers than enablers identified")
    }

    return { rating, recs, risks }
  }

  const getRatingColor = (rating: string) => {
    if (rating.includes("GREEN")) return "text-green-600"
    if (rating.includes("AMBER")) return "text-yellow-600"
    return "text-red-600"
  }

  const getRatingBackground = (rating: string) => {
    if (rating.includes("GREEN")) return "bg-green-50 border-green-200"
    if (rating.includes("AMBER")) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  const getRatingIcon = (rating: string) => {
    if (rating.includes("GREEN")) return <CheckCircle className="h-6 w-6 text-green-600" />
    if (rating.includes("AMBER")) return <AlertTriangle className="h-6 w-6 text-yellow-600" />
    return <XCircle className="h-6 w-6 text-red-600" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const generateDetailedReport = () => {
    if (!data) return

    const report = `
DENTONS STRATEGIC INITIATIVE FEASIBILITY ASSESSMENT
==================================================

Initiative: ${data.initiativeName}
Owner: ${data.initiativeOwner}
Region: ${data.region}
Assessment Date: ${new Date().toLocaleDateString()}
Project Size: ${data.projectSize}

EXECUTIVE SUMMARY
================
Overall Feasibility Score: ${overallScore}/100
Feasibility Rating: ${feasibilityRating}

DETAILED SCORING BREAKDOWN
=========================
Strategic Alignment: ${scores.strategicAlignment}/100
Organizational Readiness: ${scores.organizationalReadiness}/100
Delivery Capacity: ${scores.deliveryCapacity}/100
Technology Fit: ${scores.technologyFit}/100
Governance: ${scores.governance}/100
Risk Profile: ${scores.riskProfile}/100

INITIATIVE DESCRIPTION
=====================
${data.description}

OBJECTIVES
==========
${data.objectives}

REQUIREMENTS ANALYSIS
====================
Total Requirements: ${data.requirements?.length || 0}
Capability Mappings: ${data.capabilityMapping?.length || 0}

FORCE FIELD ANALYSIS
===================
Enablers: ${data.enablers?.length || 0} identified
Barriers: ${data.barriers?.length || 0} identified

RISK FACTORS
============
${riskFactors.map((risk) => `- ${risk}`).join("\n")}

RECOMMENDATIONS
===============
${recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

BUSINESS CASE SUMMARY
====================
Expected Users: ${data.expectedUsers || "Not specified"}
Implementation Time: ${data.implementationWeeks || "Not specified"} weeks
Annual Cost (Existing): $${data.annualCostExisting || "0"}
Annual Cost (New): $${data.annualCostNew || "0"}
Expected Productivity Gain: ${data.productivityGain || "0"}%
Training Required: ${data.trainingNeeded ? "Yes" : "No"}

ASSESSMENT METHODOLOGY
=====================
This assessment uses a comprehensive 6-factor evaluation framework:
1. Strategic Alignment (20%) - Alignment with firm objectives
2. Organizational Readiness (20%) - Leadership, culture, change capacity
3. Delivery Capacity (20%) - Internal capability and resources
4. Technology Fit (15%) - Systems compatibility and technical complexity
5. Governance (15%) - Structure and stakeholder engagement
6. Risk Profile (10%) - Force field analysis of enablers vs barriers

Generated by Dentons Decision Support Portal
Strategic Initiative Feasibility Framework v1.0
    `

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `initiative-assessment-${data.initiativeName.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600">Loading assessment results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
            </Link>
            <Button onClick={generateDetailedReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Feasibility Assessment Results</h1>
            <p className="text-xl text-slate-600">Strategic Initiative Assessment for {data.initiativeName}</p>
            <Badge variant="outline" className="mt-2">
              {data.projectSize} Initiative
            </Badge>
          </div>

          {/* Overall Rating Card */}
          <Card className={`border-2 shadow-lg ${getRatingBackground(feasibilityRating)}`}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl mb-4">Feasibility Assessment</CardTitle>
              <div className={`text-7xl font-bold ${getScoreColor(overallScore)} mb-4`}>{overallScore}/100</div>
              <div className="flex items-center justify-center space-x-3">
                {getRatingIcon(feasibilityRating)}
                <Badge
                  variant={
                    feasibilityRating.includes("GREEN")
                      ? "default"
                      : feasibilityRating.includes("AMBER")
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-lg px-6 py-2"
                >
                  {feasibilityRating}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="scores" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="scores">Score Breakdown</TabsTrigger>
              <TabsTrigger value="capability">Capability Analysis</TabsTrigger>
              <TabsTrigger value="force-field">Force Field Analysis</TabsTrigger>
              <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(scores).map(([key, score]) => {
                  const icons = {
                    strategicAlignment: TrendingUp,
                    organizationalReadiness: Users,
                    deliveryCapacity: Shield,
                    technologyFit: Cog,
                    governance: Building,
                    riskProfile: AlertCircle,
                  }
                  const Icon = icons[key as keyof typeof icons]
                  const labels = {
                    strategicAlignment: "Strategic Alignment",
                    organizationalReadiness: "Organizational Readiness",
                    deliveryCapacity: "Delivery Capacity",
                    technologyFit: "Technology Fit",
                    governance: "Governance",
                    riskProfile: "Risk Profile",
                  }

                  return (
                    <Card key={key} className="text-center">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-center mb-2">
                          <Icon className="h-6 w-6 text-slate-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-slate-700">
                          {labels[key as keyof typeof labels]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-3xl font-bold ${getScoreColor(score)} mb-2`}>{score}/100</div>
                        <Progress value={score} className="h-2" />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="capability" className="space-y-6">
              {data.requirements && data.requirements.length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements vs Existing Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.requirements.map((req: any) => {
                          const mapping = data.capabilityMapping?.find((m: any) => m.requirementId === req.id)
                          return (
                            <div key={req.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">{req.title}</h4>
                                  <Badge variant="outline" size="sm">
                                    {req.priority} have
                                  </Badge>
                                </div>
                                {mapping && (
                                  <Badge
                                    variant={
                                      mapping.fit === "full"
                                        ? "default"
                                        : mapping.fit.includes("partial")
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {mapping.fit.replace("-", " ")} fit
                                  </Badge>
                                )}
                              </div>
                              {req.description && <p className="text-sm text-gray-600 mb-2">{req.description}</p>}
                              {mapping && (
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Existing Tool:</strong> {mapping.toolName || "None identified"}
                                  </div>
                                  <div>
                                    <strong>Gap:</strong> {mapping.gapDescription || "None specified"}
                                  </div>
                                  {mapping.workaround && (
                                    <div className="md:col-span-2">
                                      <strong>Workaround:</strong> {mapping.workaround}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {data.decisionCriteria && data.decisionCriteria.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Decision Matrix Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {data.decisionCriteria
                                .reduce((sum: number, item: any) => sum + (item.scoreExisting * item.weight) / 100, 0)
                                .toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">Enhance Existing</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {data.decisionCriteria
                                .reduce((sum: number, item: any) => sum + (item.scoreNew * item.weight) / 100, 0)
                                .toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">New Solution</div>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          {(() => {
                            const existingTotal = data.decisionCriteria.reduce(
                              (sum: number, item: any) => sum + (item.scoreExisting * item.weight) / 100,
                              0,
                            )
                            const newTotal = data.decisionCriteria.reduce(
                              (sum: number, item: any) => sum + (item.scoreNew * item.weight) / 100,
                              0,
                            )
                            return existingTotal > newTotal ? (
                              <Badge variant="default" className="text-lg px-4 py-2">
                                Matrix Recommends: Enhance Existing
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-lg px-4 py-2">
                                Matrix Recommends: New Solution
                              </Badge>
                            )
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-600">No capability analysis data available.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="force-field" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Enablers (Supporting Factors)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.enablers && data.enablers.length > 0 ? (
                      <div className="space-y-3">
                        {data.enablers.map((enabler: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <span className="flex-1">{enabler.description}</span>
                            <Badge variant="outline" className="ml-2">
                              Impact: {enabler.impact}/5
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No enablers identified.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700">Barriers (Hindering Factors)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.barriers && data.barriers.length > 0 ? (
                      <div className="space-y-3">
                        {data.barriers.map((barrier: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded">
                            <span className="flex-1">{barrier.description}</span>
                            <Badge variant="outline" className="ml-2">
                              Impact: {barrier.impact}/5
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No barriers identified.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    Identified Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {riskFactors.length > 0 ? (
                    <ul className="space-y-2">
                      {riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-700">No significant risk factors identified.</p>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Initiative Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Owner:</strong> {data.initiativeOwner}
                    </div>
                    <div>
                      <strong>Region:</strong> {data.region}
                    </div>
                    <div>
                      <strong>Size:</strong>
                      <Badge variant="outline" className="ml-2">
                        {data.projectSize}
                      </Badge>
                    </div>
                    <div>
                      <strong>Expected Users:</strong> {data.expectedUsers || "Not specified"}
                    </div>
                    <div>
                      <strong>Implementation:</strong> {data.implementationWeeks || "Not specified"} weeks
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Case Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Cost (Existing):</strong> ${data.annualCostExisting || "0"}
                    </div>
                    <div>
                      <strong>Cost (New):</strong> ${data.annualCostNew || "0"}
                    </div>
                    <div>
                      <strong>Productivity Gain:</strong> {data.productivityGain || "0"}%
                    </div>
                    <div>
                      <strong>Training Required:</strong> {data.trainingNeeded ? "Yes" : "No"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Initiative Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed mb-4">{data.description}</p>
                  {data.objectives && (
                    <>
                      <h4 className="font-medium mb-2">Key Objectives:</h4>
                      <p className="text-slate-700 leading-relaxed">{data.objectives}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link href="/initiative-assessment">
              <Button variant="outline" size="lg">
                Start New Assessment
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Return to Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
