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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, Target, CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InitiativeData {
  // Basic Information
  initiativeName: string
  initiativeOwner: string
  region: string
  description: string
  objectives: string

  // Initiative Sizing
  projectSize: "small" | "medium" | "large" | ""

  // Requirements & Capability Assessment
  requirements: Requirement[]
  capabilityMapping: CapabilityMapping[]

  // Strategic Alignment
  strategicAlignment: number
  alignmentJustification: string

  // Organizational Readiness
  leadershipSupport: number
  culturalReadiness: number
  changeCapacity: number

  // Delivery Capacity & Resourcing
  internalCapability: number
  resourceAvailability: number
  skillsGap: string

  // Technology & Data Fit
  systemsCompatibility: number
  dataRequirements: string
  technicalComplexity: string

  // Governance & Stakeholder Buy-in
  governanceStructure: number
  stakeholderEngagement: number
  rolesClarity: string

  // Risk & Barrier Analysis
  enablers: ForceFieldItem[]
  barriers: ForceFieldItem[]

  // Decision Matrix
  decisionCriteria: DecisionCriterion[]

  // Business Case
  expectedUsers: string
  annualCostExisting: string
  annualCostNew: string
  implementationWeeks: string
  trainingNeeded: boolean
  productivityGain: string
}

interface Requirement {
  id: string
  title: string
  priority: "must" | "should" | "nice"
  description: string
}

interface CapabilityMapping {
  requirementId: string
  toolName: string
  fit: "full" | "partial-minor" | "partial-major" | "none"
  gapDescription: string
  workaround: string
  notes: string
}

interface ForceFieldItem {
  id: string
  description: string
  impact: number
}

interface DecisionCriterion {
  name: string
  weight: number
  scoreExisting: number
  scoreNew: number
  editable: boolean
}

const PROJECT_SIZE_CONFIG = {
  small: {
    title: "Small Initiative",
    description: "Minor operational or process-level change",
    modules: ["strategic", "readiness", "capacity"],
  },
  medium: {
    title: "Medium Initiative",
    description: "Department-level or cross-functional change",
    modules: ["strategic", "readiness", "capacity", "technology", "governance"],
  },
  large: {
    title: "Large Initiative",
    description: "Global or firm-wide, strategic impact",
    modules: ["strategic", "readiness", "capacity", "technology", "governance", "risk"],
  },
}

export default function InitiativeAssessment() {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<InitiativeData>({
    initiativeName: "",
    initiativeOwner: "",
    region: "",
    description: "",
    objectives: "",
    projectSize: "",
    requirements: [],
    capabilityMapping: [],
    strategicAlignment: 3,
    alignmentJustification: "",
    leadershipSupport: 3,
    culturalReadiness: 3,
    changeCapacity: 3,
    internalCapability: 3,
    resourceAvailability: 3,
    skillsGap: "",
    systemsCompatibility: 3,
    dataRequirements: "",
    technicalComplexity: "",
    governanceStructure: 3,
    stakeholderEngagement: 3,
    rolesClarity: "",
    enablers: [],
    barriers: [],
    decisionCriteria: [
      { name: "Meets Functional Needs", weight: 30, scoreExisting: 3, scoreNew: 3, editable: false },
      { name: "Cost (CapEx + OpEx)", weight: 25, scoreExisting: 3, scoreNew: 3, editable: false },
      { name: "Implementation Time", weight: 15, scoreExisting: 3, scoreNew: 3, editable: false },
      { name: "Internal Supportability", weight: 15, scoreExisting: 3, scoreNew: 3, editable: false },
      { name: "Strategic Fit", weight: 15, scoreExisting: 3, scoreNew: 3, editable: false },
    ],
    expectedUsers: "",
    annualCostExisting: "",
    annualCostNew: "",
    implementationWeeks: "",
    trainingNeeded: false,
    productivityGain: "",
  })

  const getStepsForSize = (size: string) => {
    const baseSteps = [
      { id: 1, title: "Basic Information", description: "Initiative details and sizing" },
      { id: 2, title: "Requirements & Capability", description: "Define needs and assess existing tools" },
    ]

    if (!size) return baseSteps

    const config = PROJECT_SIZE_CONFIG[size as keyof typeof PROJECT_SIZE_CONFIG]
    const moduleSteps = []

    if (config.modules.includes("strategic")) {
      moduleSteps.push({ id: 3, title: "Strategic Alignment", description: "Alignment with firm objectives" })
    }
    if (config.modules.includes("readiness")) {
      moduleSteps.push({ id: 4, title: "Organizational Readiness", description: "People, culture, and leadership" })
    }
    if (config.modules.includes("capacity")) {
      moduleSteps.push({ id: 5, title: "Delivery Capacity", description: "Resources and capabilities" })
    }
    if (config.modules.includes("technology")) {
      moduleSteps.push({ id: 6, title: "Technology & Data Fit", description: "Systems and technical requirements" })
    }
    if (config.modules.includes("governance")) {
      moduleSteps.push({ id: 7, title: "Governance & Stakeholders", description: "Structure and buy-in" })
    }
    if (config.modules.includes("risk")) {
      moduleSteps.push({ id: 8, title: "Risk & Barrier Analysis", description: "Force field analysis" })
    }

    moduleSteps.push({
      id: 9,
      title: "Decision Matrix & Business Case",
      description: "Final evaluation and recommendations",
    })

    return [...baseSteps, ...moduleSteps]
  }

  const steps = getStepsForSize(data.projectSize)
  const maxSteps = steps.length

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!data.initiativeName.trim()) newErrors.initiativeName = "Initiative name is required"
        if (!data.initiativeOwner.trim()) newErrors.initiativeOwner = "Initiative owner is required"
        if (!data.region.trim()) newErrors.region = "Region is required"
        if (!data.description.trim()) newErrors.description = "Description is required"
        if (!data.projectSize) newErrors.projectSize = "Project size must be selected"
        break
      case 2:
        if (data.requirements.length === 0) {
          newErrors.requirements = "Please add at least one requirement"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step) && step < maxSteps) {
      setStep(step + 1)
      setErrors({})
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
    }
  }

  const addRequirement = () => {
    const newReq: Requirement = {
      id: Date.now().toString(),
      title: "",
      priority: "should",
      description: "",
    }
    setData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, newReq],
    }))
  }

  const updateRequirement = (id: string, field: keyof Requirement, value: any) => {
    setData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req) => (req.id === id ? { ...req, [field]: value } : req)),
    }))
  }

  const removeRequirement = (id: string) => {
    setData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((req) => req.id !== id),
      capabilityMapping: prev.capabilityMapping.filter((mapping) => mapping.requirementId !== id),
    }))
  }

  const updateCapabilityMapping = (requirementId: string, field: keyof CapabilityMapping, value: any) => {
    setData((prev) => {
      const existingIndex = prev.capabilityMapping.findIndex((m) => m.requirementId === requirementId)
      if (existingIndex >= 0) {
        const updated = [...prev.capabilityMapping]
        updated[existingIndex] = { ...updated[existingIndex], [field]: value }
        return { ...prev, capabilityMapping: updated }
      } else {
        const newMapping: CapabilityMapping = {
          requirementId,
          toolName: "",
          fit: "none",
          gapDescription: "",
          workaround: "",
          notes: "",
          [field]: value,
        }
        return { ...prev, capabilityMapping: [...prev.capabilityMapping, newMapping] }
      }
    })
  }

  const addForceFieldItem = (type: "enablers" | "barriers") => {
    const newItem: ForceFieldItem = {
      id: Date.now().toString(),
      description: "",
      impact: 3,
    }
    setData((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }))
  }

  const updateForceFieldItem = (type: "enablers" | "barriers", id: string, field: keyof ForceFieldItem, value: any) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeForceFieldItem = (type: "enablers" | "barriers", id: string) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }))
  }

  const updateDecisionCriterion = (index: number, field: keyof DecisionCriterion, value: any) => {
    setData((prev) => ({
      ...prev,
      decisionCriteria: prev.decisionCriteria.map((criterion, i) =>
        i === index ? { ...criterion, [field]: value } : criterion,
      ),
    }))
  }

  const addCustomCriterion = () => {
    const newCriterion: DecisionCriterion = {
      name: "",
      weight: 10,
      scoreExisting: 3,
      scoreNew: 3,
      editable: true,
    }
    setData((prev) => ({
      ...prev,
      decisionCriteria: [...prev.decisionCriteria, newCriterion],
    }))
  }

  const removeCustomCriterion = (index: number) => {
    setData((prev) => ({
      ...prev,
      decisionCriteria: prev.decisionCriteria.filter((_, i) => i !== index),
    }))
  }

  const renderStep = () => {
    const currentStepData = steps.find((s) => s.id === step)

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="initiativeName" className="text-sm font-medium">
                  Initiative Name *
                </Label>
                <Input
                  id="initiativeName"
                  value={data.initiativeName}
                  onChange={(e) => setData((prev) => ({ ...prev, initiativeName: e.target.value }))}
                  placeholder="e.g., Global Client Portal Implementation"
                  className={errors.initiativeName ? "border-red-500" : ""}
                />
                {errors.initiativeName && <p className="text-sm text-red-600 mt-1">{errors.initiativeName}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="initiativeOwner" className="text-sm font-medium">
                    Initiative Owner *
                  </Label>
                  <Input
                    id="initiativeOwner"
                    value={data.initiativeOwner}
                    onChange={(e) => setData((prev) => ({ ...prev, initiativeOwner: e.target.value }))}
                    placeholder="Name of the initiative owner"
                    className={errors.initiativeOwner ? "border-red-500" : ""}
                  />
                  {errors.initiativeOwner && <p className="text-sm text-red-600 mt-1">{errors.initiativeOwner}</p>}
                </div>

                <div>
                  <Label htmlFor="region" className="text-sm font-medium">
                    Region *
                  </Label>
                  <Select
                    value={data.region}
                    onValueChange={(value) => setData((prev) => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                      <SelectItem value="emea">EMEA</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-sm text-red-600 mt-1">{errors.region}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Initiative Description *
                </Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this initiative aims to achieve and its scope..."
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="objectives" className="text-sm font-medium">
                  Key Objectives
                </Label>
                <Textarea
                  id="objectives"
                  value={data.objectives}
                  onChange={(e) => setData((prev) => ({ ...prev, objectives: e.target.value }))}
                  placeholder="List the main objectives and success criteria..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Project Size *</Label>
                <RadioGroup
                  value={data.projectSize}
                  onValueChange={(value) => setData((prev) => ({ ...prev, projectSize: value as any }))}
                  className="space-y-3"
                >
                  {Object.entries(PROJECT_SIZE_CONFIG).map(([size, config]) => (
                    <div key={size} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={size} id={size} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={size} className="font-medium text-base">
                          {config.title}
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {config.modules.map((module) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                {errors.projectSize && <p className="text-sm text-red-600 mt-2">{errors.projectSize}</p>}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The project size determines which assessment modules will be required. Larger initiatives require more
                comprehensive evaluation.
              </AlertDescription>
            </Alert>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Define your functional requirements and assess how well existing tools can meet them. This helps
                determine if new solutions are truly needed.
              </AlertDescription>
            </Alert>

            {/* Requirements Section */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">1. Define Requirements</Label>
              <div className="space-y-4">
                {data.requirements.map((req, index) => (
                  <Card key={req.id} className="p-4">
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`req-title-${index}`}>Requirement Title</Label>
                          <Input
                            id={`req-title-${index}`}
                            value={req.title}
                            onChange={(e) => updateRequirement(req.id, "title", e.target.value)}
                            placeholder="e.g., Real-time collaboration"
                          />
                        </div>
                        <div>
                          <Label>Priority</Label>
                          <Select
                            value={req.priority}
                            onValueChange={(value) => updateRequirement(req.id, "priority", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="must">Must Have</SelectItem>
                              <SelectItem value="should">Should Have</SelectItem>
                              <SelectItem value="nice">Nice to Have</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button variant="outline" size="sm" onClick={() => removeRequirement(req.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={req.description}
                          onChange={(e) => updateRequirement(req.id, "description", e.target.value)}
                          placeholder="Detailed description of this requirement..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" onClick={addRequirement} className="w-full">
                  + Add Requirement
                </Button>
                {errors.requirements && <p className="text-sm text-red-600">{errors.requirements}</p>}
              </div>
            </div>

            {/* Capability Mapping */}
            {data.requirements.length > 0 && (
              <div>
                <Label className="text-lg font-semibold mb-4 block">2. Capability Mapping</Label>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Requirement</th>
                        <th className="border border-gray-300 p-3 text-left">Existing Tool</th>
                        <th className="border border-gray-300 p-3 text-left">Fit Level</th>
                        <th className="border border-gray-300 p-3 text-left">Gap Description</th>
                        <th className="border border-gray-300 p-3 text-left">Workaround/Enhancement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.requirements.map((req) => {
                        const mapping = data.capabilityMapping.find((m) => m.requirementId === req.id) || {
                          requirementId: req.id,
                          toolName: "",
                          fit: "none" as const,
                          gapDescription: "",
                          workaround: "",
                          notes: "",
                        }

                        return (
                          <tr key={req.id}>
                            <td className="border border-gray-300 p-3">
                              <div>
                                <div className="font-medium">{req.title}</div>
                                <Badge variant="outline" size="sm" className="mt-1">
                                  {req.priority} have
                                </Badge>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-3">
                              <Input
                                value={mapping.toolName}
                                onChange={(e) => updateCapabilityMapping(req.id, "toolName", e.target.value)}
                                placeholder="e.g., SharePoint, Teams"
                              />
                            </td>
                            <td className="border border-gray-300 p-3">
                              <Select
                                value={mapping.fit}
                                onValueChange={(value) => updateCapabilityMapping(req.id, "fit", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">Full Fit</SelectItem>
                                  <SelectItem value="partial-minor">Partial (Minor Workaround)</SelectItem>
                                  <SelectItem value="partial-major">Partial (Major Workaround)</SelectItem>
                                  <SelectItem value="none">No Fit</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="border border-gray-300 p-3">
                              <Textarea
                                value={mapping.gapDescription}
                                onChange={(e) => updateCapabilityMapping(req.id, "gapDescription", e.target.value)}
                                placeholder="What's missing?"
                                rows={2}
                              />
                            </td>
                            <td className="border border-gray-300 p-3">
                              <Textarea
                                value={mapping.workaround}
                                onChange={(e) => updateCapabilityMapping(req.id, "workaround", e.target.value)}
                                placeholder="Configuration or process changes needed"
                                rows={2}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Strategic Alignment Assessment</Label>
              <p className="text-sm text-gray-600 mb-6">
                Evaluate how well this initiative aligns with Dentons' strategic objectives and priorities.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Strategic Alignment Score: {data.strategicAlignment}/5
                  </Label>
                  <Slider
                    value={[data.strategicAlignment]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, strategicAlignment: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor Alignment</span>
                    <span>Excellent Alignment</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="alignmentJustification" className="text-sm font-medium">
                    Alignment Justification
                  </Label>
                  <Textarea
                    id="alignmentJustification"
                    value={data.alignmentJustification}
                    onChange={(e) => setData((prev) => ({ ...prev, alignmentJustification: e.target.value }))}
                    placeholder="Explain how this initiative supports firm strategy, client needs, or operational excellence..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Organizational Readiness Assessment</Label>
              <p className="text-sm text-gray-600 mb-6">
                Assess whether the organization is ready for this change in terms of leadership, culture, and capacity.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Leadership Support: {data.leadershipSupport}/5
                  </Label>
                  <Slider
                    value={[data.leadershipSupport]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, leadershipSupport: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>No Support</span>
                    <span>Strong Support</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Cultural Readiness: {data.culturalReadiness}/5
                  </Label>
                  <Slider
                    value={[data.culturalReadiness]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, culturalReadiness: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Resistant to Change</span>
                    <span>Embraces Change</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Change Capacity: {data.changeCapacity}/5</Label>
                  <Slider
                    value={[data.changeCapacity]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, changeCapacity: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Overloaded</span>
                    <span>Available Capacity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Delivery Capacity & Resourcing</Label>
              <p className="text-sm text-gray-600 mb-6">
                Evaluate internal capabilities and resource availability for successful delivery.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Internal Capability: {data.internalCapability}/5
                  </Label>
                  <Slider
                    value={[data.internalCapability]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, internalCapability: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Need External Help</span>
                    <span>Strong Internal Capability</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Resource Availability: {data.resourceAvailability}/5
                  </Label>
                  <Slider
                    value={[data.resourceAvailability]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, resourceAvailability: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Limited Resources</span>
                    <span>Adequate Resources</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="skillsGap" className="text-sm font-medium">
                    Skills Gap Analysis
                  </Label>
                  <Textarea
                    id="skillsGap"
                    value={data.skillsGap}
                    onChange={(e) => setData((prev) => ({ ...prev, skillsGap: e.target.value }))}
                    placeholder="Identify any skills gaps and how they might be addressed..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Technology & Data Fit</Label>
              <p className="text-sm text-gray-600 mb-6">
                Assess technical requirements and compatibility with existing systems.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Systems Compatibility: {data.systemsCompatibility}/5
                  </Label>
                  <Slider
                    value={[data.systemsCompatibility]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, systemsCompatibility: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Major Changes Needed</span>
                    <span>Fully Compatible</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dataRequirements" className="text-sm font-medium">
                    Data Requirements
                  </Label>
                  <Textarea
                    id="dataRequirements"
                    value={data.dataRequirements}
                    onChange={(e) => setData((prev) => ({ ...prev, dataRequirements: e.target.value }))}
                    placeholder="Describe data needs, migration requirements, integration points..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Technical Complexity</Label>
                  <RadioGroup
                    value={data.technicalComplexity}
                    onValueChange={(value) => setData((prev) => ({ ...prev, technicalComplexity: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="tech-low" />
                      <Label htmlFor="tech-low">Low - Minimal technical changes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="tech-medium" />
                      <Label htmlFor="tech-medium">Medium - Some integration required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="tech-high" />
                      <Label htmlFor="tech-high">High - Significant technical work</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Governance & Stakeholder Buy-in</Label>
              <p className="text-sm text-gray-600 mb-6">
                Evaluate governance structures and stakeholder engagement levels.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Governance Structure: {data.governanceStructure}/5
                  </Label>
                  <Slider
                    value={[data.governanceStructure]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, governanceStructure: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Unclear Structure</span>
                    <span>Clear Governance</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Stakeholder Engagement: {data.stakeholderEngagement}/5
                  </Label>
                  <Slider
                    value={[data.stakeholderEngagement]}
                    onValueChange={(value) => setData((prev) => ({ ...prev, stakeholderEngagement: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor Engagement</span>
                    <span>Strong Buy-in</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rolesClarity" className="text-sm font-medium">
                    Roles & Responsibilities
                  </Label>
                  <Textarea
                    id="rolesClarity"
                    value={data.rolesClarity}
                    onChange={(e) => setData((prev) => ({ ...prev, rolesClarity: e.target.value }))}
                    placeholder="Describe key roles, decision-making authority, and accountability..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Risk & Barrier Analysis</Label>
              <p className="text-sm text-gray-600 mb-6">
                Use force field analysis to identify factors that will help or hinder success.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Enablers */}
                <div>
                  <Label className="text-base font-medium mb-3 block text-green-700">
                    Enablers (Supporting Factors)
                  </Label>
                  <div className="space-y-3">
                    {data.enablers.map((enabler) => (
                      <Card key={enabler.id} className="p-3 border-green-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Input
                              value={enabler.description}
                              onChange={(e) =>
                                updateForceFieldItem("enablers", enabler.id, "description", e.target.value)
                              }
                              placeholder="Describe the enabling factor..."
                              className="flex-1 mr-2"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeForceFieldItem("enablers", enabler.id)}
                            >
                              ×
                            </Button>
                          </div>
                          <div>
                            <Label className="text-xs">Impact: {enabler.impact}/5</Label>
                            <Slider
                              value={[enabler.impact]}
                              onValueChange={(value) =>
                                updateForceFieldItem("enablers", enabler.id, "impact", value[0])
                              }
                              max={5}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addForceFieldItem("enablers")}
                      className="w-full border-green-300 text-green-700"
                    >
                      + Add Enabler
                    </Button>
                  </div>
                </div>

                {/* Barriers */}
                <div>
                  <Label className="text-base font-medium mb-3 block text-red-700">Barriers (Hindering Factors)</Label>
                  <div className="space-y-3">
                    {data.barriers.map((barrier) => (
                      <Card key={barrier.id} className="p-3 border-red-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Input
                              value={barrier.description}
                              onChange={(e) =>
                                updateForceFieldItem("barriers", barrier.id, "description", e.target.value)
                              }
                              placeholder="Describe the barrier..."
                              className="flex-1 mr-2"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeForceFieldItem("barriers", barrier.id)}
                            >
                              ×
                            </Button>
                          </div>
                          <div>
                            <Label className="text-xs">Impact: {barrier.impact}/5</Label>
                            <Slider
                              value={[barrier.impact]}
                              onValueChange={(value) =>
                                updateForceFieldItem("barriers", barrier.id, "impact", value[0])
                              }
                              max={5}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addForceFieldItem("barriers")}
                      className="w-full border-red-300 text-red-700"
                    >
                      + Add Barrier
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-8">
            {/* Decision Matrix */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Decision Matrix</Label>
              <Card className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Criteria</th>
                        <th className="text-left p-3">Weight (%)</th>
                        <th className="text-left p-3">Enhance Existing (1-5)</th>
                        <th className="text-left p-3">New Solution (1-5)</th>
                        <th className="text-left p-3">Weighted Score</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.decisionCriteria.map((criterion, index) => {
                        const existingWeighted = (criterion.scoreExisting * criterion.weight) / 100
                        const newWeighted = (criterion.scoreNew * criterion.weight) / 100

                        return (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              {criterion.editable ? (
                                <Input
                                  value={criterion.name}
                                  onChange={(e) => updateDecisionCriterion(index, "name", e.target.value)}
                                  className="w-full"
                                />
                              ) : (
                                <span className="font-medium">{criterion.name}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={criterion.weight}
                                onChange={(e) => updateDecisionCriterion(index, "weight", Number(e.target.value))}
                                className="w-20"
                                min="0"
                                max="100"
                              />
                            </td>
                            <td className="p-3">
                              <Select
                                value={criterion.scoreExisting.toString()}
                                onValueChange={(value) =>
                                  updateDecisionCriterion(index, "scoreExisting", Number(value))
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <SelectItem key={score} value={score.toString()}>
                                      {score}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3">
                              <Select
                                value={criterion.scoreNew.toString()}
                                onValueChange={(value) => updateDecisionCriterion(index, "scoreNew", Number(value))}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <SelectItem key={score} value={score.toString()}>
                                      {score}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3">
                              <div className="text-sm">
                                <div>Existing: {existingWeighted.toFixed(2)}</div>
                                <div>New: {newWeighted.toFixed(2)}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              {criterion.editable && (
                                <Button variant="ghost" size="sm" onClick={() => removeCustomCriterion(index)}>
                                  Remove
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-bold">
                        <td className="p-3">Total Weighted Score</td>
                        <td className="p-3">{data.decisionCriteria.reduce((sum, c) => sum + c.weight, 0)}%</td>
                        <td className="p-3">
                          {data.decisionCriteria
                            .reduce((sum, c) => sum + (c.scoreExisting * c.weight) / 100, 0)
                            .toFixed(2)}
                        </td>
                        <td className="p-3">
                          {data.decisionCriteria.reduce((sum, c) => sum + (c.scoreNew * c.weight) / 100, 0).toFixed(2)}
                        </td>
                        <td className="p-3">
                          {(() => {
                            const existingTotal = data.decisionCriteria.reduce(
                              (sum, c) => sum + (c.scoreExisting * c.weight) / 100,
                              0,
                            )
                            const newTotal = data.decisionCriteria.reduce(
                              (sum, c) => sum + (c.scoreNew * c.weight) / 100,
                              0,
                            )
                            return existingTotal > newTotal ? (
                              <Badge variant="default">Enhance Existing</Badge>
                            ) : (
                              <Badge variant="secondary">New Solution</Badge>
                            )
                          })()}
                        </td>
                        <td className="p-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <Button variant="outline" onClick={addCustomCriterion} className="mt-4">
                  + Add Custom Criterion
                </Button>
              </Card>
            </div>

            {/* Business Case */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Business Case</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedUsers">Expected Users</Label>
                  <Input
                    id="expectedUsers"
                    type="number"
                    value={data.expectedUsers}
                    onChange={(e) => setData((prev) => ({ ...prev, expectedUsers: e.target.value }))}
                    placeholder="Number of users"
                  />
                </div>
                <div>
                  <Label htmlFor="implementationWeeks">Implementation Time (weeks)</Label>
                  <Input
                    id="implementationWeeks"
                    type="number"
                    value={data.implementationWeeks}
                    onChange={(e) => setData((prev) => ({ ...prev, implementationWeeks: e.target.value }))}
                    placeholder="Estimated weeks"
                  />
                </div>
                <div>
                  <Label htmlFor="annualCostExisting">Annual Cost - Enhance Existing ($)</Label>
                  <Input
                    id="annualCostExisting"
                    type="number"
                    value={data.annualCostExisting}
                    onChange={(e) => setData((prev) => ({ ...prev, annualCostExisting: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="annualCostNew">Annual Cost - New Solution ($)</Label>
                  <Input
                    id="annualCostNew"
                    type="number"
                    value={data.annualCostNew}
                    onChange={(e) => setData((prev) => ({ ...prev, annualCostNew: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="productivityGain">Expected Productivity Gain (%)</Label>
                  <Input
                    id="productivityGain"
                    type="number"
                    value={data.productivityGain}
                    onChange={(e) => setData((prev) => ({ ...prev, productivityGain: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trainingNeeded"
                    checked={data.trainingNeeded}
                    onCheckedChange={(checked) => setData((prev) => ({ ...prev, trainingNeeded: checked as boolean }))}
                  />
                  <Label htmlFor="trainingNeeded">Training Required</Label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Initiative:</strong> {data.initiativeName || "Not specified"}
                    </p>
                    <p>
                      <strong>Owner:</strong> {data.initiativeOwner || "Not specified"}
                    </p>
                    <p>
                      <strong>Region:</strong> {data.region || "Not specified"}
                    </p>
                    <p>
                      <strong>Size:</strong>
                      <Badge variant="outline" className="ml-2">
                        {data.projectSize || "Not specified"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Requirements:</strong> {data.requirements.length} defined
                    </p>
                    <p>
                      <strong>Enablers:</strong> {data.enablers.length} identified
                    </p>
                    <p>
                      <strong>Barriers:</strong> {data.barriers.length} identified
                    </p>
                    <p>
                      <strong>Expected Users:</strong> {data.expectedUsers || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = steps.find((s) => s.id === step)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-emerald-600" />
                <h1 className="text-xl font-semibold text-slate-900">Strategic Initiative Assessment</h1>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              Feasibility Evaluation Framework
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{currentStepData?.title}</h2>
                <p className="text-sm text-slate-600">{currentStepData?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">
                  Step {step} of {maxSteps}
                </div>
                <div className="text-sm text-slate-600">{Math.round((step / maxSteps) * 100)}% Complete</div>
              </div>
            </div>

            <Progress value={(step / maxSteps) * 100} className="h-2" />

            {/* Step indicators */}
            <div className="flex justify-between mt-4 overflow-x-auto">
              {steps.map((stepItem) => (
                <div key={stepItem.id} className="flex flex-col items-center min-w-0 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepItem.id < step
                        ? "bg-emerald-600 text-white"
                        : stepItem.id === step
                          ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-600"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {stepItem.id < step ? <CheckCircle2 className="h-4 w-4" /> : stepItem.id}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 text-center max-w-20 truncate">{stepItem.title}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-xl">{currentStepData?.title}</CardTitle>
              <CardDescription className="text-base">{currentStepData?.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrev} disabled={step === 1} className="px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < maxSteps ? (
              <Button onClick={handleNext} className="px-6 bg-emerald-600 hover:bg-emerald-700">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Link href={`/initiative-results?data=${encodeURIComponent(JSON.stringify(data))}`}>
                <Button className="px-6 bg-emerald-600 hover:bg-emerald-700">
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
