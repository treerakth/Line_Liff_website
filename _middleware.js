import { NextResponse } from "next/server";

export function middleware(request) {
    // สร้าง URL object จาก request.url
    const url = new URL(request.url);
    const liffState = url.searchParams.get('liff.state');

    if (liffState) {
        console.log("Liff State : ", liffState)
        // localStorage.setItem("branchId", liffState)
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/",
};
