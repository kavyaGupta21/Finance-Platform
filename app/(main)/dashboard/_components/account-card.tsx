"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/accounts";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

const AccountCard = ({ account }: { account: any }) => {
  const { name, type, balance, id, isDefault } = account;
  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  //this function is responsible for handling the change of the default account when the switch is toggled.
  //  It prevents the default behavior of the event, calls the updateDefaultFn with the account id to update the default account,
  //  and then revalidates the path to reflect the changes on the dashboard.
  const handleDefaultChange = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to update default account");
    }
  }, [error]);
  return (
    <Link href={`/account/${id}`} className="block">
      <Card className="gradient-card h-full shadow-md hover:shadow-fuchsia-400 transition-shadow group relative cursor-pointer">
        <div
          className="absolute top-5 right-5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </div>

        <CardHeader className="pb-5 text-purple-200">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold text-[#F8F5FF]">
            ${parseFloat(balance).toFixed(2)}
          </div>

          <p className="text-xs text-[#C8B6FF]">
            {type.charAt(0) + type.slice(1).toLowerCase()}Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm">
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            Income
          </div>

          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-red-500 rotate-180" />
            Expense
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AccountCard;
