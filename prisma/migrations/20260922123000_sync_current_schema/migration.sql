-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- Rename existing tables so their rows and foreign keys are preserved.
ALTER TABLE "Account" RENAME TO "accounts";
ALTER TABLE "Budget" RENAME TO "budgets";
ALTER TABLE "Transaction" RENAME TO "transactions";

-- Backfill fields added to the transaction model.
ALTER TABLE "transactions" ADD COLUMN "date" TIMESTAMP(3);
UPDATE "transactions" SET "date" = "createdAt";
ALTER TABLE "transactions" ALTER COLUMN "date" SET NOT NULL;

ALTER TABLE "transactions" ADD COLUMN "type" "TransactionType";
UPDATE "transactions"
SET "type" = CASE
    WHEN LOWER("category") IN ('salary', 'freelance', 'investments', 'business', 'rental', 'other-income')
        THEN 'INCOME'::"TransactionType"
    ELSE 'EXPENSE'::"TransactionType"
END;
ALTER TABLE "transactions" ALTER COLUMN "type" SET NOT NULL;

ALTER TABLE "transactions" ADD COLUMN "lastProcessed" TIMESTAMP(3);
ALTER TABLE "transactions" ADD COLUMN "nextRecurringDate" TIMESTAMP(3);
ALTER TABLE "budgets" ADD COLUMN "lastAlertSent" TIMESTAMP(3);

