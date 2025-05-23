import Link from 'next/link';
import UserAvatar from "@/components/navbar/UserAvatar";
import {db} from "@/lib/db";

interface ProfilePageProps {
    params: {
        userId: string;
    }
}

const ProfilePage = async ({params}: ProfilePageProps) => {

    const user = await db.user.findFirst({
        where: {
            id: params.userId
        }
    });

    return (
        <>
            <div className="flex flex-row mb-5 gap-3 items-center pl-10">
                <div>
                    <UserAvatar user={{
                        name: user?.name,
                        image: user?.image,
                    }}/>
                </div>
                <div className="font-bold text-lg">
                    {user?.username}
                </div>
            </div>
            <div className="border border-red-200">
                <div className="flex justify-between shadow-md h-10">
                    <Link
                        href={`/profile/${params.userId}`}
                        className="border border-blue-200 w-1/3 flex justify-center hover:bg-zinc-200 h-full items-center hover:underline">
                        Post
                    </Link>
                    <Link
                        href={`/profile/comments/${params.userId}`}
                        className="border border-green-200 w-1/3 flex justify-center hover:bg-zinc-200 h-full items-center hover:underline">
                        Comment
                    </Link>
                    <Link
                        href={`/profile/about/
                        ${params.userId}`}
                        className="border border-amber-200 w-1/3 flex justify-center hover:bg-zinc-200 h-full items-center hover:underline">
                        About
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;