import { MouseEventHandler } from "react";

export type PaginationItemProps = {
  selected: boolean;
  pageNum: number;
  onClick: (num: number) => void;
};

export default function PaginationItem(props: PaginationItemProps) {
  return (
    <div
      onClick={() => props.onClick(props.pageNum)}
      className={`${
        props.selected
          ? "bg-brand text-white border border-brand"
          : "bg-surface border border-line text-ink-secondary hover:bg-brand-subtle hover:text-brand-onsubtle hover:border-brand/30 transition duration-200 ease-out"
      } rounded-input text-sm font-medium min-w-[40px] text-center px-3 py-2 hover:cursor-pointer mx-1`}
    >
      {props.pageNum}
    </div>
  );
}
