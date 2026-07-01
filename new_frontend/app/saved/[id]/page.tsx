"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RecommendationItemCard from "@/components/RecommendationItemCard/RecommendationItemCard";
import ButtonPillToggle from "@/components/ButtonPillToggle/ButtonPillToggle";
import RecommendationElementCard from "@/components/RecommendationElementCard/RecommendationElementCard";
import {
  RecommendationStatus,
  SavedGeneralisedRecommendation,
  SavedNotSuitableGamificationElements,
  SavedSuitableGamificationElements,
  SavedUsabilityRecommendationsForGamificationElementsIso,
  SavedUsabilityRecommendationsForGamificationElementsWcag22,
} from "@prisma/client";
import AccordionItem from "@/components/Accordion/Accordion";
import RuleMetadataInteractiveCard from "@/components/ElementMetadataCard/ElementMetadataCard";

export default function SavedResultPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setmetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/saved-result/${id}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }

      const result = await res.json();
      console.log(result);
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    const res = await fetch(`/api/saved-result/${id}`, {
      method: "POST",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Unknown error");
    }

    const result = await res.json();
    setData(result);
  };

  const handleGeneralisedRecommendationChange = async (
    gid: number,
    status: RecommendationStatus | null
  ) => {
    await fetch(`/api/saved-result/${id}/generalised/${gid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    }).then((res) => {
      refetch();
    });
  };

  const handleElemRecChange = async (
    gid: number,
    status: RecommendationStatus | null
  ) => {
    await fetch(`/api/saved-result/${id}/element-usability/${gid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    }).then((res) => {
      refetch();
    });
  };

  const handleIsoRecommendationChange = async (
    gid: number,
    status: RecommendationStatus | null
  ) => {
    await fetch(`/api/saved-result/${id}/iso/${gid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    }).then((res) => {
      refetch();
    });
  };

  const handleWcagRecommendationChange = async (
    gid: number,
    status: RecommendationStatus | null
  ) => {
    await fetch(`/api/saved-result/${id}/wcag/${gid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    }).then((res) => {
      refetch();
    });
  };

  const getDataForTable = () => {
    let genTotal = data.SavedGeneralisedRecommendation.length;
    let genNonFit = data.SavedGeneralisedRecommendation.filter(
      (rec: SavedGeneralisedRecommendation) =>
        rec.selectionStatus === RecommendationStatus.NON_FIT
    ).length;
    let genPartialFit = data.SavedGeneralisedRecommendation.filter(
      (rec: SavedGeneralisedRecommendation) =>
        rec.selectionStatus === RecommendationStatus.PARTIAL_FIT
    ).length;
    let genFit = data.SavedGeneralisedRecommendation.filter(
      (rec: SavedGeneralisedRecommendation) =>
        rec.selectionStatus === RecommendationStatus.FIT
    ).length;
    let genMetScore = genFit + genPartialFit * 0.5;
    let genPercentage = (genMetScore / genTotal) * 100;
    return {
      genTotal,
      genNonFit,
      genPartialFit,
      genFit,
      genMetScore,
      genPercentage,
    };
  };

  useEffect(() => {
    if (!loading) {
      let tabledata = getDataForTable();
      setmetrics(tabledata);
    }
  }, [data, loading]);

  const getGeneralisedRecommendationsQuantities = () => {
    let nonFit = data.SavedGeneralisedRecommendation.filter(
      (rec: SavedGeneralisedRecommendation) =>
        rec.selectionStatus === RecommendationStatus.NON_FIT
    ).length;
    let partialFit = data.SavedGeneralisedRecommendation.filter(
      (rec: SavedGeneralisedRecommendation) =>
        rec.selectionStatus === RecommendationStatus.PARTIAL_FIT
    ).length;
    let fit = data.SavedGeneralisedRecommendation.filter(
      (rec: SavedGeneralisedRecommendation) =>
        rec.selectionStatus === RecommendationStatus.FIT
    ).length;
    return `(Fit - ${fit}, Partial Fit - ${partialFit}, Non fit - ${nonFit}).`;
  };

  const getSuitableElementsQuantity = () => {
    let selected = data.SavedSuitableGamificationElements.filter(
      (el: SavedSuitableGamificationElements) => el.selected
    ).length;
    let total = data.SavedSuitableGamificationElements.length;
    return `(Selected ${selected}/${total}).`;
  };

  const getNotSuitableElementsQuantity = () => {
    let selected = data.SavedNotSuitableGamificationElements.filter(
      (el: SavedNotSuitableGamificationElements) => el.selected
    ).length;
    let total = data.SavedNotSuitableGamificationElements.length;
    return `(Selected ${selected}/${total}).`;
  };

  const getIsoRecommendationsQuantities = () => {
    let fit = 0;
    let partialFit = 0;
    let nonFit = 0;

    (
      data.SavedUsabilityRecommendationsForGamificationElementsIso || []
    ).forEach((group: { recommendations: any[] }) => {
      group.recommendations.forEach((rec) => {
        switch (rec.selectionStatus) {
          case "FIT":
            fit++;
            break;
          case "PARTIAL_FIT":
            partialFit++;
            break;
          case "NON_FIT":
            nonFit++;
            break;
        }
      });
    });

    return `(Implemented - ${fit}, Partially implemented - ${partialFit}, Not implemented - ${nonFit}).`;
  };

  const getWcagRecommendationsQuantities = () => {
    let fit = 0;
    let partialFit = 0;
    let nonFit = 0;

    (
      data.SavedUsabilityRecommendationsForGamificationElementsWcag22 || []
    ).forEach((group: { recommendations: any[] }) => {
      group.recommendations.forEach((rec) => {
        switch (rec.selectionStatus) {
          case "FIT":
            fit++;
            break;
          case "PARTIAL_FIT":
            partialFit++;
            break;
          case "NON_FIT":
            nonFit++;
            break;
        }
      });
    });

    return `(Implemented - ${fit}, Partially implemented - ${partialFit}, Not implemented - ${nonFit}).`;
  };

  const handleElementsChange = async (gid: number, status: boolean) => {
    await fetch(`/api/saved-result/${id}/elements/${gid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    }).then((res) => {
      refetch();
    });
  };
  const handleNotSuitableElementsChange = async (
    gid: number,
    status: boolean
  ) => {
    await fetch(`/api/saved-result/${id}/non-elements/${gid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    }).then((res) => {
      refetch();
    });
  };

  useEffect(() => {
    if (!id) return;

    fetchData();
  }, [id]);

  const getRecommendationsCountTextPerElement = (item: any) => {
    const nonFitCount = item.recommendations.filter(
      (rec: any) => rec.selectionStatus === RecommendationStatus.NON_FIT
    ).length;
    const partialFitCount = item.recommendations.filter(
      (rec: any) => rec.selectionStatus === RecommendationStatus.PARTIAL_FIT
    ).length;
    const fitCount = item.recommendations.filter(
      (rec: any) => rec.selectionStatus === RecommendationStatus.FIT
    ).length;
    const totalCount = item.recommendations.length;
    const remainingToEvaluateCount =
      totalCount - (nonFitCount + partialFitCount + fitCount);
    return `(${fitCount} Implemented, ${partialFitCount} Partially implemented, ${nonFitCount} Not implemented). Total: ${totalCount}. Remaining to evaluate: ${remainingToEvaluateCount}.`;
  };

  const getUsabilityRecommendationsCountTextPerElement = (item: any) => {
    const nonFitCount = item.data.filter(
      (rec: any) => rec.selectionStatus === RecommendationStatus.NON_FIT
    ).length;
    const partialFitCount = item.data.filter(
      (rec: any) => rec.selectionStatus === RecommendationStatus.PARTIAL_FIT
    ).length;
    const fitCount = item.data.filter(
      (rec: any) => rec.selectionStatus === RecommendationStatus.FIT
    ).length;
    const totalCount = item.data.length;
    const remainingToEvaluateCount =
      totalCount - (nonFitCount + partialFitCount + fitCount);
    return `(${fitCount} Implemented, ${partialFitCount} Partially implemented, ${nonFitCount} Not implemented). Total: ${totalCount}. Remaining to evaluate: ${remainingToEvaluateCount}.`;
  };

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Website: {data?.name}
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          {`Generalised Recommendations ${getGeneralisedRecommendationsQuantities()}`}
        </h2>
        <div className="">
          <AccordionItem title="Generalised Recommendations">
            {data?.SavedGeneralisedRecommendation?.map((item: any) => (
              <RecommendationItemCard
                id={item.generalisedRecommendation.id}
                key={`${item.generalisedRecommendation.ruleIdx}`}
                title={item.generalisedRecommendation.genRecommendation}
                index={item.generalisedRecommendation.ruleIdx}
                ageGroup={item.generalisedRecommendation.ageGroup}
                domain={item.generalisedRecommendation.applicationDomain}
                disorder={item.generalisedRecommendation.disorder}
                usabilityCharacteristic={
                  item.generalisedRecommendation.usabilityPrinciple
                }
                usabilityGoal={item.generalisedRecommendation.usabilityGoal}
                gamificationGoal={
                  item.generalisedRecommendation.gamificationGoal
                }
                example={item.generalisedRecommendation.example}
                status={item.selectionStatus}
                onClick={(id, value) => {
                  handleGeneralisedRecommendationChange(id, value);
                }}
              />
            ))}
          </AccordionItem>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          {`Suitable Gamification Elements ${getSuitableElementsQuantity()}`}
        </h2>
        <AccordionItem title="Suitable Gamification Elements">
          <div className="flex flex-row flex-wrap px-2 gap-4 pt-6">
            {data.SavedSuitableGamificationElements.map(
              (element: any, index: number) => (
                <ButtonPillToggle
                  key={index}
                  selected={element.selected}
                  notSuitable={false}
                  label={
                    element.suitableGamificationElements.gamificationElement
                  }
                  onClick={() => {
                    handleElementsChange(
                      element.suitableGamificationElementsId,
                      !element.selected
                    );
                  }}
                  updated={
                    new Date(element.updatedAt) > new Date(element.createdAt)
                  }
                />
              )
            )}
          </div>
        </AccordionItem>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          {`Not Suitable Gamification Elements ${getNotSuitableElementsQuantity()}`}
        </h2>
        <AccordionItem title="Not Suitable Gamification Elements">
          <div className="flex flex-row flex-wrap px-2 gap-4 pt-6">
            {data.SavedNotSuitableGamificationElements.map(
              (element: any, index: number) => (
                <ButtonPillToggle
                  key={index}
                  selected={element.selected}
                  notSuitable={true}
                  label={
                    element.notSuitableGamificationElements
                      .notSuitableGamificationElement
                  }
                  onClick={() => {
                    handleNotSuitableElementsChange(
                      element.notSuitableGamificationElementsId,
                      !element.selected
                    );
                  }}
                />
              )
            )}
          </div>
        </AccordionItem>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          {`Element usability recommendations`}
        </h2>
        <div className="flex flex-col gap-4">
          {data.RuleMetadataByRuleIdx.map((item: any, idx: any) => {
            console.log(item.data);
            return (
              <AccordionItem
                title={`${
                  item.element
                }. ${getUsabilityRecommendationsCountTextPerElement(item)}`}
                key={idx}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[...item.data]
                    .sort((a, b) => a.id - b.id)
                    .map((entry: any, index: number) => {
                      return (
                        <RuleMetadataInteractiveCard
                          element={item.element}
                          key={entry.id}
                          data={entry}
                          onStatusChange={(
                            id: number,
                            status: RecommendationStatus | null
                          ) => {
                            handleElemRecChange(
                              entry.suitableGamificationElementsId,
                              status
                            );
                          }}
                        />
                      );
                    })}
                </div>
              </AccordionItem>
            );
          })}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          {`Usability Recommendations (ISO) ${getIsoRecommendationsQuantities()}`}
        </h2>
        <div className="flex flex-col gap-4">
          {data.SavedUsabilityRecommendationsForGamificationElementsIso.map(
            (item: any, idx: any) => {
              if (item.recommendations.length > 0)
                return (
                  <AccordionItem
                    key={idx}
                    title={`${
                      item.element
                    } ${getRecommendationsCountTextPerElement(item)}`}
                  >
                    <div className="py-1 flex flex-row">
                      <p className="font-bold">
                        Usability recommendations:&nbsp;
                      </p>
                      <ul className="list-disc list-inside text-gray-800">
                        {item.usabilityRecommendations.map(
                          (rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                      {item.recommendations.map((itemRec: any) => (
                        <RecommendationElementCard
                          key={itemRec.id}
                          title={itemRec.elementUsabilityRecommendation}
                          example={itemRec.example}
                          recommendationName={itemRec.recommendation}
                          index={itemRec.id}
                          onClick={(value: RecommendationStatus | null) => {
                            handleIsoRecommendationChange(itemRec.id, value);
                          }}
                          status={itemRec.selectionStatus}
                        />
                      ))}
                    </div>
                  </AccordionItem>
                );
              else return null;
            }
          )}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          {`Usability Recommendations (WCAG) ${getWcagRecommendationsQuantities()}`}
        </h2>
        <div className="flex flex-col gap-4">
          {data.SavedUsabilityRecommendationsForGamificationElementsWcag22.map(
            (item: any, idx: any) => {
              if (item.recommendations.length > 0)
                return (
                  <AccordionItem
                    key={idx}
                    title={`${
                      item.element
                    } ${getRecommendationsCountTextPerElement(item)}`}
                  >
                    <div className="py-1 flex flex-row">
                      <p className="font-bold">
                        Usability recommendation:&nbsp;
                      </p>
                      <ul className="list-disc list-inside text-gray-800">
                        {item.usabilityRecommendations.map(
                          (rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                      {...item.recommendations.map((itemRec: any) => (
                        <RecommendationElementCard
                          key={itemRec.id}
                          title={itemRec.elementUsabilityRecommendation}
                          example={itemRec.example}
                          recommendationName={itemRec.recommendation}
                          index={itemRec.id}
                          onClick={(value: RecommendationStatus | null) => {
                            handleWcagRecommendationChange(itemRec.id, value);
                          }}
                          status={itemRec.selectionStatus}
                        />
                      ))}
                    </div>
                  </AccordionItem>
                );
              else return null;
            }
          )}
        </div>
      </div>

      <div className="py-3">
        <h2 className="text-xl font-semibold text-black">{`Metrics`}</h2>
        <table className="min-w-full table-auto border border-gray-300 text-left text-sm text-gray-800">
          <thead className="bg-gray-100 font-semibold text-gray-900">
            <tr>
              <th className="border-b border-gray-300 px-4 py-3">
                Calculation Element
              </th>
              <th className="border-b border-gray-300 px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="border-b border-gray-200 px-4 py-2">
                Total number of general recommendations provided
              </td>
              <td className="border-b border-gray-200 px-4 py-2">
                {metrics.genTotal}
              </td>
            </tr>
            <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="border-b border-gray-200 px-4 py-2">Fully met</td>
              <td className="border-b border-gray-200 px-4 py-2">
                {metrics.genFit}
              </td>
            </tr>
            <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="border-b border-gray-200 px-4 py-2">
                Partially met
              </td>
              <td className="border-b border-gray-200 px-4 py-2">
                {metrics.genPartialFit}
              </td>
            </tr>
            <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="border-b border-gray-200 px-4 py-2">
                Not met at all
              </td>
              <td className="border-b border-gray-200 px-4 py-2">
                {metrics.genNonFit}
              </td>
            </tr>
            <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="border-b border-gray-200 px-4 py-2 font-medium">
                Total met
              </td>
              <td className="border-b border-gray-200 px-4 py-2 font-medium">
                {metrics.genMetScore}
              </td>
            </tr>
            <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="border-b border-gray-200 px-4 py-2 font-semibold">
                Percentage met
              </td>
              <td className="border-b border-gray-200 px-4 py-2 font-semibold">
                {metrics.genPercentage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
