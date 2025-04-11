import {getAuthSession} from "@/lib/auth";
import {usernameValidator} from "@/lib/validators/username";
import {db} from "@/lib/db";
import {z} from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response(
                "Unauthorized", {status: 401},
            );
        }

        const body = await req.json();

        const {username} = usernameValidator.parse(body);

        const existedUsername = await db.user.findFirst({
            where: {
                username: username,
            }
        });

        if (existedUsername) {
            return new Response(
                "Username is taken", {status: 409},
            );
        }

        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                username: username,
            }
        });

        return new Response("OK");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                "Invalid request data passed", {status: 422},
            );
        }

        return new Response(
            "Could not update username, please try again later.", {status: 500},
        );
    }
}