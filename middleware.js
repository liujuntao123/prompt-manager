import { auth } from "@/auth"

export default auth((req) => {
  const start = performance.now()
  
  if (!req.auth && req.nextUrl.pathname.startsWith("/prompts")) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin)
    console.log(`[Middleware] Auth redirect took ${performance.now() - start}ms`)
    return Response.redirect(newUrl)
  }
  
  console.log(`[Middleware] Auth check took ${performance.now() - start}ms`)
})

export const config = {
  matcher: [
    // 需要登录验证的路由
    "/api/prompts/:path*",
    // 排除不需要验证的路由
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ]
}

