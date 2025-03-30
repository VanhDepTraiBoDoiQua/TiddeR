import {Icons} from '@/components/Icons';
import Link from "next/link";
import UserAuthForm from "@/components/auth/UserAuthForm";

const SignIn = () => {
    return (
        <div className="container mx-auto flex
            w-full flex-col justify-center
            space-y-6 sm:w-[400px]"
        >
            <div className="flex flex-col text-center
                space-y-2"
            >
                <Icons.logo className="mx-auto h-10 w-10"/>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm max-w-sx mx-auto">
                    By continuing, you are setting up a TiddeR account
                    and agree to our User Agreement and Privacy Policy
                </p>

                <UserAuthForm/>

                <p className="px-8 text-center text-sm
                    text-zinc-700">
                    New to TiddeR?{' '}
                    <Link href="/sign-up" className="hover:text-zinc-800
                        text-sm underline underline-offset-4"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;