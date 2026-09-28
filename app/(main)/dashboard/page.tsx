export const dynamic = "force-dynamic";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/account-card";
import BudgetProgress from "./_components/budget-progress";
import { getCurrentBudget } from "@/actions/budget";
import { DashboardOverview } from "./_components/transaction-overview";

async function DashboardPage() {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }
  const transactions = await getDashboardData();
  return (
    <div className="space-y-5 px-5 bg-black">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget ?? null}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />
      </Suspense>
      {/* Recent Transactions */}

      {/* Account Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <CreateAccountDrawer>
          <button type="button" className="w-full">
            <Card className="flex flex-col items-center justify-center border-dashed border-2 border-slate-400 h-40 cursor-pointer  shadow-2xl hover:shadow-indigo-500 transition-shadow">
              <CardContent className="flex flex-col items-center justify-center gap-2">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-bold ">Add new Account</p>
              </CardContent>
            </Card>
          </button>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
}

export default DashboardPage;
