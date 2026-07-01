import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import Button from "../Button/Button";
import Pagination from "../Pagination/Pagination";
import RecommendationItemCard from "../RecommendationItemCard/RecommendationItemCard";
import { Criteria, RecommendationSavedType } from "@/app/types/types";
import { RecommendationStatus } from "@prisma/client";
import sanitizeCriteria from "@/app/lib/helpers/sanitizeCriteria";

interface Props {
  criteria: Criteria;
  generalisedRecommendationsHandler: (
    recommendations: RecommendationSavedType[]
  ) => void;
  selectedGeneralisedRecommendations: RecommendationSavedType[];
  recommendations: any[];
  setRecommendations: Dispatch<SetStateAction<any[]>>;
}

const DEFAULT_PAGE_SIZE = 10;

export default function GeneralisedRecommendationsSection({
  criteria,
  generalisedRecommendationsHandler,
  selectedGeneralisedRecommendations,
  recommendations,
  setRecommendations,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleRecommendationStatus = (
    id: number,
    status: RecommendationStatus | null
  ) => {
    const updated = selectedGeneralisedRecommendations.map((r) =>
      r.id == id ? { ...r, status } : r
    );
    console.log(status);
    console.log(selectedGeneralisedRecommendations.find((i) => i.id === id));
    generalisedRecommendationsHandler(updated);
  };
  const NOT_APPLICABLE = "Not applicable";

  const fetchData = async () => {
    setLoading(true);

    const processedCriteria = sanitizeCriteria(criteria);

    console.log("Fetching data with criteria:", processedCriteria);
    setError(null);
    try {
      const res = await fetch("/api/generalised-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedCriteria),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setRecommendations(data);
      interface InitialSelectedData {
        id: number;
        status: RecommendationStatus | null;
      }

      let initialSelectedData: InitialSelectedData[] = data.map(
        (item: { id: number }) => ({
          id: item.id,
          status: null,
        })
      );
      generalisedRecommendationsHandler(initialSelectedData);
      setPage(1); // reset to first page on new search
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Optional: re‑fetch automatically when criteria change

  const start = (page - 1) * DEFAULT_PAGE_SIZE;
  const current = recommendations.slice(start, start + DEFAULT_PAGE_SIZE);

  return (
    <div className="p-5 w-full bg-surface-muted border border-line rounded-card flex flex-col gap-2">
      <div className="flex px-2 flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-ink">
          Generalised Recommendations{" "}
          {recommendations.length > 0 && `(${recommendations.length})`}
        </h2>
        <Button
          label="Determine recommendations"
          onClick={fetchData}
          disabled={loading}
        />
      </div>

      {error && <p className="text-unsuitable p-4">{error}</p>}

      {loading && <p className="p-4 text-ink-secondary">Loading…</p>}

      {!loading && current.length === 0 && (
        <p className="p-4 text-ink-tertiary">
          No recommendations match your criteria.
        </p>
      )}

      {/* Recommendation list */}
      <div className="pt-10 flex flex-col gap-4">
        {current.map((item, idx) => (
          <RecommendationItemCard
            id={item.id}
            key={`${item.ruleIdx}`}
            title={item.genRecommendation}
            index={item.ruleIdx}
            ageGroup={item.ageGroup}
            domain={item.applicationDomain}
            disorder={item.disorder}
            usabilityCharacteristic={item.usabilityPrinciple}
            usabilityGoal={item.usabilityGoal}
            gamificationGoal={item.gamificationGoal}
            example={item.example}
            status={
              selectedGeneralisedRecommendations.find((i) => i.id === item.id)
                ?.status
            }
            onClick={handleRecommendationStatus}
          />
        ))}
      </div>

      {/* Pagination */}
      {recommendations.length > DEFAULT_PAGE_SIZE && (
        <div className="pt-4 flex justify-center">
          <Pagination
            pages={Math.ceil(recommendations.length / DEFAULT_PAGE_SIZE)}
            currentPage={page}
            onChangeCurrentPage={setPage}
          />
        </div>
      )}
    </div>
  );
}
