"use client";

import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/(main)/lib/schema";
import { z } from "zod";
import { Input } from "./ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { createAccount } from "@/actions/dashboard";
import { useRouter } from "next/navigation";

const CreateAccountDrawer = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: " ",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    data: newAccount,
    error,
    fn: createAccountFn,
    loading: createAccountLoading,
  } = useFetch(createAccount);

  useEffect(() => {
    if (newAccount?.success && !createAccountLoading) {
      toast.success("Account created successfully!");
      reset();
      setOpen(false);
      router.refresh();
    } else if (newAccount && !createAccountLoading) {
      toast.error(
        newAccount.error || "Failed to create account. Please try again.",
      );
    }
  }, [createAccountLoading, newAccount, reset, router]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to create account. Please try again.");
    }
  }, [error]);

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    await createAccountFn(data);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
          <DrawerDescription>
            Add a new bank account to track.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 space-y-2">
              <label htmlFor="name" className="text-sm font-bold">
                Name
              </label>
              <Input id="name" placeholder="" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <label htmlFor="type" className="text-sm font-bold">
                Type
              </label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as "CURRENT" | "SAVINGS")
                }
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type" className="w-45">
                  <SelectValue placeholder="select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">CURRENT</SelectItem>
                  <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-400">{errors.type.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <label htmlFor="balance" className="text-sm font-bold">
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder=" 0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-400">{errors.balance.message}</p>
              )}
            </div>
            <div
              className="flex flex-col gap-2 space-y-2 items-center justify-between border p-3 rounded-lg bg-gray-900 text-white
            "
            >
              <div>
                <label
                  htmlFor="isDefault"
                  className="text-sm font-bold cursor-pointer"
                >
                  Set as Default
                </label>
                <p>This account will be selected as default</p>
              </div>
              <Switch
                id="isDefault"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}
              ></Switch>
            </div>
            <div className="flex items-center justify-end gap-2">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1 ">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1 "
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
