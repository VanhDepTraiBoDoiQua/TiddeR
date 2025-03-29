import Link from "next/link";
import {Icons} from "@/components/Icons";
import {buttonVariants} from "@/components/ui/Button";
import {getAuthSession} from "@/lib/auth";

const Navbar = async () => {

    const session = await getAuthSession();


    return (
        <div className="fixed top-0 inset-x-0
            h-fit bg-zinc-100 border-b
            border-zinc-300 z-[10] py-2"
        >
            <div className="container max-w-7xl h-full
                mx-auto flex items-center
                justify-between gap-2"
            >

                {/*LOGO*/}
                <Link href="/" className="flex gap-2 items-center">
                    <Icons.logo className="h-10 w-10 sm:h-8
                        sm:w-8"
                    />
                    <p className="hidden text-zinc-700 text-sm
                        font-medium md:block"
                    >
                        TiddeR
                    </p>
                </Link>

                {/*TODO: CREATE SEARCH BAR*/}
                {/*SEARCH BAR*/}

                {session && (
                    <div>Hello, you are logged in!</div>
                )}
                <Link href="/sign-in" className={buttonVariants()}>
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default Navbar;