"use client";
import InputForm from "@/components/InputForm/InputForm";
import OutputSpace from "@/components/OutputSpace/OutputSpace";
import {
  Criteria,
  ElementRec,
  ElementsRecResponse,
  ElementsType,
  RecRow,
  SavedResultType,
} from "./types/types";
import { useState } from "react";
import SaveSection from "@/components/SaveSection/SaveSection";
import { RecommendationStatus } from "@prisma/client";
import sanitizeCriteria from "./lib/helpers/sanitizeCriteria";
import { fetchElementRecommendations } from "./lib/api/fetchRecommendationsForElements";
import fetchElementRecs from "./lib/api/fetchElementRecs";

type RecommendationSavedType = {
  id: number;
  status?: RecommendationStatus;
};

type ElementSelectionStatus = {
  id: number;
  status: boolean;
};

export default function Home() {
  const [criteria, setCriteria] = useState<Criteria>({
    usabilityGoal: ["Not applicable"],
    ageGroup: ["Not applicable"],
    disorder: ["Not applicable"],
    applicationDomain: ["Not applicable"],
    usabilityPrinciple: [],
    gamificationGoal: ["Not applicable"],
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [elementRec, setElementRec] = useState<ElementRec>([]);

  const [elements, setElements] = useState<ElementsType>({
    suitable: [],
    notSuitable: [],
    other: [],
  });
  const [isoWcagRecs, setIsoWcagRecs] = useState<ElementsRecResponse>([]);
  const [generalisedRecommendations, setGeneralisedRecommendations] = useState<
    RecommendationSavedType[]
  >([]);
  const [selectedElements, setSelectedElements] = useState<
    ElementSelectionStatus[]
  >([]);
  const [selectedUnusableElements, setSelectedUnusableElements] = useState<
    ElementSelectionStatus[]
  >([]);
  const [selectedISORecommendations, setselectedISORecommendations] = useState<
    RecommendationSavedType[]
  >([]);
  const [selectedWCAGRecommendations, setSelectedWCAGRecommendations] =
    useState<RecommendationSavedType[]>([]);

  const [websiteName, setWebsiteName] = useState<string>("");
  const [elementUsabilityStatuses, setElementUsabilityStatuses] = useState<
    Record<number, RecommendationStatus | null>
  >({});

  const [success, setSuccess] = useState<boolean>(false);

  const selectedElementsHandler = (elements: ElementsType) => {
    const selected = [
      ...elements.suitable.map((element) => ({
        id: element.element.id,
        status: element.selected,
      })),
      ...elements.other.map((element) => ({
        id: element.element.id,
        status: element.selected,
      })),
    ];
    setSelectedElements(selected);
  };

  const generalisedRecommendationsHandler = (
    recommendations: RecommendationSavedType[]
  ) => {
    setGeneralisedRecommendations(recommendations);
  };

  const handleElementUsabilityStatusChange = (
    elementId: number,
    status: RecommendationStatus | null
  ) => {
    setElementUsabilityStatuses((prev) => ({
      ...prev,
      [elementId]: status,
    }));
  };

  const handleUsabilityElementsFetch = async () => {
    console.log("Fetching usability elements with criteria:", elements.other);
    const processedCriteria = sanitizeCriteria(criteria);
    let selEl = elements.other
      .filter((el) => el.selected)
      .map((el) => el.element.gamificationElement);
    selEl.push(
      ...elements.suitable
        .filter((el) => el.selected)
        .map((el) => el.element.gamificationElement)
    );
    console.log("Selected elements for usability fetch:", selEl);
    selEl.push(
      ...elements.notSuitable
        .filter((el) => el.selected)
        .map((el) => el.element.gamificationElement)
    );

    const data = await fetchElementRecs(
      { ...processedCriteria, gamificationElement: selEl },
      setElementRec
    );
  };

  const specificRecommendationsHandler = (
    isoRecommendations: RecommendationSavedType[],
    wcagRecommendations: RecommendationSavedType[]
  ) => {
    setselectedISORecommendations(isoRecommendations);
    setSelectedWCAGRecommendations(wcagRecommendations);
  };

  const selectedUnusableElementsHandle = (elements: ElementsType) => {
    const selected = [
      ...elements.notSuitable.map((element) => ({
        id: element.element.id,
        status: element.selected,
      })),
    ];
    setSelectedUnusableElements(selected);
  };

  const onChangeWebsiteName = (name: string) => {
    setWebsiteName(name);
  };

  const handleSave = () => {
    const elementUsabilityStatusArray = Object.entries(
      elementUsabilityStatuses
    ).map(([id, status]) => ({
      elementId: Number(id),
      status: status,
    }));

    console.log(elementRec);
    const flatRec = elementRec.flatMap((rec) => {
      return rec.data.map((r) => ({
        elementId: r.id,
        status: r.selectionStatus ?? null,
      }));
    });
    let input: SavedResultType = {
      name: websiteName,
      generalisedRecommendations: generalisedRecommendations,
      elements: selectedElements,
      usabilityRecommendationsForGamificationElementsIso:
        selectedISORecommendations,
      notSuitableElements: selectedUnusableElements,
      savedUsabilityRecommendationsForGamificationElementsWcag:
        selectedWCAGRecommendations,
      savedElementUsabilityRecommendations: flatRec,
    };
    console.log("Input to save:", input);
    fetch("/api/saved-result/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="">
      <main className="container flex mx-auto flex-col items-center justify-between p-4">
        <InputForm criteria={criteria} onChange={setCriteria} />
        {/* <SaveSection
          websiteName={websiteName}
          onChange={(name: string) => {
            onChangeWebsiteName(name);
          }}
          success={success}
          onSave={() => {
            handleSave();
            setSuccess(true);
          }}
        /> */}
        <OutputSpace
          criteria={criteria}
          generalisedRecommendationsHandler={generalisedRecommendationsHandler}
          selectedGeneralisedRecommendations={generalisedRecommendations}
          backproppedElements={selectedElementsHandler}
          selectedElements={selectedElements}
          selectedUnusableElements={selectedUnusableElements}
          selectedISORecommendations={selectedISORecommendations}
          selectedWCAGRecommendations={selectedWCAGRecommendations}
          selectedUnusableElementsHandler={selectedUnusableElementsHandle}
          selectedSpecificRecommendationsHandler={
            specificRecommendationsHandler
          }
          fetchedRecommendations={recommendations}
          setFetchedRecommendations={setRecommendations}
          elements={elements}
          setElements={setElements}
          isoWcagRecommendations={isoWcagRecs}
          setIsoWcagRecommendations={setIsoWcagRecs}
          elementUsabilityStatuses={elementUsabilityStatuses}
          handleElementUsabilityStatusChange={
            handleElementUsabilityStatusChange
          }
          handleUsabilityElementsFetch={handleUsabilityElementsFetch}
          elementRec={elementRec}
        />
      </main>
      <footer className=""></footer>
    </div>
  );
}
