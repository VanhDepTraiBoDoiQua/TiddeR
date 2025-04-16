"use client"

import {FC} from 'react';
import {User} from "@prisma/client";
import UserBox from "@/components/message/userlist/UserBox";
import {ScrollArea} from "@/components/ui/ScroolArear";

interface UserListProps {
    users: User[]
}

const UserList: FC<UserListProps> = ({users}) => {
    return (
        <aside className="fixed inset-y-0 pb-20
            lg:pb-0 lg:w-80 lg:block
            lg:left-20 overflow-y-auto block w-full
            left-0 mt-20 mb-4 bg-zinc-200 rounded-2xl"
        >
            <div className="px-5">
                <div className="flex-col">
                    <div className="text-2xl font-bold text-zinc-800
                        py-4"
                    >
                        Chats
                    </div>
                </div>
                <ScrollArea className="h-[512px] w-full rounded-md">
                        {users.map((user) => (
                            <UserBox
                                key={user.id}
                                user={user}
                            />
                        ))}
                </ScrollArea>

            </div>
        </aside>
    );
};

export default UserList;