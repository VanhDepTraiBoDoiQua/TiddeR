"use client"

import {FC} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MessageCreationRequest, messageValidator} from "@/lib/validators/message";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "@/hooks/use-toast";
import {LucideImagePlus} from "lucide-react";
import MessageInput from "@/components/message/conversation/MessageInput";
import {Button} from "@/components/ui/Button";

interface MessageFormProps {
    conversationId: string;
    userId: string;
}

const MessageForm: FC<MessageFormProps> = ({conversationId, userId}) => {

    const {mutate: createMessage, isLoading} = useMutation({
        mutationFn: async ({conversationId, messageImage, messageBody, userId}: MessageCreationRequest) => {

            const payload = {
                userId: userId,
                conversationId: conversationId,
                messageBody: messageBody,
                messageImage: messageImage,
            };

            const {data} = await axios.post('/api/message/send', payload);
            return data;
        },

        onError: () => {
            return toast({
                title: "Something went wrong",
                description: "Please try again later.",
                variant: "destructive"
            });
        },

        onSuccess: () => {
            setValue("messageBody", "", {shouldValidate: true});
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors}
    } = useForm<MessageCreationRequest>({
        resolver: zodResolver(messageValidator),
        defaultValues: {
            userId: userId,
            conversationId: conversationId,
            messageBody: "",
            messageImage: "",
        }
    });

    async function onSubmit() {
        const payload: MessageCreationRequest = {
            userId: userId,
            conversationId: conversationId,
            messageBody: getValues("messageBody"),
            messageImage: getValues("messageImage"),
        };

        createMessage(payload);
    }

    return (
        <div className="py-4 px-4 border-t
            flex items-center gap-2
            lg:gap-4 w-full"
        >

            {/*TODO: UPLOAD IMAGE TO UPLOADTHING*/}
            <LucideImagePlus size={30}/>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2
                    lg:gap-4 w-full"
            >
                <MessageInput
                    id="messageBody"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Aa"
                    setValue={setValue}
                />
                <Button
                    type="submit"
                    disabled={getValues("messageBody")?.length === 0}
                    isLoading={isLoading}
                >
                    Send
                </Button>
            </form>
        </div>
    );
};

export default MessageForm;