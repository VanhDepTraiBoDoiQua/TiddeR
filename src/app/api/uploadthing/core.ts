import {createUploadthing, type FileRouter} from "uploadthing/next";
import {getToken} from "next-auth/jwt";

const f = createUploadthing();

const auth = (req: Request) => ({id: "fakeId"}); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async (req) => {
            // This code runs on your server before upload
            const user = await getToken(req);

            // If you throw, the user will not be able to upload
            if (!user) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return {userId: user.id};
        })
        .onUploadComplete(async ({metadata, file}) => {
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
