import { Criteria, ElementsResponse } from "@/app/types/types";

export async function fetchGamificationElements(
  criteria: Criteria
): Promise<ElementsResponse> {
  try {
    const response = await fetch("/api/gamification-elements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(criteria),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching gamification elements:", error);
    return {
      suitable: [],
      notSuitable: [],
      other: [],
    };
  }
}
