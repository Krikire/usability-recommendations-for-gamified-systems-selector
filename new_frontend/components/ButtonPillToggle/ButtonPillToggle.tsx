type ButtonPillToggleProps = {
  selected: boolean;
  label: string;
  onClick: () => void;
  notSuitable: boolean;
  updated?: boolean;
};

export default function ButtonPillToggle(props: ButtonPillToggleProps) {
  const { selected, notSuitable, updated } = props;

  const baseClasses =
    "text-sm font-medium border px-4 py-1.5 rounded-full cursor-pointer transition duration-200 ease-out";

  let styleClass = "";

  if (updated) {
    styleClass = selected
      ? "bg-[#fbf3e0] text-[#9a6a12] border-[#e8cf94] hover:bg-[#f6ead0]"
      : "bg-surface text-[#9a6a12] border-[#e8cf94] hover:bg-[#fbf3e0]";
  } else if (selected) {
    styleClass = notSuitable
      ? "bg-unsuitable-subtle text-unsuitable border-unsuitable/30 hover:brightness-95"
      : "bg-brand-subtle text-brand-onsubtle border-brand/30 hover:brightness-95";
  } else {
    styleClass = notSuitable
      ? "bg-surface text-ink-tertiary border-line hover:text-unsuitable hover:bg-unsuitable-subtle hover:border-unsuitable/30"
      : "bg-surface text-ink-secondary border-line hover:text-brand-onsubtle hover:bg-brand-subtle hover:border-brand/30";
  }

  return (
    <button
      title={notSuitable ? "Not suitable for your criteria" : undefined}
      className={`${styleClass} ${baseClasses}`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
