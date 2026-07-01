-- CreateTable
CREATE TABLE "SavedElementUsabilityRecommendation" (
    "id" SERIAL NOT NULL,
    "suitableGamificationElementsId" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,
    "selectionStatus" "RecommendationStatus",

    CONSTRAINT "SavedElementUsabilityRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedElementUsabilityRecommendation_suitableGamificationEle_key" ON "SavedElementUsabilityRecommendation"("suitableGamificationElementsId", "savedResultId");

-- AddForeignKey
ALTER TABLE "SavedElementUsabilityRecommendation" ADD CONSTRAINT "SavedElementUsabilityRecommendation_suitableGamificationEl_fkey" FOREIGN KEY ("suitableGamificationElementsId") REFERENCES "suitable_gamification_elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedElementUsabilityRecommendation" ADD CONSTRAINT "SavedElementUsabilityRecommendation_savedResultId_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
