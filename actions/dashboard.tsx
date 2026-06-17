// "use server";
// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// import { revalidatePath } from "next/cache";
// import type { Account, AccountType, Transaction } from "@prisma/client";
// import { checkUser } from "@/lib/checkUser";

// type SerializedAccount = Omit<Account, "balance"> & {
//   balance: number;
//   amount?: number;
// };
// type SerializedTransaction = Omit<Transaction, "amount"> & {
//   amount: number;
// };

// const serializeTransaction = (obj: Transaction): SerializedTransaction => ({
//   ...obj,
//   amount: toNumericValue(obj.amount as DecimalLike),
// });

// type DecimalLike = { toNumber?: () => number } | number | null | undefined;

// const toNumericValue = (value: DecimalLike, fallback = 0) => {
//   if (
//     value &&
//     typeof value === "object" &&
//     "toNumber" in value &&
//     typeof value.toNumber === "function"
//   ) {
//     return value.toNumber();
//   }

//   return typeof value === "number" ? value : fallback;
// };

// const serializeAccount = (obj: Account): SerializedAccount => ({
//   ...obj,
//   balance: toNumericValue(obj.balance as DecimalLike),
// });

// export async function createAccount(data: {
//   name: string;
//   type: AccountType;
//   balance: string;
//   isDefault?: boolean;
// }) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");
//     const user = await checkUser();
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const balanceFloat = parseFloat(data.balance);
//     if (isNaN(balanceFloat)) {
//       throw new Error("Invalid balance amount");
//     }
//     const existingAccounts = await db.account.findMany({
//       where: { userId: user.id },
//     });

//     const shouldBeDefault =
//       existingAccounts.length === 0 ? true : data.isDefault;
//     if (shouldBeDefault) {
//       await db.account.updateMany({
//         where: { userId: user.id, isDefault: true },
//         data: { isDefault: false },
//       });
//     }

//     const account = await db.account.create({
//       data: {
//         ...data,
//         balance: balanceFloat,
//         userId: user.id,
//         isDefault: shouldBeDefault,
//       },
//     });
//     const serializedAccount = serializeAccount(account);
//     revalidatePath("/dashboard");
//     return { success: true, account: serializedAccount };
//   } catch (error: unknown) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//     };
//   }
// }

// export async function getUserAccounts(): Promise<SerializedAccount[]> {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");
//     const user = await checkUser();
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const accounts = await db.account.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         _count: {
//           select: {
//             transactions: true,
//           },
//         },
//       },
//     });
//     const serializedAccount = accounts.map((account) =>
//       serializeAccount(account),
//     );
//     return serializedAccount;
//   } catch (error) {
//     console.error("Error fetching accounts:", error);
//     return [];
//   }
// }
// export async function getDashboardData() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // Get all user transactions
//   const transactions = await db.transaction.findMany({
//     where: { userId: user.id },
//     orderBy: { date: "desc" },
//   });

//   return transactions.map(serializeTransaction);
// }
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Account, AccountType, Transaction } from "@prisma/client";
import { checkUser } from "@/lib/checkUser";

type SerializedAccount = Omit<Account, "balance"> & {
  balance: number;
};

type SerializedTransaction = Omit<Transaction, "amount"> & {
  amount: number;
};

type DecimalLike = { toNumber?: () => number } | number | null | undefined;

const toNumericValue = (value: DecimalLike, fallback = 0): number => {
  if (
    value &&
    typeof value === "object" &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }

  return typeof value === "number" ? value : fallback;
};

const serializeAccount = (obj: Account): SerializedAccount => ({
  ...obj,
  balance: toNumericValue(obj.balance as DecimalLike),
});

const serializeTransaction = (obj: Transaction): SerializedTransaction => ({
  ...obj,
  amount: toNumericValue(obj.amount as DecimalLike),
});

export async function createAccount(data: {
  name: string;
  type: AccountType;
  balance: string;
  isDefault?: boolean;
}) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();

    if (!user) {
      throw new Error("User not found");
    }

    const balanceFloat = parseFloat(data.balance);

    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeAccount(account);

    revalidatePath("/dashboard");

    return {
      success: true,
      account: serializedAccount,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getUserAccounts(): Promise<SerializedAccount[]> {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await checkUser();

    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return accounts.map(serializeAccount);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export async function getDashboardData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map(serializeTransaction);
}
