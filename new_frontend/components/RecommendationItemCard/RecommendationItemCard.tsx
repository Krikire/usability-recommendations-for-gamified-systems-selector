"use client";
import { RecommendationStatus } from "@prisma/client";
import RecStatusMark from "../RecStatusMark/RecStatusMark";
import CopyToClipboardButton from "../CopyToClipboardButton/CopyToClipboardButton";

type RecommendationItemCardProps = {
  id: number;
  title: string;
  index: number;
  ageGroup: string;
  domain: string;
  disorder: string;
  usabilityCharacteristic: string;
  usabilityGoal: string;
  gamificationGoal?: string;
  example: string;
  status: RecommendationStatus | null; // <-- allow null
  onClick: (id: number, status: RecommendationStatus | null) => void; // <-- allow null
};

export default function RecommendationItemCard({
  id,
  title,
  index,
  ageGroup,
  domain,
  disorder,
  usabilityCharacteristic,
  usabilityGoal,
  gamificationGoal,
  example,
  status,
  onClick,
}: RecommendationItemCardProps) {
  return (
    <div
      key={index}
      className="w-full bg-surface text-ink-secondary rounded-card border border-line shadow-sm p-5 flex flex-col gap-4"
    >
      <div className="text-lg font-bold text-ink flex flex-row justify-between items-start gap-2">
        <h3>
          <span className="text-brand-onsubtle">#{index}</span> {title}
        </h3>
        <CopyToClipboardButton text={title} />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        <div className="w-full flex flex-col gap-1.5">
          <div className="flex flex-row items-start text-sm gap-1">
            <p className="font-semibold text-ink-tertiary shrink-0">
              Age group:
            </p>
            <p>{ageGroup}</p>
          </div>
          <div className="flex flex-row items-start text-sm gap-1">
            <p className="font-semibold text-ink-tertiary shrink-0">
              Application domain:
            </p>
            <p>{domain}</p>
          </div>
          <div className="flex flex-row items-start text-sm gap-1">
            <p className="font-semibold text-ink-tertiary shrink-0">
              Disorder:
            </p>
            <p>{disorder}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <div className="flex flex-row items-start text-sm gap-1">
            <p className="font-semibold text-ink-tertiary shrink-0">
              Usability characteristic:
            </p>
            <p>{usabilityCharacteristic}</p>
          </div>
          <div className="flex flex-row items-start text-sm gap-1">
            <p className="font-semibold text-ink-tertiary shrink-0">
              Usability goal:
            </p>
            <p>{usabilityGoal}</p>
          </div>

          <div className="flex flex-row items-start text-sm gap-1">
            <p className="font-semibold text-ink-tertiary shrink-0">
              Gamification goal:
            </p>
            <p>{gamificationGoal}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row text-sm gap-1 rounded-input bg-surface-muted p-3">
        <p className="font-semibold text-ink-tertiary shrink-0">Example:</p>
        <p>{example}</p>
      </div>

      <div className="flex flex-row flex-wrap gap-2.5">
        <RecStatusMark
          selected={status === RecommendationStatus.NON_FIT}
          value={RecommendationStatus.NON_FIT}
          onClick={(value: RecommendationStatus | null) => onClick(id, value)}
        />
        <RecStatusMark
          selected={status === RecommendationStatus.PARTIAL_FIT}
          value={RecommendationStatus.PARTIAL_FIT}
          onClick={(value: RecommendationStatus | null) => onClick(id, value)}
        />
        <RecStatusMark
          selected={status === RecommendationStatus.FIT}
          value={RecommendationStatus.FIT}
          onClick={(value: RecommendationStatus | null) => onClick(id, value)}
        />
      </div>
    </div>
  );
}
