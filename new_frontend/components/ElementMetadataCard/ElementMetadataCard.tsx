"use client";
import { RecommendationStatus } from "@prisma/client";
import RecStatusMark from "../RecStatusMark/RecStatusMark";
import CopyToClipboardButton from "../CopyToClipboardButton/CopyToClipboardButton";

type RuleMetadataInteractiveCardProps = {
  element: string;
  data: {
    id: number;
    selectionStatus: RecommendationStatus | null;
    suitableGamificationElements: {
      ageGroup: string;
      applicationDomain: string;
      disorder: string;
      gamificationGoal: string;
      usabilityGoal: string;
      usabilityRecommendation: string;
    };
  };
  onStatusChange: (id: number, newStatus: RecommendationStatus | null) => void;
};

export default function RuleMetadataInteractiveCard({
  element,
  data,
  onStatusChange,
}: RuleMetadataInteractiveCardProps) {
  console.log("Rendering RuleMetadataInteractiveCard for element:", element);
  return (
    <div className="w-full bg-surface text-ink-secondary py-5 px-5 rounded-card border border-line shadow-sm h-full">
      <h2 className="text-lg font-bold text-ink">{element}</h2>
      <div key={data.id} className="border-t border-line pt-4 mt-4">
        <div className="text-xs text-ink-tertiary mb-2 font-semibold uppercase tracking-wide">
          Entry #{data.id}
        </div>
        <div className="text-sm mb-4 flex flex-row justify-between items-start gap-2">
          <p>
            <strong className="font-semibold text-ink">Recommendation:</strong>{" "}
            {data.suitableGamificationElements.usabilityRecommendation}
          </p>
          <CopyToClipboardButton
            text={data.suitableGamificationElements.usabilityRecommendation}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
          <div>
            <p className="font-semibold text-ink-tertiary">Age Group:</p>
            <p>
              {data.suitableGamificationElements.ageGroup
                ? data.suitableGamificationElements.ageGroup
                : "Not applicable"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink-tertiary">
              Application Domain:
            </p>
            <p>
              {data.suitableGamificationElements.applicationDomain
                ? data.suitableGamificationElements.applicationDomain
                : "Not applicable"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink-tertiary">Disorder:</p>
            <p>
              {data.suitableGamificationElements.disorder
                ? data.suitableGamificationElements.disorder
                : "Not applicable"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink-tertiary">Usability Goal:</p>
            <p>
              {data.suitableGamificationElements.usabilityGoal
                ? data.suitableGamificationElements.usabilityGoal
                : "Not applicable"}
            </p>
          </div>

          <div>
            <p className="font-semibold text-ink-tertiary">Gamification Goal:</p>
            <p>
              {data.suitableGamificationElements.gamificationGoal
                ? data.suitableGamificationElements.gamificationGoal
                : "Not applicable"}
            </p>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2.5 mt-2">
          {Object.values(RecommendationStatus).map((status, id) => (
            <RecStatusMark
              key={id}
              selected={data.selectionStatus === status}
              value={status}
              onClick={(val) => onStatusChange(data.id, val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
