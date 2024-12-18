import { auth } from "@/auth"


export default auth((req) => {
  console.log('in middleware')
  if (!req.auth && req.nextUrl.pathname.startsWith("/prompts")) {
    console.log('in middleware redirect')
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})


export const config = {
  matcher: [
    // 需要登录验证的路由
    "/api/prompts/:path*",
    // 排除不需要验证的路由
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ]
}

