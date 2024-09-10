import { ShoppingCart } from "lucide-react";
import CartLists from "./_components/CartList";

const ShoppingCartPage = () => {


    return <div className="bg-white p-5 rounded space-y-5">
       <div className="flex items-center gap-3">
            <ShoppingCart className="text-slate-700"/>
            <p className="font-semibold text-lg text-slate-700">Cart</p>
        </div> 
        <div>
            <CartLists/>
        </div>
    </div>
}


export default ShoppingCartPage;