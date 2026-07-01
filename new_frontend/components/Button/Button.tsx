type ButtonProps = {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button(props: ButtonProps) {
  const { variant = "primary" } = props;

  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-input cursor-pointer transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-brand text-white shadow-sm hover:bg-brand-hover active:bg-brand-hover",
    secondary:
      "bg-surface text-ink border border-line-strong shadow-sm hover:bg-surface-muted",
  };

  return (
    <button
      onClick={props.onClick}
      className={`${base} ${variants[variant]}`}
      disabled={props.disabled ?? false}
    >
      {props.label}
    </button>
  );
}
