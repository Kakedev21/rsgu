import { ProductProps } from "@/types/Product";
import { FC } from "react";

const OrderProducts: FC<ProductProps> = ({name, description, price}) => {

    return <div className="border border-slate-100 rounded p-2">
        <div>
            <p className="text-xs">{name}</p>
            <p className="text-xs text-slate-600">{description}</p>
        </div>
    </div>
}


export default OrderProducts;