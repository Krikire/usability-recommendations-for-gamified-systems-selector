-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('NON_FIT', 'PARTIAL_FIT', 'FIT');

-- AlterTable
ALTER TABLE "SavedGeneralisedRecommendation" ADD COLUMN     "selectionStatus" "RecommendationStatus";

-- AlterTable
ALTER TABLE "SavedNotSuitableGamificationElements" ADD COLUMN     "selected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SavedSuitableGamificationElements" ADD COLUMN     "selected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SavedUsabilityRecommendationsForGamificationElementsIso" ADD COLUMN     "selectionStatus" "RecommendationStatus";

-- AlterTable
ALTER TABLE "SavedUsabilityRecommendationsForGamificationElementsWcag22" ADD COLUMN     "selectionStatus" "RecommendationStatus";
