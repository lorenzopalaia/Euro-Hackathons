import Link from "next/link";

import Image from "next/image";

import ThemeToggle from "@/components/ThemeToggle";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { createClient } from "@/utils/supabase/server";
import { KeyRound } from "lucide-react";

function getInitials(name: string) {
  const names = name.split(" ");
  return names
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default async function Header() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={48} height={48} />
          </Link>
          <Link href="/">Home</Link>
        </div>
        <div className="flex items-center gap-4">
          {data.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={
                      data.user.user_metadata.avatar_url ||
                      "/default-avatar.png"
                    }
                  />
                  <AvatarFallback>
                    {getInitials(data.user.email || "")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/api/auth/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="text-sm font-semibold">
                Login
                <KeyRound size={16} />
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
