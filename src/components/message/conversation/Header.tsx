"use client"

import {FC} from 'react';
import {User} from "@prisma/client";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import UserAvatar from "@/components/navbar/UserAvatar";

interface HeaderProps {
    otherUser: User | undefined;
}

const Header: FC<HeaderProps> = ({otherUser}) => {
    return (
        <div className="w-full flex border-b-1
            sm:px-4 py-2 px-6 bg-gray-200 rounded-t-2xl
            justify-between items-center shadow-sm"
        >
            <div className="flex gap-3 items-center">
                <Link
                    href="/message"
                    className="lg:hidden block"
                >
                    <Icons.back className="w-8"/>
                </Link>
                <UserAvatar user={{
                    name: otherUser?.name,
                    image: otherUser?.image,
                }}
                />
                <div className="flex flex-col">
                    <div>
                        {otherUser?.username}
                    </div>
                    <div className="text-sm font-light text-zinc-500">
                        Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;