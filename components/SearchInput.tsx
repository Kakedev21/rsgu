import { Search } from "lucide-react";
import { InputProps } from "./ui/input";

const SearchInput: React.FC<InputProps> = (props) => {

    return (
        <div className="w-full flex items-center border border-slate-200 p-2 gap-x-1 rounded">
            <Search size={16}/>
            <input {...props} type="search" className="focus:outline-none w-full text-xs"/>
           
        </div>
    );
}
 
export default SearchInput;