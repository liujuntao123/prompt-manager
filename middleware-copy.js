// import { withAuth0 } from '@auth0/nextjs-auth0';

// import { clerkMiddleware,createRouteMatcher  } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher(['/prompts(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect()
// })



// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

// export default withAuth0({
//   onError: (error) => {
//     console.error('Auth0 error:', error);
//   },
// });

export default {}
