"use client"

import {FC, useState} from 'react';
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {CreateCommunityPayload} from "@/lib/validators/community";
import {toast} from "@/hooks/use-toast";
import {useCustomToast} from "@/hooks/use-custom-toast";

const CreateCommunityPage: FC = () => {

    const [input, setInput] = useState<string>("");

    const router = useRouter();

    const {loginToast} = useCustomToast();

    const {mutate: createCommunity, isLoading} = useMutation({
        mutationFn: async () => {
            const payload: CreateCommunityPayload = {
                name: input
            };

            const {data} = await axios.post("/api/community", payload);
            return data as string;
        },

        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Community already exists.",
                        description: "Please choose a different community name.",
                        variant: "destructive"
                    });
                }

                if (err.response?.status === 422) {
                    return toast({
                        title: "Invalid community name.",
                        description: "Community name can only contain letters, numbers, underscores, hyphens and must be between 3 and 21 characters.",
                        variant: "destructive"
                    });
                }

                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            toast({
                title: "There was an error.",
                description: "Could not create community.",
                variant: "destructive"
            });
        },

        onSuccess: (data) => {
            router.push(`/t/${data}`);
            router.refresh();
        }
    });

    return (
        <div className="container flex items-center
            h-full max-w-3xl mx-auto"
        >
            <div className="relative bg-white w-full
                h-fit p-4 rounded-lg
                space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">
                        Create a Community
                    </h1>
                </div>
                <hr className="bg-zinc-500 h-px"/>
                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p className="text-xs pb-2">
                        Community names including capitalization
                        cannot be changed.
                    </p>
                    <div className="relative">
                        <p className="absolute text-sm left-0
                            w-8 inset-y-0 grid
                            place-items-center text-zinc-400"
                        >
                            t/
                        </p>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="pl-6"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button
                        variant="subtle"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        isLoading={isLoading}
                        disabled={input.length === 0}
                        onClick={() => createCommunity()}
                    >
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateCommunityPage;