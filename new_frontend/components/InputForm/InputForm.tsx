"use client";

import { lazy, useState } from "react";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import Checklist from "../Checklist/Checklist";
import { Criteria } from "@/app/types/types";

interface Props {
  criteria: Criteria;
  onChange: (c: Criteria) => void;
}

export default function InputForm({ criteria, onChange }: Props) {
  const gamificationGoals = [
    {
      label: "Support different learning needs",
      value: "Support different learning needs",
    },
    { label: "Improve focus", value: "Improve focus" },
    {
      label: "Promote intrinsic motivation",
      value: "Promote intrinsic motivation",
    },
    { label: "Increase autonomy", value: "Increase autonomy" },
    { label: "To foster competition", value: "To foster competition" },
    { label: "Reinforce learning", value: "Reinforce learning" },
    { label: "Decrease distraction", value: "Decrease distraction" },
    { label: "Reduce stress", value: "Reduce stress" },
    {
      label: "Increase engagement and motivation",
      value: "Increase engagement and motivation",
    },
    {
      label: "To establish an emotional attachment",
      value: "To establish an emotional attachment",
    },
    {
      label: "Support user autonomy and control",
      value: "Support user autonomy and control",
    },
    {
      label: "Reduce competition pressure",
      value: "Reduce competition pressure",
    },
    {
      label: "Promote extrinsic motivation",
      value: "Promote extrinsic motivation",
    },
    { label: "To build habit", value: "To build habit" },
    { label: "Promote relationships", value: "Promote relationships" },
    { label: "Keep interest", value: "Keep interest" },
    { label: "Foster advancement", value: "Foster advancement" },
    {
      label: "To build a connection between efforts",
      value: "To build a connection between efforts",
    },
  ];

  const usabilityGoals = [
    {
      label: "Ensure access to help when needed",
      value: "Ensure access to help when needed",
    },
    { label: "Reduce memory load", value: "Reduce memory load" },
    {
      label: "Ensure good text readability",
      value: "Ensure good text readability",
    },
    { label: "Reduce user frustration", value: "Reduce user frustration" },
    { label: "Enhance accessibility", value: "Enhance accessibility" },
    {
      label: "Promote voluntary engagement",
      value: "Promote voluntary engagement",
    },
    {
      label: "Ensure aesthetic clarity and simplicity",
      value: "Ensure aesthetic clarity and simplicity",
    },
    {
      label: "Encourage through positive messaging",
      value: "Encourage through positive messaging",
    },
    { label: "Build trust and comfort", value: "Build trust and comfort" },
    {
      label: "Support learning through feedback",
      value: "Support learning through feedback",
    },
    {
      label: "Minimize extraneous cognitive load",
      value: "Minimize extraneous cognitive load",
    },
    { label: "Improve recognition", value: "Improve recognition" },
    {
      label: "Focus attention on key elements",
      value: "Focus attention on key elements",
    },
    {
      label: "Support user autonomy and control",
      value: "Support user autonomy and control",
    },
    { label: "Minimize fatigue", value: "Minimize fatigue" },
  ];

  const ageGroups = [
    { label: "Adults", value: "adults" },
    { label: "Elderly", value: "elderly" },
    { label: "Children", value: "children" },
    { label: "Teenagers", value: "teenagers" },
  ];
  const domains = [
    { label: "medicine (mental health)", value: "medicine (mental health)" },
    { label: "medicine (healthcare)", value: "medicine (healthcare)" },
    { label: "driving", value: "driving" },
    { label: "education", value: "education" },
    { label: "healthy eating", value: "healthy eating" },
    { label: "business", value: "business" },
    { label: "sport (fitness)", value: "sport (fitness)" },
    { label: "sport (cyclotourism)", value: "sport (cyclotourism)" },
    { label: "medicine (healthy living)", value: "medicine (healthy living)" },
    { label: "medicine (rehabilitation)", value: "medicine (rehabilitation)" },
    {
      label: "habits formation and productivity",
      value: "habits formation and productivity",
    },
  ];

  const disorders = [
    {
      label: "Deficits in working memory",
      value: "Deficits in working memory",
    },
    {
      label: "Impairments in motor skills",
      value: "Impairments in motor skills",
    },
    { label: "Learning difficulties", value: "Learning difficulties" },
    { label: "Stroke patients", value: "Stroke patients" },
    { label: "Cognitive disorder", value: "Cognitive disorder" },
    { label: "Attention disorder", value: "Attention disorder" },
    { label: "Hearing impairment", value: "Hearing impairment" },
    { label: "Visual impairment", value: "Visual impairment" },
    { label: "Alzheimer patients", value: "Alzheimer patients" },
    { label: "Anxiety", value: "Anxiety" },
  ];

  const heuristics = [
    "Visibility of system status",
    "Match between system and the real world",
    "User control and freedom",
    "Consistency and standards",
    "Error prevention",
    "Recognition rather than recall",
    "Flexibility and efficiency of use",
    "Aesthetic and minimalist design",
    "Help users recognize, diagnose, and recover from errors",
    "Help and documentation",
  ];
  const ISOprinciples = [
    "Appropriateness recognizability",
    "Learnability",
    "Operability",
    "User error protection",
    "Accessibility",
    "User interface aesthetics",
  ];
  const setField = (field: keyof Criteria) => (arr: string[]) => {
    onChange({ ...criteria, [field]: arr });
    console.log(criteria);
  };
  const [selectedUsabilityGoals, setSelectedUsabilityGoals] = useState<
    string[]
  >([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedDisorders, setSelectedDisorders] = useState<string[]>([]);
  const [selectedGamifications, setSelectedGamifications] = useState<string[]>(
    []
  );
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<
    string[]
  >([]);
  const [disableUsabilityPrinciples, setDisableUsabilityPrinciples] =
    useState(true);

  return (
    <div className="w-full bg-surface border border-line rounded-card shadow-md p-6 sm:p-8 my-8">
      <div className="flex flex-col items-center gap-2.5 py-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-brand-subtle text-brand-onsubtle text-xs font-semibold px-3 py-1 tracking-wide">
          Describe your context
        </span>
        <p className="text-ink font-bold text-2xl tracking-tight">
          Select parameters
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6 pt-2">
        <div className="col-span-1 flex flex-col gap-4">
          <MultiSelectDropdown
            options={gamificationGoals}
            selected={criteria.gamificationGoal}
            onChange={setField("gamificationGoal")}
            placeholder="Select gamification goals"
          />
          <MultiSelectDropdown
            options={usabilityGoals}
            selected={criteria.usabilityGoal}
            onChange={setField("usabilityGoal")}
            placeholder="Select usability goals"
          />
          <MultiSelectDropdown
            options={ageGroups}
            selected={criteria.ageGroup}
            onChange={setField("ageGroup")}
            placeholder="Select age groups"
          />
          <MultiSelectDropdown
            options={domains}
            selected={criteria.applicationDomain}
            onChange={setField("applicationDomain")}
            placeholder="Select application domain"
          />
          <MultiSelectDropdown
            options={disorders}
            selected={criteria.disorder}
            onChange={setField("disorder")}
            placeholder="Select disorder"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <div className="pb-2 text-ink text-sm flex items-center gap-3">
            <label htmlFor="disableUsability" className="font-medium">
              Select usability characteristics
            </label>
            <input
              type="checkbox"
              id="disableUsability"
              className="h-4 w-4 accent-brand cursor-pointer"
              checked={disableUsabilityPrinciples}
              onChange={(e) => {
                const checked = e.target.checked;
                setDisableUsabilityPrinciples(checked);
                if (checked) {
                  setField("usabilityPrinciple")([]);
                }
              }}
            />
            <span className="text-sm text-ink-tertiary">Not applicable</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Checklist
              options={heuristics}
              selected={criteria.usabilityPrinciple}
              onChange={setField("usabilityPrinciple")}
              placeholder="Nielsen heuristics"
              disabled={disableUsabilityPrinciples}
            />
            <Checklist
              options={ISOprinciples}
              selected={criteria.usabilityPrinciple}
              onChange={setField("usabilityPrinciple")}
              placeholder="ISO 25010:2011 principles"
              disabled={disableUsabilityPrinciples}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
