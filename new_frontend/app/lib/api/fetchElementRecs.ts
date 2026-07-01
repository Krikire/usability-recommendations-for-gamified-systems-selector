import { ElementRec } from "@/app/types/types";

interface ElementRecInput {
  gamificationElement: string[]; // selected gamification elements
  disorder: string[]; // selected disorders
  applicationDomain: string[]; // optional, if needed
  usabilityGoal: string[]; // optional, if needed
  gamificationGoal: string[]; // optional, if needed
  ageGroup: string[]; // optional, if needed
}

const fetchElementRecs = async (
  params: ElementRecInput,
  setElementRec: (value: ElementRec) => void
) => {
  try {
    const res = await fetch("/api/elements-usability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gamificationElement: params.gamificationElement && !params.gamificationElement.includes("Not applicable") ? params.gamificationElement : [],
        gamificationGoal: params.gamificationGoal && !params.gamificationGoal.includes("Not applicable") ? params.gamificationGoal : [],
        usabilityGoal: params.usabilityGoal && !params.usabilityGoal.includes("Not applicable") ? params.usabilityGoal : [],
        disorder: params.disorder && !params.disorder.includes("Not applicable") ? params.disorder : [],
        applicationDomain: params.applicationDomain && !params.applicationDomain.includes("Not applicable") ? params.applicationDomain : [],
        ageGroup: params.ageGroup && !params.ageGroup.includes("Not applicable") ? params.ageGroup : [],
      }),
    });

    const data: { data: ElementRec } = await res.json();
    setElementRec(data.data);
  } catch (error) {
    console.error("Failed to fetch elementRec:", error);
  }
};

export default fetchElementRecs;
