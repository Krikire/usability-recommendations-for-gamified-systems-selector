import { ElementsRecResponse } from "@/app/types/types";

export interface RecommendationsCriteria {
  elements: string[]; // selected gamification elements
  disorders: string[]; // selected disorders
}

/**
 * POST /api/gamification-recommendations
 * returns [{ element, recommendations: [...] }, …]
 */
export async function fetchElementRecommendations(
  criteria: RecommendationsCriteria
): Promise<ElementsRecResponse> {
  try {
    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criteria),
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const data: ElementsRecResponse = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching element recommendations:", err);
    return []; // empty payload on failure
  }
}
