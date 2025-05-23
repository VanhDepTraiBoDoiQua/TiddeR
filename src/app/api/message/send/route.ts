// import {messageValidator} from "@/lib/validators/message";
// import {z} from "zod";
// import {db} from "@/lib/db";
// import { getIOInstance } from "@/lib/socket";
//
// export async function POST (req: Request) {
//     try {
//         const body = await req.json();
//
//         const {userId, conversationId, messageBody, messageImage} = messageValidator.parse(body);
//
//         const sender = await db.user.findFirst({
//             where: {
//                 id: userId,
//             }
//         });
//
//         if (!sender) {
//             return new Response(
//                 "Unauthorized", {status: 401},
//             );
//         }
//
//         const newMessage = await db.message.create({
//             data: {
//                 body: messageBody,
//                 image: messageImage,
//                 conversationId: conversationId,
//                 userId: userId,
//                 seenMessages: {
//                     create: {
//                         userId: userId,
//                     }
//                 }
//             },
//         });
//
//         await db.conversation.update({
//             where: {
//                 id: conversationId,
//             },
//             data: {
//                 lastMessageAt: new Date(),
//             }
//         });
//
//         const channelKey = `chat:${conversationId}:messages`;
//
//         const io = getIOInstance();
//
//         return new Response(JSON.stringify(newMessage));
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return new Response(
//                 "Invalid request data passed", {status: 422}
//             );
//         }
//
//         return new Response(
//             "Internal Error", {status: 500}
//         );
//     }
// }