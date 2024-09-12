import { ChevronRight, ShoppingCart, Store } from "lucide-react";
import CartLists from "./_components/CartList";
import Link from "next/link";

const ShoppingCartPage = () => {


    return <div className="bg-white p-5 rounded space-y-5 overflow-scroll">
       <div className="flex items-center gap-3">
            <Link href="/shop" className="flex items-center gap-3">
                <Store />
                <p className="font-semibold text-lg text-slate-700">Shop</p>
            </Link>
            <div className="flex items-center gap-3">
                <ChevronRight />
            </div>
            <div className="flex items-center gap-3">
                <ShoppingCart className="text-slate-500"/>
                <p className="font-semibold text-lg text-slate-500">Checkout</p>
            </div>
        </div> 
        <div>
            <CartLists/>
        </div>
    </div>
}


export default ShoppingCartPage;