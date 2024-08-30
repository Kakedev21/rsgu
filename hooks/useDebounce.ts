import { useEffect, useState } from "react";

const useDebounce = () => {
    const [value, setValue] = useState<string | null>(null);
    const [debounceValue, setDebounceValue] = useState<string|null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [value])


    return {
        debounceValue,
        setValue
    }
}
 
export default useDebounce;