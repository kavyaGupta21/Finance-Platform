import React from "react";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  return (
    <div className="fixed top-0 w-full z-50 bg-[#050816] shadow-md  border-b  backdrop-blur-md ">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Finance logo"
            height={60}
            width={200}
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4 ">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden-md:inline"> Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden-md:inline"> Add Transaction</span>
              </Button>
            </Link>
          </Show>

          <Show when="signed-out">
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="bg-purple-600
           hover:bg-purple-500
text-white
rounded-full
shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              >
                Login
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full border-2 border-gray-300",
                },
              }}
            />
          </Show>
        </div>
      </nav>
    </div>
  );
};

export default Header;
