import {db} from "@/lib/db";
import {notFound} from "next/navigation";
import {Button} from "@/components/ui/Button";
import Editor from "@/components/community/submit/Editor";

interface SubmitPageProps {
    params: {
        slug: string,
    }
}

const SubmitPage = async ({params}: SubmitPageProps) => {

    const community = await db.community.findFirst({
        where: {
            name: params.slug,
        }
    });

    if (!community) {
        return notFound();
    }

    return (
        <div className="flex flex-col items-start
            gap-6"
        >
            <div className="border-b border-gray-200 pb-5">
                <div className="-ml-2 -mt-2 flex
                    flex-wrap items-baseline"
                >
                    <h3 className="ml-2 mt-2 text-base
                        font-semibold leading-6 text-gray-900"
                    >
                        Create Post
                    </h3>
                    <p className="ml-2 mt-1 truncate
                        text-sm text-gray-500"
                    >
                        in t/{community.name}
                    </p>
                </div>
            </div>

            {/*FORM*/}
            <Editor communityId={community.id}/>

            <div className="w-full flex justify-end">
                <Button
                    className="w-full"
                    form="community-post-form"
                    type="submit"
                >
                    Post
                </Button>
            </div>
        </div>
    );
};

export default SubmitPage;