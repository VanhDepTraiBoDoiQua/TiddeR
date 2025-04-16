import {FC} from 'react';

interface EmptyStateProps {

}

const EmptyState: FC<EmptyStateProps> = () => {
    return (
        <div className="ml-1 -mr-16 -mt-4 px-4 py-10 sm:px-6
            lg:px-8 h-full flex rounded-2xl
            justify-center items-center bg-zinc-200"
        >
            <div className="text-center items-center flex
                flex-col"
            >
                <h3 className="mt-2 text-2xl font-semibold
                    text-zinc-900"
                >
                    Select a chat or start a new conversation.
                </h3>
            </div>
        </div>
    );
};

export default EmptyState;