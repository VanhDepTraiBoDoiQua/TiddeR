import {FC} from 'react';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/Button";
import {cn} from "@/lib/utils";
import SignIn from "@/components/sign-in/SignIn";

const SignInPage: FC = () => {
    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto
                flex flex-col items-center
                justify-center gap-20"
            >
                <Link href="/" className={cn(
                    buttonVariants({variant: "ghost"}),
                    "self-start -mt-20"
                )}>
                    Home
                </Link>

                {/*SIGN IN COMPONENT*/}
                <SignIn/>

            </div>
        </div>
    );
};

export default SignInPage;