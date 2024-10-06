import InventoryContent from "./Inventory";

const InventoryPage = () => {
    return (
        <div className="bg-white w-full p-5">
            <div>
                <p className="font-semibold text-2xl">Inventory</p>
                <p className="text-xs text-slate-500">Manage your inventory</p>
            </div>
            <div>
                <InventoryContent/>
            </div>
        </div>
    );
}
 
export default InventoryPage;