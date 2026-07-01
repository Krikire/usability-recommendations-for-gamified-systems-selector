import { RecommendationStatus } from "@prisma/client";

type SelectMarkToggleProps = {
  selected: boolean;
  value: RecommendationStatus;
  onClick: (status: RecommendationStatus | null) => void;
};

type StatusStyle = {
  selected: string;
  unselected: string;
};

const labelByStatus: Record<RecommendationStatus, string> = {
  [RecommendationStatus.FIT]: "Implemented",
  [RecommendationStatus.PARTIAL_FIT]: "Partially implemented",
  [RecommendationStatus.NON_FIT]: "Not implemented",
};

const styleByStatus: Record<RecommendationStatus, StatusStyle> = {
  [RecommendationStatus.FIT]: {
    selected:
      "bg-suitable-subtle text-suitable border-suitable/30 hover:brightness-95",
    unselected:
      "bg-surface text-ink-secondary border-line hover:text-suitable hover:bg-suitable-subtle hover:border-suitable/30",
  },
  [RecommendationStatus.PARTIAL_FIT]: {
    selected:
      "bg-[#fbf3e0] text-[#9a6a12] border-[#e8cf94] hover:brightness-95",
    unselected:
      "bg-surface text-ink-secondary border-line hover:text-[#9a6a12] hover:bg-[#fbf3e0] hover:border-[#e8cf94]",
  },
  [RecommendationStatus.NON_FIT]: {
    selected:
      "bg-unsuitable-subtle text-unsuitable border-unsuitable/30 hover:brightness-95",
    unselected:
      "bg-surface text-ink-secondary border-line hover:text-unsuitable hover:bg-unsuitable-subtle hover:border-unsuitable/30",
  },
};

export default function RecStatusMark({
  selected,
  value,
  onClick,
}: SelectMarkToggleProps) {
  const classes = `${
    selected ? styleByStatus[value].selected : styleByStatus[value].unselected
  } transition duration-200 ease-out border px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer`;

  const handleClick = () => {
    onClick(selected ? null : value);
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={classes}
      onClick={handleClick}
    >
      {labelByStatus[value]}
    </button>
  );
}
