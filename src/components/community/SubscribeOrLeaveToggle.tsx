"use client"

import {FC, startTransition} from 'react';
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import {SubscriptionPayload} from "@/lib/validators/community";
import axios, {AxiosError} from "axios";
import {useCustomToast} from "@/hooks/use-custom-toast";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

interface SubscribeOrLeaveToggleProps {
    communityId: string;
    communityName: string;
    isSubscribed: boolean;
}

const SubscribeOrLeaveToggle: FC<SubscribeOrLeaveToggleProps> = ({communityId, communityName, isSubscribed}) => {

    const {loginToast} = useCustomToast();

    const router = useRouter();

    const {mutate: subscribe, isLoading: subscribeLoading} = useMutation({
        mutationFn: async () => {
            const payload: SubscriptionPayload = {
                communityId: communityId,
            };

            const {data} = await axios.post("/api/community/subscribe", payload);
            return data as string;
        },

        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: "There was a problem",
                description: "Something went wrong, please try again.",
                variant: "destructive"
            });
        },

        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            })

            return toast({
                title: "Subscribed",
                description: `You are now subscribed to t/${communityName}`,
                variant: "default"
            });
        }
    });

    const {mutate: unsubscribe, isLoading: unsubscribeLoading} = useMutation({
        mutationFn: async () => {
            const payload: SubscriptionPayload = {
                communityId: communityId,
            };

            const {data} = await axios.post("/api/community/unsubscribe", payload);
            return data as string;
        },

        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: "There was a problem",
                description: "Something went wrong, please try again.",
                variant: "destructive"
            });
        },

        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            })

            return toast({
                title: "Unsubscribed",
                description: `You are now unsubscribed from t/${communityName}`,
                variant: "default"
            });
        }
    });

    return (
        isSubscribed ? (
            <Button
                className="w-full mt-1 mb-4"
                isLoading={unsubscribeLoading}
                onClick={() => unsubscribe()}
            >
                Leave Community
            </Button>
        ) : (
            <Button
                className="w-full mt-1 mb-4"
                isLoading={subscribeLoading}
                onClick={() => subscribe()}
            >
                Join to post
            </Button>
        )
    );
};

export default SubscribeOrLeaveToggle;