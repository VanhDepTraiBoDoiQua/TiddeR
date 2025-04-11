"use client"

import {FC} from 'react';
import {useForm} from "react-hook-form";
import {UsernameRequest, usernameValidator} from "@/lib/validators/username";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@prisma/client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/Card";
import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

interface UserNameFormProps {
    user: Pick<User, "username" | "id">;
}

const UserNameForm: FC<UserNameFormProps> = ({user}) => {

    const router = useRouter();

    const {mutate: changeUsername, isLoading} = useMutation({
        mutationFn: async ({username}: UsernameRequest) => {
            const payload: UsernameRequest = {username};

            const {data} = await axios.patch("/api/user/username", payload);
            return data;
        },

        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Username already taken.",
                        description: "Please choose a different username.",
                        variant: "destructive"
                    });
                }
            }

            return toast({
                title: "There was an error.",
                description: "Could not change username, please try again later.",
                variant: "destructive"
            });
        },

        onSuccess: () => {
            toast({
                description: "Your username has been updated.",
            });
            router.refresh();
        }
    })

    const {handleSubmit, register, formState: {errors}} = useForm<UsernameRequest>({
        resolver: zodResolver(usernameValidator),
        defaultValues: {
            username: user.username || "",
        }
    });

    return (
        <form
            onSubmit={handleSubmit(
                (e) => changeUsername(e)
            )}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription>
                        Change your username hear.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='relative grid gap-1'>
                        <div className='absolute -top-0.5 left-0
                            w-8 h-10 grid
                            place-items-center'
                        >
                            <span className='text-sm text-zinc-400'>u/</span>
                        </div>
                        <Label className='sr-only' htmlFor='name'>
                            Name
                        </Label>
                        <Input
                            id='name'
                            className='w-[400px] pl-6'
                            size={32}
                            {...register('username')}
                        />
                        {errors?.username && (
                            <p className='px-1 text-xs text-red-600'>
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button isLoading={isLoading}>Change name</Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default UserNameForm;