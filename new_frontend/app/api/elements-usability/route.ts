import { buildWhere } from "@/app/lib/helpers/filterBuilder";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body = await request.json();
  body = {
    ...body,
    ageGroup: body.ageGroup ?? [],
    applicationDomain: body.applicationDomain ?? [],
    disorder: body.disorder ?? [],
    usabilityGoal: body.usabilityGoal ?? [],
    gamificationGoal: body.gamificationGoal ?? [],
    gamificationElement: body.gamificationElement ?? [],
  };

  if (!body.gamificationElement.length) {
    return NextResponse.json([], { status: 200 });
  }

  let data: Record<string, any[]> = {};

  const where = {
    ...(body.ageGroup.length && { ageGroup: { in: body.ageGroup } }),
    ...(body.applicationDomain.length && {
      applicationDomain: { in: body.applicationDomain },
    }),
    ...(body.disorder.length && { disorder: { in: body.disorder } }),
    ...(body.usabilityGoal.length && {
      usabilityGoal: { in: body.usabilityGoal },
    }),
    ...(body.gamificationGoal.length && {
      gamificationGoal: { in: body.gamificationGoal },
    }),
    ...(body.gamificationElement.length && {
      gamificationElement: { in: body.gamificationElement },
    }),
  };

  const suitableElems = await prisma.suitableGamificationElements.findMany({
    where,
  });
  data = suitableElems.reduce((acc: Record<string, any[]>, elem: any) => {
    const key = elem.gamificationElement;

    if (!key) return acc;

    if (!elem.usabilityRecommendation) {
      return acc; // Skip elements without usability recommendations
    }

    if (!acc[key]) {
      acc[key] = [];
    }

    const alreadyExists = acc[key].some(
      (e) => e.data.usabilityRecommendation === elem.usabilityRecommendation
    );

    if (!alreadyExists) {
      acc[key].push({
        id: elem.id,
        selectionStatus: null, // default or logic-based
        data: elem,
      });
    }

    return acc;
  }, {});

  const elementRec = Object.entries(data).map(([element, data]) => ({
    element,
    data,
  }));

  return NextResponse.json({ data: elementRec }, { status: 200 });
}
