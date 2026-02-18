import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";


const URLEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (

        <SessionProvider refetchInterval={5 * 60}>
            <ImageKitProvider urlEndpoint={URLEndPoint}> {children}</ImageKitProvider>
        </SessionProvider>

    );
}