"use client"
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Authentication from "./authentication";

const SessionWrapper = ({ children }: { children: ReactNode; }) => {
    return (
        <SessionProvider>
            <Authentication>{children}</Authentication>
        </SessionProvider>
    )
}

export default SessionWrapper;