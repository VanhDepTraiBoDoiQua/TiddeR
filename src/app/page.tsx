import {HomeIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/Button";
import {getAuthSession} from "@/lib/auth";
import GeneralFeed from "@/components/home-feed/GeneralFeed";
import CustomFeed from "@/components/home-feed/CustomFeed";
import CommunityList from "@/components/community/CommunityList";

export default async function Home() {

    const session = await getAuthSession();

    return (
        <>
            <h1 className="font-bold text-3xl md:text-4xl"
            >
                Your feed
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3
                gap-y-4 md:gap-x-4 py-6"
            >

                {/*FEED*/}
                {/* @ts-expect-error server component */}
                {session ? <CustomFeed/> : <GeneralFeed/>}

                {/*COMMUNITY INFO*/}
                <div className="overflow-hidden h-fit rounded-lg
                    border border-gray-200 order-first
                    md:order-last xs:order-last lg:sticky top-20"
                >
                    <div className="bg-emerald-100 px-6 py-4">
                        <p className="font-semibold py-3 items-center
                            flex gap-1.5"
                        >
                            <HomeIcon className="w-4 h-4"/>
                            Home
                        </p>
                    </div>
                    <div className="-my-3 divide-y divide-gray-100
                        px-6 py-4 text-sm
                        leading-6"
                    >
                        <div className="flex flex-col justify-between gap-x-4
                            py-3"
                        >
                            <p className="text-zinc-500">
                                Your personal TiddeR homepage. Come here to check
                                in with your favourite Communities.
                            </p>

                            {/* @ts-expect-error server component*/}
                            <CommunityList session={session}/>
                        </div>
                        <Link
                            href="/t/create"
                            className={buttonVariants({
                                className: "w-full mt-4 mb-6"
                            })}
                        >
                            Create Community
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
