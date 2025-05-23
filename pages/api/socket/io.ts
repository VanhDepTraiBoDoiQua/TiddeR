import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import {NextApiResponseServerIo} from "@/types/db";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on("connection", (socket) => {
            socket.on("join", (conversationId: string) => {
                socket.join(`${conversationId}`);
                console.log(`${socket.id} joined ${conversationId}`);
            });

            socket.on("leave", (conversationId: string) => {
                socket.leave(conversationId);
                console.log(`${socket.id} leave ${conversationId}`);
            });

            socket.on("disconnect", () => {
                const conversationId = socket.data.conversationId;
                if (conversationId) {
                    socket.leave(conversationId);
                    console.log(`${socket.id} leave ${conversationId}`);
                }
            });
        });


        res.socket.server.io = io;
    }
    res.end();
}

export default ioHandler;