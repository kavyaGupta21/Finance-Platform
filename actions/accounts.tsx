"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Account, AccountType } from "@prisma/client";
type SerializedAccount = Omit<Account, "balance"> & {
  balance: number;
  amount?: number | string;
};

type SerializedAccountWithCount = SerializedAccount & {
  _count: {
    transactions: number;
  };
};

const serializeTransaction = (obj: Account): SerializedAccount => {
  const serialized: SerializedAccount = {
    ...obj,
    balance: 0,
  } as SerializedAccount;

  // Prisma stores Decimal values; convert to number for the client
  const balance = (obj as any).balance;
  if (balance && typeof balance.toNumber === "function") {
    serialized.balance = balance.toNumber();
  } else {
    serialized.balance = (obj as any).balance ?? 0;
  }

  const amount = (obj as any).amount;
  if (amount && typeof amount.toNumber === "function") {
    serialized.amount = amount.toNumber();
  } else if (amount !== undefined) {
    serialized.amount = amount;
  }
  return serialized;
};

export async function updateDefaultAccount(accountId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: {
        isDefault: true,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, account: serializeTransaction(account) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAccountWithTransactions(
  accountId: string,
): Promise<SerializedAccountWithCount & { transactions: any[] } | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorzed");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  //findunique only accept foe;d that are unique in prisma
  const account = await db.account.findUnique({
    where: { id: accountId, userId: user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });
  if (!account) return null;

  return {
    ...serializeTransaction(account),
    _count: account._count,

    transactions: account.transactions.map((transaction) => ({
      ...transaction,

      amount:
        typeof (transaction.amount as any).toNumber === "function"
          ? (transaction.amount as any).toNumber()
          : transaction.amount,

      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      date: transaction.date.toISOString(),
    })),
  };
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });
    const accountBalanceChanges = transactions.reduce(
      (acc: Record<string, number>, transaction) => {
        const amount = Number(transaction.amount);
        const change = transaction.type === "EXPENSE" ? -amount : amount;
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
        return acc;
      },
      {},
    );

    //delete transactions
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges,
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });
    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
