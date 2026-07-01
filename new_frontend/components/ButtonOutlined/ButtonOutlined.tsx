type ButtonOutlinedProps = {
  onClick: () => void;
  label: string;
};

export default function ButtonOutlined(props: ButtonOutlinedProps) {
  return (
    <button
      className="bg-surface text-ink border border-line-strong hover:bg-surface-muted transition duration-200 ease-out text-sm font-semibold px-4 py-2 rounded-input cursor-pointer"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
