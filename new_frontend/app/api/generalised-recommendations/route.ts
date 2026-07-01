import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { buildWhere } from "@/app/lib/helpers/filterBuilder";
import { deduplicate } from "@/app/lib/helpers/deduplicate";

export async function POST(request: NextRequest) {
  let body = await request.json();
  body = {
    ...body,
    ageGroup: body.ageGroup ?? [],
    applicationDomain: body.applicationDomain ?? [],
    disorder: body.disorder ?? [],
    usabilityGoal: body.usabilityGoal ?? [],
    gamificationGoal: body.gamificationGoal ?? [],
    usabilityPrinciple: body.usabilityPrinciple ?? [],
  };

  // Build where clause – include optional usabilityGoal & gamificationGoal
  const where = buildWhere(body, [
    "ageGroup",
    "applicationDomain",
    "disorder",
    "usabilityGoal",
    "gamificationGoal",
    "usabilityPrinciple",
  ]);

  let data = await prisma.generalisedRecommendations.findMany({
    where,
    orderBy: { ruleIdx: "asc" },
  });

  // Graceful degradation: if the full-criteria match is empty, fall back to a
  // looser match using only age group + application domain. Skip the fallback
  // when neither of those is set (nothing to narrow by → keep the empty result).
  if (data.length === 0) {
    const fallbackWhere = buildWhere(body, ["ageGroup", "applicationDomain"]);
    if (Object.keys(fallbackWhere).length > 0) {
      data = await prisma.generalisedRecommendations.findMany({
        where: fallbackWhere,
        orderBy: { ruleIdx: "asc" },
      });
    }
  }

  const deduplicatedData = deduplicate(data);
  return NextResponse.json(deduplicatedData);
}
