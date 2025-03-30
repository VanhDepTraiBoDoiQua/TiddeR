"use client"

import React, {FC, useState} from 'react';
import {Button} from "@/components/ui/Button";
import {cn} from "@/lib/utils";
import {signIn} from "next-auth/react";
import {Icons} from "@/components/Icons";
import {useToast} from "@/hooks/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {

}


const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {toast} = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn("google");
        } catch (error: any) {

            // TOAST NOTIFICATION
            toast({
                title: "There was a problem with Google",
                description: "There was an error while logging in with Google",
                variant: "destructive"
            });

            console.log(error);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "flex justify-center",
            className
        )} {...props}>
            <Button
                size="sm"
                className="w-full"
                onClick={loginWithGoogle}
                isLoading={isLoading}
            >
                {isLoading ? null : (
                    <Icons.google className="h-5 w-5 mr-2"/>
                )}
                Google
            </Button>
        </div>
    );
};

export default UserAuthForm;