import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storeValue, setStoreValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key , JSON.stringify(storeValue))
        } catch (error) {
            console.error(error)
        }
    }, [key, storeValue])
    return [storeValue, setStoreValue] as const
}