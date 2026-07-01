import { RecommendationStatus } from "@prisma/client";
import RecStatusMark from "../RecStatusMark/RecStatusMark";
import SelectMark from "../SelectMark/SelectMark";
import CopyToClipboardButton from "../CopyToClipboardButton/CopyToClipboardButton";

type RecommendationItemCardProps = {
  onClick: (value: RecommendationStatus | null) => void;
  title: string;
  index: number;
  example: string;
  status: RecommendationStatus;
  recommendationName: string;
};

export default function RecommendationElementCard({
  title,
  index,
  example,
  recommendationName,
  status,
  onClick,
}: RecommendationItemCardProps) {
  return (
    <div
      key={index}
      className="w-full bg-surface text-ink-secondary rounded-card border border-line shadow-sm p-5 flex flex-col gap-3"
    >
      <div className="text-lg font-bold text-ink flex flex-row justify-between items-start gap-2">
        <h3>
          <span className="text-brand-onsubtle">#{index + 1}</span> {title}
        </h3>
        <CopyToClipboardButton text={title} />
      </div>
      <div className="flex flex-row text-sm gap-1 rounded-input bg-surface-muted p-3">
        <p className="font-semibold text-ink-tertiary shrink-0">Example:</p>
        <p>{example}</p>
      </div>
      <div className="inline-flex self-start text-xs font-semibold px-2 py-1 rounded-full bg-brand-subtle text-brand-onsubtle">
        {recommendationName}
      </div>
      <div className="flex flex-row flex-wrap gap-2.5 pt-1">
        <RecStatusMark
          selected={status == RecommendationStatus.NON_FIT}
          value={RecommendationStatus.NON_FIT}
          onClick={(value: RecommendationStatus | null) => {
            onClick(value);
          }}
        />
        <RecStatusMark
          selected={status == RecommendationStatus.PARTIAL_FIT}
          value={RecommendationStatus.PARTIAL_FIT}
          onClick={(value: RecommendationStatus | null) => {
            onClick(value);
          }}
        />
        <RecStatusMark
          selected={status == RecommendationStatus.FIT}
          value={RecommendationStatus.FIT}
          onClick={(value: RecommendationStatus | null) => {
            onClick(value);
          }}
        />
      </div>
    </div>
  );
}
