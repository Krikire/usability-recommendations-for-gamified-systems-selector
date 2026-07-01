import prisma from "@/app/lib/prisma";
import { RecRow, RecRowOut } from "@/app/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  try {
    const result = await prisma.savedResult.findUnique({
      where: { id: Number(id) },
      include: {
        SavedGeneralisedRecommendation: {
          include: {
            generalisedRecommendation: true,
          },
          orderBy: {
            generalisedRecommendation: {
              id: "asc",
            },
          },
        },
        SavedSuitableGamificationElements: {
          include: {
            suitableGamificationElements: true,
          },
          orderBy: {
            suitableGamificationElements: {
              gamificationElement: "asc",
            },
          },
        },
        SavedNotSuitableGamificationElements: {
          include: {
            notSuitableGamificationElements: true,
          },
          orderBy: {
            notSuitableGamificationElements: {
              notSuitableGamificationElement: "asc",
            },
          },
        },
        SavedUsabilityRecommendationsForGamificationElementsIso: {
          include: {
            usabilityRecommendationsForGamificationElementsIso: true,
          },
          orderBy: {
            usabilityRecommendationsForGamificationElementsIso: {
              id: "asc",
            },
          },
        },
        SavedElementUsabilityRecommendation: {
          where: {
            savedResultId: Number(id),
          },
          include: {
            suitableGamificationElements: true,
          },
        },
        SavedUsabilityRecommendationsForGamificationElementsWcag22: {
          include: {
            usabilityRecommendationsForGamificationElementsWcag22: true,
          },
          orderBy: {
            usabilityRecommendationsForGamificationElementsWcag22: {
              id: "asc",
            },
          },
        },
      },
    });
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    const ruleMetadataByElement: {
      element: string;
      data: typeof result.SavedElementUsabilityRecommendation;
    }[] = [];
    const groupingMap: Record<
      string,
      typeof result.SavedElementUsabilityRecommendation
    > = {};

    for (const rec of result.SavedElementUsabilityRecommendation) {
      const elementName = rec.suitableGamificationElements.gamificationElement!;
      //check if element is selected
      const ids = result.SavedSuitableGamificationElements.map((e) => ({
        element: e.suitableGamificationElements.gamificationElement,
        status: e.selected,
      }));
      const elementStatus = ids.find((e) => e.element === elementName)?.status;
      if (!elementStatus) {
        continue; // Skip if the element is not selected
      }
      if (!groupingMap[elementName]) {
        groupingMap[elementName] = [];
      }
      groupingMap[elementName].push(rec);
    }

    for (const [element, data] of Object.entries(groupingMap)) {
      ruleMetadataByElement.push({ element, data });
    }

    const groupISORecommendations = new Map<string, RecRowOut[]>();
    const groupWcagRecommendations = new Map<string, RecRowOut[]>();
    const elementsUsability = new Map<string, string[]>();

    for (const rec of result?.SavedUsabilityRecommendationsForGamificationElementsIso ||
      []) {
      const element =
        rec.usabilityRecommendationsForGamificationElementsIso
          .gamificationElement!;
      const ids = result.SavedSuitableGamificationElements.map((e) => ({
        element: e.suitableGamificationElements.gamificationElement,
        status: e.selected,
      }));
      const elementStatus = ids.find((e) => e.element === element)?.status;
      if (!elementStatus) {
        continue; // Skip if the element is not selected
      }
      if (!groupISORecommendations.has(element)) {
        groupISORecommendations.set(element, []);
      }

      groupISORecommendations.get(element)!.push({
        id: rec.usabilityRecommendationsForGamificationElementsIso.id,
        disorder: "",
        recommendation:
          rec.usabilityRecommendationsForGamificationElementsIso
            .isoRecommendation!,
        elementUsabilityRecommendation:
          rec.usabilityRecommendationsForGamificationElementsIso
            .elementUsabilityRecommendation!,
        example: rec.usabilityRecommendationsForGamificationElementsIso.example,
        selectionStatus: rec.selectionStatus,
      });
    }

    const usabilityRecs = await prisma.suitableGamificationElements.findMany({
      where: {
        gamificationElement: { in: Array.from(groupISORecommendations.keys()) },
      },
      select: {
        gamificationElement: true,
        usabilityRecommendation: true,
      },
    });

    usabilityRecs.forEach((rec) => {
      const key = rec.gamificationElement!;
      const value = rec.usabilityRecommendation?.trim();

      if (!value || value === "-") return;

      if (!elementsUsability.has(key)) {
        elementsUsability.set(key, [value]);
      } else if (!elementsUsability.get(key)!.includes(value)) {
        elementsUsability.get(key)!.push(value);
      }
    });

    result?.SavedUsabilityRecommendationsForGamificationElementsWcag22.forEach(
      (rec) => {
        //check if the element is selected
        const element =
          rec.usabilityRecommendationsForGamificationElementsWcag22
            .gamificationElement!;
        const ids = result.SavedSuitableGamificationElements.map((e) => ({
          element: e.suitableGamificationElements.gamificationElement,
          status: e.selected,
        }));
        const elementStatus = ids.find((e) => e.element === element)?.status;
        if (!elementStatus) {
          return; // Skip if the element is not selected
        }
        if (
          !groupWcagRecommendations.has(
            rec.usabilityRecommendationsForGamificationElementsWcag22
              .gamificationElement!
          )
        ) {
          groupWcagRecommendations.set(
            rec.usabilityRecommendationsForGamificationElementsWcag22
              .gamificationElement!,
            []
          );
        }
        let newrecs = [
          ...(groupWcagRecommendations.get(
            rec.usabilityRecommendationsForGamificationElementsWcag22
              .gamificationElement!
          ) || []),
          {
            id: rec.usabilityRecommendationsForGamificationElementsWcag22.id,
            disorder:
              rec.usabilityRecommendationsForGamificationElementsWcag22
                .disorder!,
            recommendation:
              rec.usabilityRecommendationsForGamificationElementsWcag22
                .wcagRecommendation!,
            elementUsabilityRecommendation:
              rec.usabilityRecommendationsForGamificationElementsWcag22
                .elementUsabilityRecommendation!,
            example:
              rec.usabilityRecommendationsForGamificationElementsWcag22.example,
            selectionStatus: rec.selectionStatus,
          },
        ];
        groupWcagRecommendations.set(
          rec.usabilityRecommendationsForGamificationElementsWcag22
            .gamificationElement!,
          newrecs
        );
      }
    );
    console.log(elementsUsability);

    const returnableIso = Array.from(
      groupISORecommendations,
      ([element, recommendations]) => ({
        element,
        usabilityRecommendations: elementsUsability.get(element) ?? [],
        recommendations,
      })
    );
    const returnableWcag = Array.from(
      groupWcagRecommendations,
      ([element, recommendations]) => ({
        element,
        usabilityRecommendations: elementsUsability.get(element) ?? [],
        recommendations,
      })
    );

    const newResult = {
      name: result?.name,
      SavedGeneralisedRecommendation: result?.SavedGeneralisedRecommendation,
      SavedSuitableGamificationElements:
        result?.SavedSuitableGamificationElements,
      SavedNotSuitableGamificationElements:
        result?.SavedNotSuitableGamificationElements,
      SavedUsabilityRecommendationsForGamificationElementsIso: returnableIso,
      SavedUsabilityRecommendationsForGamificationElementsWcag22:
        returnableWcag,
      RuleMetadataByRuleIdx: ruleMetadataByElement,
    };

    return NextResponse.json(newResult, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved result:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved result" },
      { status: 500 }
    );
  }
}
