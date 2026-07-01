// app/api/gamification-recommendations/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface RequestBody {
  elements: string[]; // selected gamification elements
  disorders: string[]; // selected disorders
}

interface RecRow {
  id?: number;
  disorder: string;
  recommendation: string;
  elementUsabilityRecommendation: string | null;
  example: string | null;
}

type InitialRow = {
  gamificationElement: string;
} & RecRow;

export async function POST(req: NextRequest) {
  const { elements, disorders } = (await req.json()) as RequestBody;

  if (!elements?.length) {
    return NextResponse.json([], { status: 200 });
  }

  /* ---------- WCAG 2.2 recommendations ---------- */
  const wcagRows =
    await prisma.usabilityRecommendationsForGamificationElementsWcag22.findMany(
      {
        where: {
          gamificationElement: { in: elements },
          disorder: disorders?.length && !disorders.includes('Not applicable') ? { in: disorders } : undefined,
        },
        select: {
          id: true,
          gamificationElement: true,
          disorder: true,
          wcagRecommendation: true,
          elementUsabilityRecommendation: true,
          example: true,
        },
      }
    );

  /* ---------- ISO recommendations --------------- */
  const isoRows =
    await prisma.usabilityRecommendationsForGamificationElementsIso.findMany({
      where: {
        gamificationElement: { in: elements },
      },
      select: {
        id: true,
        gamificationElement: true,
        isoRecommendation: true,
        elementUsabilityRecommendation: true,
        example: true,
      },
    });

  /* ---------- Normalise field names ------------- */
  const normalised: InitialRow[] = [
    ...wcagRows.map(
      (r: {
        id: any; // not used, but needed for type consistency
        gamificationElement: any;
        disorder: any;
        wcagRecommendation: any;
        elementUsabilityRecommendation: any;
        example: any;
      }) => ({
        id: r.id, // not used, but needed for type consistency
        gamificationElement: r.gamificationElement,
        disorder: r.disorder,
        recommendation: r.wcagRecommendation,
        elementUsabilityRecommendation: r.elementUsabilityRecommendation,
        example: r.example,
      })
    ),
    ...isoRows.map(
      (r: {
        id: any; // not used, but needed for type consistency
        gamificationElement: any;
        isoRecommendation: any;
        elementUsabilityRecommendation: any;
        example: any;
      }) => ({
        id: r.id, // not used, but needed for type consistency
        gamificationElement: r.gamificationElement,
        disorder: "-", // spec requirement
        recommendation: r.isoRecommendation,
        elementUsabilityRecommendation: r.elementUsabilityRecommendation,
        example: r.example,
      })
    ),
  ];

  const groupedMap = new Map<string, RecRow[]>();

  const suitableUsabilityRecs =
    await prisma.suitableGamificationElements.findMany({
      where: {
        gamificationElement: { in: elements },
      },
      select: {
        id: true,
        gamificationElement: true,
        usabilityRecommendation: true,
      },
    });

  type UsabilityRecOut = { id: number; recommendation: string };

  const elementsUsability = new Map<string, UsabilityRecOut[]>();

  suitableUsabilityRecs.forEach((rec) => {
    const key = rec.gamificationElement!;
    const value = rec.usabilityRecommendation?.trim();
    const id = rec.id;

    if (!value || value === "-") return;

    const existing = elementsUsability.get(key) ?? [];

    if (!existing.some((r) => r.recommendation === value)) {
      existing.push({ id, recommendation: value });
    }

    elementsUsability.set(key, existing);
  });

  normalised.forEach((rec) => {
    const key = rec.gamificationElement;
    if (!groupedMap.has(key)) groupedMap.set(key, []);
    groupedMap.get(key)!.push({
      id: rec.id,
      disorder: rec.disorder,
      recommendation: rec.recommendation,
      elementUsabilityRecommendation: rec.elementUsabilityRecommendation,
      example: rec.example,
    });
  });

  /* ---------- 4. Convert to desired shape ------------------------ */
  const result = Array.from(groupedMap, ([element, recommendations]) => ({
    element,
    usabilityRecommendations: elementsUsability.get(element) ?? [],
    recommendations,
  }));

  /* ---------- 5. Send JSON -------------------------------------- */
  return NextResponse.json(result, { status: 200 });
}
