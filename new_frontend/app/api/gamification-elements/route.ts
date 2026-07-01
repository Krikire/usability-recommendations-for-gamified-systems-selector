import { buildWhere } from "@/app/lib/helpers/filterBuilder";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body = await request.json();
  body = {
    ...body,
    ageGroup: body.ageGroup && !body.ageGroup.includes('Not applicable') ? body.ageGroup : [],
    applicationDomain: body.applicationDomain && !body.applicationDomain.includes('Not applicable') ? body.applicationDomain : [],
    disorder: body.disorder && !body.disorder.includes('Not applicable') ? body.disorder : [],
    usabilityGoal: body.usabilityGoal && !body.usabilityGoal.includes('Not applicable') ? body.usabilityGoal : [],
    gamificationGoal: body.gamificationGoal && !body.gamificationGoal.includes('Not applicable') ? body.gamificationGoal : [],
  };


  const critArrays = [
    body.ageGroup,
    body.applicationDomain,
    body.disorder,
    body.usabilityGoal,
    body.gamificationGoal,
  ];

  console.log(critArrays);

  const noFilters = critArrays.every((arr) => arr.length === 0);

  //   SELECT DISTINCT gamificationElement FROM suitable_gamification_elements
  const allNamesRows = await prisma.suitableGamificationElements.findMany({
    select: { gamificationElement: true, id: true },
    distinct: ["gamificationElement"],
  });

  if (noFilters) {
    return NextResponse.json({
      suitable: allNamesRows,
      notSuitable: [],
      other: [],
    });
  }

  // Resolve suitable / notSuitable / other for a given where clause.
  const computeForWhere = async (where: Record<string, any>) => {
    const [suitableRows, notRows] = await Promise.all([
      prisma.suitableGamificationElements.findMany({
        where,
        select: { gamificationElement: true, id: true },
        distinct: ["gamificationElement"],
      }),
      prisma.notSuitableGamificationElements.findMany({
        where,
        select: { notSuitableGamificationElement: true, id: true },
        distinct: ["notSuitableGamificationElement"],
      }),
    ]);

    const notNamesSet = new Set(
      notRows.map((r) => r.notSuitableGamificationElement)
    );
    const suitable = suitableRows.filter(
      (r) => !notNamesSet.has(r.gamificationElement)
    );
    const notSuitable = notRows.map((r) => ({
      id: r.id,
      gamificationElement: r.notSuitableGamificationElement,
    }));
    const suitableNames = new Set(suitable.map((r) => r.gamificationElement));
    const other = allNamesRows.filter(
      (r) =>
        !suitableNames.has(r.gamificationElement) &&
        !notNamesSet.has(r.gamificationElement)
    );
    return { suitable, notSuitable, other };
  };

  const fullWhere = {
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
  };

  let result = await computeForWhere(fullWhere);

  // Graceful degradation: if no suitable elements matched the full criteria,
  // fall back to a looser match using only age group + application domain.
  // Skip the fallback when neither is set (nothing to narrow by).
  if (result.suitable.length === 0) {
    const fallbackWhere = {
      ...(body.ageGroup.length && { ageGroup: { in: body.ageGroup } }),
      ...(body.applicationDomain.length && {
        applicationDomain: { in: body.applicationDomain },
      }),
    };
    if (Object.keys(fallbackWhere).length > 0) {
      result = await computeForWhere(fallbackWhere);
    }
  }

  return NextResponse.json(result);
}
