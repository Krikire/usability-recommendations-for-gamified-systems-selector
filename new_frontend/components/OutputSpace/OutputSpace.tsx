"use client";

import {
  Criteria,
  ElementRec,
  ElementSelectionStatus,
  ElementsRecResponse,
  ElementsType,
  RecommendationSavedType,
  RecRow,
} from "@/app/types/types";
import GeneralisedRecommendationsSection from "../GeneralisedRecommendationsSection/GeneralisedRecommendationsSection";
import RecommendationsForElementsSection from "../RecommendationsForElementsSection/RecommendationsForElementsSection";
import Tabs from "../Tabs/Tabs";
import { Dispatch, SetStateAction } from "react";
import { RecommendationStatus } from "@prisma/client";

interface Props {
  criteria: Criteria;
  generalisedRecommendationsHandler: (
    recommendations: RecommendationSavedType[]
  ) => void;
  selectedGeneralisedRecommendations: RecommendationSavedType[];
  backproppedElements: (elements: any) => void;
  selectedElements?: ElementSelectionStatus[];
  selectedUnusableElements?: ElementSelectionStatus[];
  selectedISORecommendations: RecommendationSavedType[];
  selectedWCAGRecommendations: RecommendationSavedType[];
  selectedUnusableElementsHandler: (elements: ElementsType) => void;
  selectedSpecificRecommendationsHandler: (
    isoRecommendations: RecommendationSavedType[],
    wcagRecommendations: RecommendationSavedType[]
  ) => void;
  fetchedRecommendations: any[];
  setFetchedRecommendations: Dispatch<SetStateAction<any[]>>;
  elements: ElementsType;
  setElements: Dispatch<SetStateAction<ElementsType>>;
  isoWcagRecommendations: ElementsRecResponse;
  setIsoWcagRecommendations: Dispatch<SetStateAction<ElementsRecResponse>>;
  elementUsabilityStatuses: Record<number, RecommendationStatus | null>;
  handleElementUsabilityStatusChange: (
    elementId: number,
    status: RecommendationStatus | null
  ) => void;
  handleUsabilityElementsFetch: () => Promise<void>;
  elementRec: ElementRec;
}

export default function OutputSpace({
  criteria,
  generalisedRecommendationsHandler,
  selectedGeneralisedRecommendations,
  backproppedElements,
  selectedElements,
  selectedUnusableElements,
  selectedISORecommendations,
  selectedWCAGRecommendations,
  selectedUnusableElementsHandler,
  selectedSpecificRecommendationsHandler,
  fetchedRecommendations,
  setFetchedRecommendations,
  elements,
  setElements,
  isoWcagRecommendations,
  setIsoWcagRecommendations,
  elementUsabilityStatuses,
  handleElementUsabilityStatusChange,
  handleUsabilityElementsFetch,
  elementRec,
}: Props) {
  const tabs = [
    {
      label: "Recommendations for gamified system",
      content: (
        <GeneralisedRecommendationsSection
          criteria={criteria}
          generalisedRecommendationsHandler={generalisedRecommendationsHandler}
          selectedGeneralisedRecommendations={
            selectedGeneralisedRecommendations
          }
          recommendations={fetchedRecommendations}
          setRecommendations={setFetchedRecommendations}
        />
      ),
    },
    {
      label: "Recommendations for gamification elements",
      content: (
        <RecommendationsForElementsSection
          criteria={criteria}
          backproppedElements={backproppedElements}
          selectedElements={selectedElements}
          selectedUnusableElements={selectedUnusableElements}
          selectedISORecommendations={selectedISORecommendations}
          selectedWCAGRecommendations={selectedWCAGRecommendations}
          selectedUnusableElementsHandler={selectedUnusableElementsHandler}
          selectedSpecificRecommendationsHandler={
            selectedSpecificRecommendationsHandler
          }
          elements={elements}
          setElements={setElements}
          recommendations={isoWcagRecommendations}
          setRecommendations={setIsoWcagRecommendations}
          elementUsabilityStatuses={elementUsabilityStatuses}
          handleElementUsabilityStatusChange={
            handleElementUsabilityStatusChange
          }
          handleUsabilityElementsFetch={handleUsabilityElementsFetch}
          elementRec={elementRec}
        />
      ),
    },
  ];
  return (
    <div className="bg-surface p-4 sm:p-5 border border-line rounded-card shadow-md w-full">
      <Tabs tabs={tabs} />
    </div>
  );
}
