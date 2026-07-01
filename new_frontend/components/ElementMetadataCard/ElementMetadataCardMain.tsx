"use client";
import { RecommendationStatus } from "@prisma/client";
import RecStatusMark from "../RecStatusMark/RecStatusMark";
import CopyToClipboardButton from "../CopyToClipboardButton/CopyToClipboardButton";
import {
  GamificationElementData,
  GamificationElementEntry,
  GroupedGamificationElement,
} from "@/app/types/types";

type RuleMetadataInteractiveCardMainProps = {
  props: GamificationElementData;
  selectionStatus: RecommendationStatus | null;

  onStatusChange: (id: number, newStatus: RecommendationStatus) => void;
};

export default function RuleMetadataInteractiveCardMain({
  props,
  onStatusChange,
  selectionStatus,
}: RuleMetadataInteractiveCardMainProps) {
  console.log(
    "Rendering RuleMetadataInteractiveCard for element:",
    props.gamificationElement
  );
  return (
    <div className="w-full bg-surface text-ink-secondary py-5 px-5 rounded-card border border-line shadow-sm h-full">
      <h2 className="text-lg font-bold text-ink">{props.gamificationElement}</h2>
      <div key={props.id} className="border-t border-line pt-4 mt-4">
        <div className="text-xs text-ink-tertiary mb-2 font-semibold uppercase tracking-wide">
          Entry #{props.ruleIdx}
        </div>
        <div className="text-sm mb-4 flex flex-row justify-between items-start gap-2">
          <p>
            <strong className="font-semibold text-ink">Recommendation:</strong>{" "}
            {props.usabilityRecommendation}
          </p>
          <CopyToClipboardButton text={props.usabilityRecommendation} />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
          <div>
            <p className="font-semibold text-ink-tertiary">Age Group:</p>
            <p>{props.ageGroup ? props.ageGroup : "Not applicable"}</p>
          </div>
          <div>
            <p className="font-semibold text-ink-tertiary">
              Application Domain:
            </p>
            <p>
              {props.applicationDomain
                ? props.applicationDomain
                : "Not applicable"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink-tertiary">Disorder:</p>
            <p>{props.disorder ? props.disorder : "Not applicable"}</p>
          </div>
          <div>
            <p className="font-semibold text-ink-tertiary">Usability Goal:</p>
            <p>
              {props.usabilityGoal ? props.usabilityGoal : "Not applicable"}
            </p>
          </div>

          <div>
            <p className="font-semibold text-ink-tertiary">Gamification Goal:</p>
            <p>
              {props.gamificationGoal ? props.gamificationGoal : "Not applicable"}
            </p>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2.5 mt-2">
          {Object.values(RecommendationStatus).map((status) => (
            <RecStatusMark
              key={status}
              selected={selectionStatus === status}
              value={status}
              onClick={() => onStatusChange(props.id, status)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
