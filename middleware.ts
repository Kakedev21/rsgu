export { default } from "next-auth/middleware";

export const config = { 
    matcher: ["/admin/:path*", "/cashier/:path*", "/shop/cart", "/shop/orders"]
}