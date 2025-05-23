"use client"

import {FC} from 'react';
import {User} from "next-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropDownMenu";
import UserAvatar from "@/components/navbar/UserAvatar";
import Link from "next/link";
import {signOut} from "next-auth/react";

interface UserAccountProps {
    user: Pick<User, "name" | "image" | "email" | "id">;
}

const UserAccount: FC<UserAccountProps> = ({user}) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <UserAvatar
                    className="h-8 w-8"
                    user={{
                        name: user.name || null,
                        image: user.image || null,
                    }}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-white"
                align="end"
            >
                <div className="flex items-center justify-start
                    gap-2 p-2"
                >
                    <div className="flex flex-col space-y-1
                        leading-none"
                    >
                        {user.name && (
                            <p className="font-medium">{user.name}</p>
                        )}
                        {user.email && (
                            <p className="w-[200px] truncate text-sm
                                text-zinc-700"
                            >
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator/>

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/">Feed</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/t/create">Create Community</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/profile/${user.id}`}>Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault();
                        signOut({
                            callbackUrl: `${window.location.origin}/sign-in`
                        });
                    }}
                    className="cursor-pointer"
                >
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserAccount;