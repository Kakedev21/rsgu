import { CartProps } from "@/types/Cart";
import numeral from "numeral";
import { FC } from "react";



const CartItem: FC<CartProps> = ({name, description, price}) => {

    return <div className="flex items-center gap-5 justify-between p-5 border-b border-slate-300">
        <div>
            <p className="font-semibold text-slate-700">{name}</p>
            <p className="font-semibold text-xs text-slate-500">{description}</p>
        </div>
        <div className="font-semibold">{numeral(price).format('0,0.00')}</div>
    </div>
}


export default CartItem;