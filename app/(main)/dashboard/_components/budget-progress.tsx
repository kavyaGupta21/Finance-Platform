// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Progress } from "@/components/ui/progress";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Check, Pencil, X } from "lucide-react";
// import { toast } from "sonner";
// import useFetch from "@/hooks/use-fetch";
// import { updateBudget } from "@/actions/budget";

// type BudgetProgressProps = {
//   initialBudget: { amount: number } | null;
//   currentExpenses: number;
// };

// const BudgetProgress: React.FC<BudgetProgressProps> = ({
//   initialBudget,
//   currentExpenses,
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [newBudget, setNewBudget] = useState(
//     initialBudget?.amount?.toString() || "",
//   );
//   const [budget, setBudget] = useState(initialBudget);
//   const router = useRouter();

//   const percentUsed = budget
//     ? Math.min((currentExpenses / budget.amount) * 100, 100)
//     : 0;

//   const {
//     loading: isLoading,
//     fn: updateBudgetFn,
//     error,
//   } = useFetch(updateBudget);
//   const handleUpdateBudget = async () => {
//     const amount = parseFloat(newBudget);
//     if (isNaN(amount) || amount <= 0) {
//       toast.error("please enter a valid amount");
//       return;
//     }

//     const updatedBudget = await updateBudgetFn(amount);
//     if (updatedBudget?.success && updatedBudget.data) {
//       setBudget(updatedBudget.data);
//       setNewBudget(updatedBudget.data.amount.toString());
//       setIsEditing(false);
//       toast.success("Budget updated successfully");
//       router.refresh();
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       toast.error((error as Error)?.message || "failed to update budget");
//     }
//   }, [error]);
//   const handleCancel = () => {
//     setNewBudget(budget?.amount?.toString() || "");
//     setIsEditing(false);
//   };

//   return (
//     <Card className="space-y-8">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <div className="flex-1">
//           <CardTitle>Monthly Budget (Default Account)</CardTitle>
//           <div className="flex items-center gap-2 mt-1">
//             {isEditing ? (
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="number"
//                   value={newBudget}
//                   onChange={(e) => setNewBudget(e.target.value)}
//                   className="w-32"
//                   placeholder="Enter amount"
//                   autoFocus
//                   disabled={isLoading}
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleUpdateBudget}
//                   disabled={isLoading}
//                 >
//                   <Check className="h-4 w-4 text-green-500" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleCancel}
//                   disabled={isLoading}
//                 >
//                   <X className="h-4 w-4 text-red-500" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 {" "}
//                 <CardDescription>
//                   {budget
//                     ? `$${currentExpenses.toFixed(2)} of $${budget.amount.toFixed(2)} spent`
//                     : "No budget set"}
//                 </CardDescription>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsEditing(true)}
//                   className="h-6 w-6"
//                 >
//                   <Pencil className="h-4 w-4" />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {budget && (
//           <div className="space-y-2">
//             <Progress
//               value={percentUsed}
//               indicatorClassName={
//                 percentUsed >= 90
//                   ? "bg-red-500"
//                   : percentUsed >= 75
//                     ? "bg-yellow-500"
//                     : "bg-green-500"
//               }
//             />
//             <p className="text-sm text-muted-foreground text-right">
//               {percentUsed.toFixed(1)}% used
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default BudgetProgress;
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/actions/budget";

type BudgetProgressProps = {
  initialBudget: { amount: number } | null;
  currentExpenses: number;
};

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  initialBudget,
  currentExpenses,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || "",
  );
  const [budget, setBudget] = useState(initialBudget);

  const router = useRouter();

  const percentUsed =
    budget && budget.amount > 0
      ? Math.min((currentExpenses / budget.amount) * 100, 100)
      : 0;

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    error,
  } = useFetch(updateBudget);

  useEffect(() => {
    setBudget(initialBudget);
    setNewBudget(initialBudget?.amount?.toString() || "");
  }, [initialBudget]);

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || "Failed to update budget");
    }
  }, [error]);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const updatedBudget = await updateBudgetFn(amount);

    if (updatedBudget?.success && updatedBudget.data) {
      setBudget(updatedBudget.data);
      setNewBudget(updatedBudget.data.amount.toString());
      setIsEditing(false);

      toast.success("Budget updated successfully");
      router.refresh();
    }
  };

  const handleCancel = () => {
    setNewBudget(budget?.amount?.toString() || "");
    setIsEditing(false);
  };

  return (
    <Card className="space-y-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle>Monthly Budget (Default Account)</CardTitle>

          <div className="mt-1 flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {budget
                    ? `$${currentExpenses.toFixed(2)} of $${budget.amount.toFixed(
                        2,
                      )} spent`
                    : "No budget set"}
                </CardDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <CardAction />
      </CardHeader>

      <CardContent>
        {budget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              indicatorClassName={
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }
            />

            <p className="text-right text-sm text-muted-foreground">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
