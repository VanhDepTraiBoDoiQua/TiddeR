import {db} from "@/lib/db";

export async function GET(req: Request) {
    const url = new URL(decodeURIComponent(req.url));

    const query = url.searchParams.get('query');

    if (!query) {
        return new Response(
            "Invalid query string", {status: 400}
        );
    }

    const results = await db.community.findMany({
        where: {
            name: {
                contains: query,
            },
        },
        include: {
            _count: true,
        },
        take: 5,
    });

    return new Response(JSON.stringify(results));
}