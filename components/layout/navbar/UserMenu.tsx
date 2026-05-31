"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  user: {
    name: string;
    image: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-offset-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="size-10 cursor-pointer border">
            <AvatarImage src={user.image} />
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
