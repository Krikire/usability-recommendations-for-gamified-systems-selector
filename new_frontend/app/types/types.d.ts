export interface Criteria {
  usabilityGoal: string[];
  ageGroup: string[];
  disorder: string[];
  applicationDomain: string[];
  usabilityPrinciple: string[];
  gamificationGoal: string[];
}

export interface GamificationElementRow {
  id: number;
  ruleIdx: number;
  ageGroup: string;
  applicationDomain: string;
  disorder: string;
  gamificationGoal: string;
  usabilityGoal: string;
  usabilityCharacteristic: string;
  gamificationElement: string;
  usabilityRecommendation: string;
}

export interface ElementsType {
  suitable: {
    element: GamificationElement;
    selected: boolean;
  }[]; // plain names
  notSuitable: {
    element: GamificationElement;
    selected: boolean;
  }[]; // plain names
  other: {
    element: GamificationElement;
    selected: boolean;
  }[]; // plain names
}

export interface GamificationElement {
  id: number;
  gamificationElement: string;
}

export interface ElementsResponse {
  suitable: GamificationElement[];
  notSuitable: GamificationElement[];
  other: GamificationElement[];
}
/** One individual recommendation row (ISO or WCAG) */
export interface RecRow {
  id: number; // unique ID for the row
  disorder: string; // '-' for ISO rows
  recommendation: string; // renamed WCAG/ISO text
  elementUsabilityRecommendation: string | null;
  example: string | null;
}

export interface RecRowOut {
  id: number; // unique ID for the row
  disorder: string; // '-' for ISO rows
  recommendation: string; // renamed WCAG/ISO text
  elementUsabilityRecommendation: string | null;
  example: string | null;
  selectionStatus: RecommendationStatus;
}

/** Block returned per gamification element */
export interface ElementBlock {
  element: string; // the element’s name
  usabilityRecommendations: {
    id: number;
    recommendation: string;
    status: RecommendationStatus | null;
  }[];
  recommendations: RecRow[];
}

/** Entire API payload */
export type ElementsRecResponse = ElementBlock[];

export type SavedElementUsabilityRecommendation = {
  elementId: number;
  status: RecommendationStatus;
};

type SavedResultType = {
  name: string;
  generalisedRecommendations: RecommendationSavedType[];
  elements: ElementSelectionStatus[];
  usabilityRecommendationsForGamificationElementsIso: RecommendationSavedType[];
  notSuitableElements: ElementSelectionStatus[];
  savedUsabilityRecommendationsForGamificationElementsWcag: RecommendationSavedType[];
  savedElementUsabilityRecommendations: SavedElementUsabilityRecommendation[];
};

type RecommendationSavedType = {
  id: number;
  status?: RecommendationStatus;
};

type ElementSelectionStatus = {
  id: number;
  status: boolean;
};

export type GamificationElementData = {
  id: number;
  ruleIdx: number;
  ageGroup: string;
  applicationDomain: string;
  disorder: string;
  gamificationGoal: string;
  usabilityGoal: string;
  usabilityCharacteristic: string | null;
  gamificationElement: string;
  usabilityRecommendation: string;
};

export type GamificationElementEntry = {
  id: number;
  selectionStatus: RecommendationStatus | null;
  data: GamificationElementData;
};

export type GroupedGamificationElement = {
  element: string;
  data: GamificationElementEntry[];
};

export type ElementRec = GroupedGamificationElement[];
