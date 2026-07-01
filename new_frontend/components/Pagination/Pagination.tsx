import { useEffect, useState } from "react";
import PaginationItem from "./PaginationItem/PaginationItem";
import ButtonOutlined from "../ButtonOutlined/ButtonOutlined";

export type PaginationProps = {
  pages: number;
  currentPage: number;
  onChangeCurrentPage: (num: number) => void;
};

export default function Pagination(props: PaginationProps) {
  const [paginatorAvailableNumbers, setPaginatorAvailableNumbers]: [
    number[],
    any
  ] = useState([]);
  const getPaginatorAvailableNumbers = (currentPage: number): number[] => {
    let nums: Array<number> = [];
    //display up to 3 previous elements but no less than 1
    for (let i: number = currentPage - 2; i < props.currentPage; i++) {
      if (i > 0) {
        nums.push(i);
      }
    }
    //display up to 3 following elements but not higher than total pages
    for (let i: number = currentPage; i < currentPage + 3; i++) {
      if (i < props.pages && !nums.includes(i)) {
        nums.push(i);
      }
    }
    if (!nums.includes(props.pages)) nums.push(props.pages);
    return nums;
  };
  useEffect(() => {
    setPaginatorAvailableNumbers(
      getPaginatorAvailableNumbers(props.currentPage)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentPage]);
  return (
    <div className="flex flex-row">
      {props.currentPage != 1 && (
        <ButtonOutlined
          onClick={() => props.onChangeCurrentPage(props.currentPage - 1)}
          label="Previous"
        />
      )}
      {paginatorAvailableNumbers.map((num) => (
        <PaginationItem
          key={num}
          selected={props.currentPage === num}
          pageNum={num}
          onClick={props.onChangeCurrentPage}
        />
      ))}
      {props.currentPage != props.pages && (
        <ButtonOutlined
          onClick={() => props.onChangeCurrentPage(props.currentPage + 1)}
          label="Next"
        />
      )}
    </div>
  );
}
