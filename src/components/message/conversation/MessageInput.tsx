"use client"

import {FC} from 'react';
import {FieldErrors, UseFormRegister, UseFormSetValue} from "react-hook-form";
import {MessageCreationRequest} from "@/lib/validators/message";

interface MessageInputProps {
    id: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<MessageCreationRequest>;
    errors: FieldErrors<MessageCreationRequest>;
    setValue: UseFormSetValue<MessageCreationRequest>;
}

const MessageInput: FC<MessageInputProps> = ({required, id, errors, type, placeholder, register, setValue}) => {
    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                autoComplete={id}
                {...register("messageBody", {required: true})}
                placeholder={placeholder}
                onChange={(event) => {
                    setValue("messageBody", event.target.value, {shouldValidate: true});
                }}
                className="text-black font-light py-2
                    px-4 bg-neutral-100 w-full
                    rounded-full focus:outline-none"
            />
        </div>
    );
};

export default MessageInput;