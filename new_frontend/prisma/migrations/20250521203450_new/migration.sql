-- CreateTable
CREATE TABLE "generalised_recommendations" (
    "id" SERIAL NOT NULL,
    "rule_idx" INTEGER NOT NULL,
    "usabilityGoal" TEXT,
    "usabilityPrinciple" TEXT,
    "ageGroup" TEXT,
    "applicationDomain" TEXT,
    "disorder" TEXT,
    "gamificationGoal" TEXT,
    "genRecommendation" TEXT,
    "example" TEXT,

    CONSTRAINT "generalised_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedGeneralisedRecommendation" (
    "generalisedRecommendationId" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,

    CONSTRAINT "SavedGeneralisedRecommendation_pkey" PRIMARY KEY ("generalisedRecommendationId","savedResultId")
);

-- CreateTable
CREATE TABLE "suitable_gamification_elements" (
    "id" SERIAL NOT NULL,
    "rule_idx" INTEGER NOT NULL,
    "ageGroup" TEXT,
    "applicationDomain" TEXT,
    "disorder" TEXT,
    "gamificationGoal" TEXT,
    "usabilityGoal" TEXT,
    "usabilityCharacteristic" TEXT,
    "gamificationElement" TEXT,
    "usabilityRecommendation" TEXT,

    CONSTRAINT "suitable_gamification_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSuitableGamificationElements" (
    "suitableGamificationElementsId" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,

    CONSTRAINT "SavedSuitableGamificationElements_pkey" PRIMARY KEY ("suitableGamificationElementsId","savedResultId")
);

-- CreateTable
CREATE TABLE "usability_characteristics" (
    "id" SERIAL NOT NULL,
    "rule_idx" INTEGER NOT NULL,
    "usabilityGoal" TEXT,
    "ageGroup" TEXT,
    "disorder" TEXT,
    "applicationDomain" TEXT,
    "usabilityCharacteristic" TEXT,

    CONSTRAINT "usability_characteristics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedUsabilityCharacteristics" (
    "usabilityCharacteristicsId" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,

    CONSTRAINT "SavedUsabilityCharacteristics_pkey" PRIMARY KEY ("usabilityCharacteristicsId","savedResultId")
);

-- CreateTable
CREATE TABLE "usability_recommendations_for_gamification_elements_iso_" (
    "id" SERIAL NOT NULL,
    "rule_idx" INTEGER NOT NULL,
    "gamificationElement" TEXT,
    "ISOrecommendation" TEXT,
    "elementUsabilityRecommendation" TEXT,
    "example" TEXT,

    CONSTRAINT "usability_recommendations_for_gamification_elements_iso__pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedUsabilityRecommendationsForGamificationElementsIso" (
    "usabilityRecommendationsForGamificationElementsIsoId" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,

    CONSTRAINT "SavedUsabilityRecommendationsForGamificationElementsIso_pkey" PRIMARY KEY ("usabilityRecommendationsForGamificationElementsIsoId","savedResultId")
);

-- CreateTable
CREATE TABLE "not_suitable_gamification_elements" (
    "id" SERIAL NOT NULL,
    "rule_idx" INTEGER NOT NULL,
    "ageGroup" TEXT,
    "applicationDomain" TEXT,
    "disorder" TEXT,
    "usabilityGoal" TEXT,
    "gamificationGoal" TEXT,
    "duration" TEXT,
    "notSuitableGamificationElement" TEXT,

    CONSTRAINT "not_suitable_gamification_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedNotSuitableGamificationElements" (
    "notSuitableGamificationElementsId" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,

    CONSTRAINT "SavedNotSuitableGamificationElements_pkey" PRIMARY KEY ("notSuitableGamificationElementsId","savedResultId")
);

-- CreateTable
CREATE TABLE "usability_recommendations_for_gamification_elements_wcag_2_2_" (
    "id" SERIAL NOT NULL,
    "rule_idx" INTEGER NOT NULL,
    "gamificationElement" TEXT,
    "disorder" TEXT,
    "WCAGrecommendation" TEXT,
    "elementUsabilityRecommendation" TEXT,
    "example" TEXT,

    CONSTRAINT "usability_recommendations_for_gamification_elements_wcag_2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedUsabilityRecommendationsForGamificationElementsWcag22" (
    "usabilityRecommendationsForGamificationElementsWcag22Id" INTEGER NOT NULL,
    "savedResultId" INTEGER NOT NULL,

    CONSTRAINT "SavedUsabilityRecommendationsForGamificationElementsWcag22_pkey" PRIMARY KEY ("usabilityRecommendationsForGamificationElementsWcag22Id","savedResultId")
);

-- CreateTable
CREATE TABLE "SavedResult" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedGeneralisedRecommendation" ADD CONSTRAINT "SavedGeneralisedRecommendation_generalisedRecommendationId_fkey" FOREIGN KEY ("generalisedRecommendationId") REFERENCES "generalised_recommendations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGeneralisedRecommendation" ADD CONSTRAINT "SavedGeneralisedRecommendation_savedResultId_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSuitableGamificationElements" ADD CONSTRAINT "SavedSuitableGamificationElements_suitableGamificationElem_fkey" FOREIGN KEY ("suitableGamificationElementsId") REFERENCES "suitable_gamification_elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSuitableGamificationElements" ADD CONSTRAINT "SavedSuitableGamificationElements_savedResultId_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUsabilityCharacteristics" ADD CONSTRAINT "SavedUsabilityCharacteristics_usabilityCharacteristicsId_fkey" FOREIGN KEY ("usabilityCharacteristicsId") REFERENCES "usability_characteristics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUsabilityCharacteristics" ADD CONSTRAINT "SavedUsabilityCharacteristics_savedResultId_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUsabilityRecommendationsForGamificationElementsIso" ADD CONSTRAINT "SavedUsabilityRecommendationsForGamificationElementsIso_us_fkey" FOREIGN KEY ("usabilityRecommendationsForGamificationElementsIsoId") REFERENCES "usability_recommendations_for_gamification_elements_iso_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUsabilityRecommendationsForGamificationElementsIso" ADD CONSTRAINT "SavedUsabilityRecommendationsForGamificationElementsIso_sa_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedNotSuitableGamificationElements" ADD CONSTRAINT "SavedNotSuitableGamificationElements_notSuitableGamificati_fkey" FOREIGN KEY ("notSuitableGamificationElementsId") REFERENCES "not_suitable_gamification_elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedNotSuitableGamificationElements" ADD CONSTRAINT "SavedNotSuitableGamificationElements_savedResultId_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUsabilityRecommendationsForGamificationElementsWcag22" ADD CONSTRAINT "FK_UsabilityRecForGamificationWcag22" FOREIGN KEY ("usabilityRecommendationsForGamificationElementsWcag22Id") REFERENCES "usability_recommendations_for_gamification_elements_wcag_2_2_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUsabilityRecommendationsForGamificationElementsWcag22" ADD CONSTRAINT "SavedUsabilityRecommendationsForGamificationElementsWcag22_fkey" FOREIGN KEY ("savedResultId") REFERENCES "SavedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
