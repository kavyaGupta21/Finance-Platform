import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import React from "react";
import { getTransaction } from "@/actions/transaction";
import AddTransactionForm from "../components/transaction-form";
const AddTransactionPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) => {
  const accounts = await getUserAccounts();

  const params = await searchParams;
  const editId = params?.edit;

  let initialData = null;

  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl gradient-title mb-8">
        {editId ? "Edit Transaction" : "Add Transactions"}
      </h1>

      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
};

export default AddTransactionPage;
