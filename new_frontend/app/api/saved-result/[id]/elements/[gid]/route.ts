import prisma from "@/app/lib/prisma";
import { RecommendationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type RecommendationInput = {
  status: boolean;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; gid: string }> }
) {
  const { id, gid } = await params;
  if (!id && !gid) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  try {
    let { status }: RecommendationInput = await req.json();
    await prisma.savedSuitableGamificationElements.update({
      data: {
        selected: status,
      },
      where: {
        suitableGamificationElementsId_savedResultId: {
          savedResultId: Number(id),
          suitableGamificationElementsId: Number(gid),
        },
      },
    });
    //update recommendations based on the gamification element changed
    await updateRecommendationsOnElementChanged(
      Number(id),
      Number(gid),
      status
    );
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 409 });
  }
}

/*
 * This function updates the recommendations based on the gamification element
 * that was changed. It fetches the element name, finds the relevant recommendations,
 * and updates the saved recommendations accordingly.
 * @param id - The saved result ID
 * @param gid - The gamification element ID
 * @param status - The status of the gamification element (true if selected, false otherwise)
 * @returns {Promise<void>} - A promise that resolves when the recommendations are updated
 */
async function updateRecommendationsOnElementChanged(
  id: Number,
  gid: Number,
  status: boolean
) {
  //fetch element name for future operations
  const element = await prisma.suitableGamificationElements.findUnique({
    where: {
      id: Number(gid),
    },
    select: {
      gamificationElement: true,
    },
  });
  if (!element) {
    return;
  }
  let name = element.gamificationElement;
  //if selected is true, update the saved recommendations.
  if (status) {
    //find the applicable recommendations
    const [isorecs, wcagSavedElements] = await Promise.all([
      prisma.usabilityRecommendationsForGamificationElementsIso.findMany({
        where: {
          gamificationElement: name,
        },
        select: {
          id: true,
        },
      }),
      prisma.savedUsabilityRecommendationsForGamificationElementsWcag22.findMany(
        {
          where: {
            savedResultId: Number(id),
          },
          select: {
            usabilityRecommendationsForGamificationElementsWcag22Id: true,
            usabilityRecommendationsForGamificationElementsWcag22: {
              select: {
                disorder: true,
              },
            },
          },
        }
      ),
    ]);
    //find out disorders used for wcag
    const disorderSet = new Set(
      wcagSavedElements
        .map(
          (e) =>
            e.usabilityRecommendationsForGamificationElementsWcag22.disorder
        )
        .filter((d): d is string => d !== null)
    );
    const disorderArray = [...disorderSet];
    //get the relevant wcag recommendations
    const wcagRecs =
      await prisma.usabilityRecommendationsForGamificationElementsWcag22.findMany(
        {
          where: {
            disorder: {
              in: disorderArray,
            },
            gamificationElement: name,
          },
        }
      );
    //sanity check: do we need to insert?
    const [existingIsoRecs, existingWcagRecs] = await Promise.all([
      prisma.savedUsabilityRecommendationsForGamificationElementsIso.findMany({
        where: {
          savedResultId: Number(id),
          usabilityRecommendationsForGamificationElementsIsoId: {
            in: isorecs.map((e) => e.id),
          },
        },
        select: {
          usabilityRecommendationsForGamificationElementsIsoId: true,
        },
      }),
      prisma.savedUsabilityRecommendationsForGamificationElementsWcag22.findMany(
        {
          where: {
            savedResultId: Number(id),
            usabilityRecommendationsForGamificationElementsWcag22Id: {
              in: wcagRecs.map((e) => e.id),
            },
          },
          select: {
            usabilityRecommendationsForGamificationElementsWcag22Id: true,
          },
        }
      ),
    ]);
    const existingIsoRecIds = existingIsoRecs.map(
      (e) => e.usabilityRecommendationsForGamificationElementsIsoId
    );
    const newIsoRecs = isorecs.filter(
      (rec) => !existingIsoRecIds.includes(rec.id)
    );
    const existingRecIds = existingWcagRecs.map(
      (e) => e.usabilityRecommendationsForGamificationElementsWcag22Id
    );
    const newWcagRecs = wcagRecs.filter(
      (rec) => !existingRecIds.includes(rec.id)
    );
    //early exit if no new recommendations
    if (newIsoRecs.length === 0 && newWcagRecs.length === 0) {
      return;
    }
    //insert new recommendation relations if not exists
    await Promise.all([
      prisma.savedUsabilityRecommendationsForGamificationElementsIso.createMany(
        {
          data: newIsoRecs.map((rec) => ({
            savedResultId: Number(id),
            usabilityRecommendationsForGamificationElementsIsoId: rec.id,
          })),
          skipDuplicates: true,
        }
      ),
      prisma.savedUsabilityRecommendationsForGamificationElementsWcag22.createMany(
        {
          data: newWcagRecs.map((rec) => ({
            savedResultId: Number(id),
            usabilityRecommendationsForGamificationElementsWcag22Id: rec.id,
          })),
          skipDuplicates: true,
        }
      ),
    ]);
    //update the element usability recommendation
    //get criteria
    const criteria = await prisma.suitableGamificationElements.findMany({
      where: {
        id: Number(gid),
        SavedElementUsabilityRecommendation: {
          some: {
            savedResultId: Number(id),
          },
        },
      },
      select: {
        usabilityRecommendation: true,
        usabilityGoal: true,
        gamificationGoal: true,
        ageGroup: true,
        applicationDomain: true,
        disorder: true,
        gamificationElement: true,
      },
    });
    //create empty arrays or filled for each criteria
    const criteriaMap = {
      usabilityRecommendation: criteria.map((e) => e.usabilityRecommendation),
      usabilityGoal: criteria.map((e) => e.usabilityGoal),
      gamificationGoal: criteria.map((e) => e.gamificationGoal),
      ageGroup: criteria.map((e) => e.ageGroup),
      applicationDomain: criteria.map((e) => e.applicationDomain),
      disorder: criteria.map((e) => e.disorder),
      gamificationElement: criteria.map((e) => e.gamificationElement),
    };
    //remove empty strings and duplicates
    for (const key in criteriaMap) {
      const typedKey = key as keyof typeof criteriaMap;
      criteriaMap[typedKey] = Array.from(
        new Set(criteriaMap[typedKey].filter((e) => e && e !== ""))
      );
    }
    //get renewed element usability recommendations
    const renewedElementUsabilityRecs =
      await prisma.suitableGamificationElements.findMany({
        where: {
          usabilityRecommendation:
            criteriaMap.usabilityRecommendation.length > 0
              ? {
                  in: criteriaMap.usabilityRecommendation.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
          usabilityGoal:
            criteriaMap.usabilityGoal.length > 0
              ? {
                  in: criteriaMap.usabilityGoal.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
          gamificationGoal:
            criteriaMap.gamificationGoal.length > 0
              ? {
                  in: criteriaMap.gamificationGoal.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
          ageGroup:
            criteriaMap.ageGroup.length > 0
              ? {
                  in: criteriaMap.ageGroup.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
          applicationDomain:
            criteriaMap.applicationDomain.length > 0
              ? {
                  in: criteriaMap.applicationDomain.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
          disorder:
            criteriaMap.disorder.length > 0
              ? {
                  in: criteriaMap.disorder.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
          gamificationElement:
            criteriaMap.gamificationElement.length > 0
              ? {
                  in: criteriaMap.gamificationElement.filter(
                    (e): e is string => e !== null
                  ),
                }
              : undefined,
        },
        select: {
          id: true,
        },
      });
    //insert new element usability recommendations if not exists
    const existingElementUsabilityRecs =
      await prisma.savedElementUsabilityRecommendation.findMany({
        where: {
          savedResultId: Number(id),
          suitableGamificationElementsId: Number(gid),
        },
        select: {
          suitableGamificationElementsId: true,
          savedResultId: true,
        },
      });
    const existingElementUsabilityRecIds = existingElementUsabilityRecs.map(
      (e) => e.suitableGamificationElementsId
    );
    const newElementUsabilityRecs = renewedElementUsabilityRecs.filter(
      (rec) => !existingElementUsabilityRecIds.includes(rec.id)
    );
    if (newElementUsabilityRecs.length > 0) {
      await prisma.savedElementUsabilityRecommendation.createMany({
        data: newElementUsabilityRecs.map((rec) => ({
          savedResultId: Number(id),
          suitableGamificationElementsId: rec.id,
        })),
        skipDuplicates: true,
      });
    }
    return;
  }
}
