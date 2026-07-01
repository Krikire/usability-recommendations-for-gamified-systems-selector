import { Criteria } from "@/app/types/types";

const sanitizeCriteria = (criteria: Criteria): Criteria => {
  const na = "Not applicable";
  const filter = (field: string[]) => (field.includes(na) ? [] : field);

  return {
    ...criteria,
    gamificationGoal: filter(criteria.gamificationGoal),
    usabilityGoal: filter(criteria.usabilityGoal),
    ageGroup: filter(criteria.ageGroup),
    applicationDomain: filter(criteria.applicationDomain),
    disorder: filter(criteria.disorder),
    usabilityPrinciple: criteria.usabilityPrinciple,
  };
};

export default sanitizeCriteria;
