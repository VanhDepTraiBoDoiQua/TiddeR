import React from "react";
import Sidebar from "@/components/message/sidebar/Sidebar";
import {db} from "@/lib/db";
import {getAuthSession} from "@/lib/auth";
import UserList from "@/components/message/userlist/UserList";

export const metadata = {
  title: 'Message',
  description: 'Message',
}

export default async function MessageLayout({
  children,
}: {
  children: React.ReactNode
}) {

    // TODO: FOR TESTING ONLY, CHANGE THIS LATER
    const session = await getAuthSession();

    const users = await db.user.findMany({
        where: {
            NOT: {
                id: session?.user.id
            }
        }
    });

    return (
        // <Sidebar>
            <div className="h-full">
                <UserList users={users}/>
                {children}
            </div>
        // </Sidebar>
  );
}
