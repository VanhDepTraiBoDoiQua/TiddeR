"use client"

import {ChangeEvent, FC, useRef} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MessageCreationRequest, messageValidator} from "@/lib/validators/message";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "@/hooks/use-toast";
import {LucideImagePlus} from "lucide-react";
import MessageInput from "@/components/message/conversation/MessageInput";
import {Button} from "@/components/ui/Button";
import {uploadFiles} from "@/lib/uploadthing";

interface MessageFormProps {
    conversationId: string;
    userId: string;
}

const MessageForm: FC<MessageFormProps> = ({conversationId, userId}) => {

    const fileRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const {mutate: createMessage, isLoading} = useMutation({
        mutationFn: async ({conversationId, messageImage, messageBody, userId}: MessageCreationRequest) => {

            const payload = {
                userId: userId,
                conversationId: conversationId,
                messageBody: messageBody,
                messageImage: messageImage,
            };

            const {data} = await axios.post('/api/socket/sendMessage', payload);
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
            queryClient.invalidateQueries(["messages"]);
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

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const res = await uploadByFile(file);
            setValue("messageImage", res.file.url);
        }
        return;
    }

    async function uploadByFile(file: File) {
        const [res] = await uploadFiles({
            endpoint: "imageUploader",
            files: [file]
        });

        return {
            success: 1,
            file: {
                url: res.fileUrl
            }
        };
    }

    return (
        <div className="py-4 px-4 border-t
            flex items-center gap-2
            lg:gap-4 w-full"
        >
            <Button
                variant="ghost"
                onClick={() =>
                    fileRef.current?.click()}
            >
                <LucideImagePlus size={30}/>
            </Button>
            <input
                type="file"
                className="hidden"
                id="chooseImage"
                ref={fileRef}
                onChange={ async (event) => {
                    await handleImageUpload(event);
                    await handleSubmit(onSubmit)();
                }}
            />
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