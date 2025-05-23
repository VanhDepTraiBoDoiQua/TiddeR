"use client"

import {useSocket} from "@/components/contexts/socket-provider";
import {Badge} from "@/components/ui/Badge";

export const SocketIndicator = () => {
    const {isConnected} = useSocket();

    if (!isConnected) {
        return (
            <Badge
                variant="outline"
                className="bg-yellow-600 text-white border-none"
            >
                Fallback: Polling every 1s
            </Badge>
        )
    } else {
        return (
            <Badge
                variant="outline"
                className="bg-emerald-600 text-white border-none"
            >
                Live: Real-time updates
            </Badge>
        )
    }
}