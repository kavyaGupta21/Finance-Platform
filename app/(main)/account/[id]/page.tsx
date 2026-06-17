import React, { Suspense } from "react";
import {
  getAccountWithTransactions,
  bulkDeleteTransactions,
} from "@/actions/accounts";
import { notFound } from "next/navigation";
import TransactionTable from "../_components/transaction-table";
import { BarLoader } from "react-spinners";
import AccountChart from "../_components/account-chart";

const AccountPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const accountData = await getAccountWithTransactions(id);
  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  return (
    <div className="space-y-8 px-5 ">
      <div>
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold  gradient-tile capitalize">
            {account.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}
            Account
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl sm:text-2xl font-bold">
            ${account.balance.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions}Transactions
          </p>
        </div>

        {/* Chart section here */}
        <Suspense
          fallback={<BarLoader className="mt-4" width="100%" color="#9333ea" />}
        >
          <AccountChart transactions={transactions} />
        </Suspense>

        {/* Transactions list here */}
        <Suspense
          fallback={<BarLoader className="mt-4" width="100%" color="#9333ea" />}
        >
          <TransactionTable
            transactions={transactions}
            deleteFn={bulkDeleteTransactions}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default AccountPage;
