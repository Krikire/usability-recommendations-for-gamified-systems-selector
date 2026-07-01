import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { RecommendationStatus } from "@prisma/client";
import { SavedElementUsabilityRecommendation } from "@/app/types/types";

type RecommendationSavedType = {
  id: number;
  status?: RecommendationStatus;
};

type ElementSelectionStatus = {
  id: number;
  status: boolean;
};

type SavedResultType = {
  name: string;
  generalisedRecommendations: RecommendationSavedType[];
  elements: ElementSelectionStatus[];
  usabilityRecommendationsForGamificationElementsIso: RecommendationSavedType[];
  notSuitableElements: ElementSelectionStatus[];
  savedUsabilityRecommendationsForGamificationElementsWcag: RecommendationSavedType[];
  savedElementUsabilityRecommendations: SavedElementUsabilityRecommendation[];
};

export async function POST(req: NextRequest) {
  const {
    name,
    generalisedRecommendations,
    elements,
    usabilityRecommendationsForGamificationElementsIso,
    notSuitableElements,
    savedUsabilityRecommendationsForGamificationElementsWcag,
    savedElementUsabilityRecommendations,
  }: SavedResultType = await req.json();
  console.log("Received data:", savedElementUsabilityRecommendations);

  if (!name || !generalisedRecommendations || !elements) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const savedResult = await prisma.savedResult.create({
      data: {
        name,
      },
    });
    const savedGeneralisedRecommendations =
      await prisma.savedGeneralisedRecommendation.createMany({
        data: generalisedRecommendations.map((rec) => ({
          savedResultId: savedResult.id,
          generalisedRecommendationId: rec.id,
          selectionStatus: rec.status ?? null,
        })),
      });

    const savedElements =
      await prisma.savedSuitableGamificationElements.createMany({
        data: elements.map((element) => ({
          savedResultId: savedResult.id,
          suitableGamificationElementsId: element.id,
          selected: element.status ?? false,
        })),
      });
    const savedUsabilityRecommendationsForGamificationElementsIso =
      await prisma.savedUsabilityRecommendationsForGamificationElementsIso.createMany(
        {
          data: usabilityRecommendationsForGamificationElementsIso.map(
            (rec) => ({
              savedResultId: savedResult.id,
              usabilityRecommendationsForGamificationElementsIsoId: rec.id,
              selectionStatus: rec.status ?? null,
            })
          ),
        }
      );
    const savedNotSuitableElements =
      await prisma.savedNotSuitableGamificationElements.createMany({
        data: notSuitableElements.map((element) => ({
          savedResultId: savedResult.id,
          notSuitableGamificationElementsId: element.id,
          selected: element.status ?? false,
        })),
      });
    const savedUsabilityRecommendationsForGamificationElementsWcagResult =
      await prisma.savedUsabilityRecommendationsForGamificationElementsWcag22.createMany(
        {
          data: savedUsabilityRecommendationsForGamificationElementsWcag.map(
            (rec) => ({
              savedResultId: savedResult.id,
              usabilityRecommendationsForGamificationElementsWcag22Id: rec.id,
              selectionStatus: rec.status ?? null,
            })
          ),
        }
      );
    const savedElementUsabilityRecommendationsResult =
      await prisma.savedElementUsabilityRecommendation.createMany({
        data: savedElementUsabilityRecommendations.map((rec) => ({
          savedResultId: savedResult.id,
          suitableGamificationElementsId: rec.elementId,
          selectionStatus: rec.status,
        })),
      });

    return NextResponse.json(savedResult, { status: 201 });
  } catch (error) {
    console.error("Error saving result:", error);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}
