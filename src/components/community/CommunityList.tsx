import {Session} from "next-auth";
import {db} from "@/lib/db";
import {ExtendedSubscription} from "@/types/db";
import {ScrollArea} from "@/components/ui/ScroolArear";
import {Separator} from "@/components/ui/Separator";

interface CommunityListProps {
    session: Session;
}

const CommunityList = async ({session}: CommunityListProps) => {

    if (!session) {
        return null;
    }

    const communities = await db.subscription.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            community: {
                include: {
                    _count: {
                        select: {
                            subscribers: true
                        }
                    },
                }
            },
        }
    }) as ExtendedSubscription[];

    return (
        <>
            <ScrollArea className="mt-1 h-50 w-full py-2 rounded-md">
                <div className="p-4">
                    {communities.map((community) => (
                        <>
                            <div key={community.community.id} className="text-sm pl-2 hover:bg-gray-100">
                                <a href={`/t/${community.community.name}`}>
                                    <div className="font-semibold">t/{community.community.name}</div>
                                    <div
                                        className="text-zinc-500">{community.community._count.subscribers.toLocaleString()} members
                                    </div>
                                </a>
                            </div>
                            <Separator className="my-2"/>
                        </>
                    ))}
                </div>
            </ScrollArea>
        </>
    );
};

export default CommunityList;