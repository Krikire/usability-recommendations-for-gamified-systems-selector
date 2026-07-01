type SelectMarkToggleProps = {
  selected: boolean;
  label: string;
  onClick: () => void;
};

export default function SelectMark(props: SelectMarkToggleProps) {
  return (
    <button
      className={`${
        props.selected
          ? "bg-brand-subtle text-brand-onsubtle border-brand/30 hover:brightness-95"
          : `bg-surface text-ink-secondary border-line hover:text-brand-onsubtle hover:bg-brand-subtle hover:border-brand/30`
      } transition duration-200 ease-out border px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
