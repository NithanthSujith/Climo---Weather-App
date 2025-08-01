import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface FavoriteCity {
    id: string,
    name: string,
    lat: number,
    lon: number,
    country: string,
    state?: string,
    addedAt: number
}

export function useFavorite() {
    const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>("favorites", []);
    const queryClient = useQueryClient()


    // reading the history from the localstorage this custom hook just reads the history and returns it
    const favoritesQuery = useQuery({
        queryKey: ["favorites"],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity
    })

    const addToFavorites = useMutation({
        mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
            const newFavorite: FavoriteCity = {
                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now(),
            }

            const exists = favorites.some((fav) => fav.id === newFavorite.id) // checking whether the favorites contains the city or not

            if (exists) {
                return favorites
            }

            const newFavorites = [...favorites, newFavorite].slice(0, 10);

            setFavorites(newFavorites);
            return newFavorites
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        },

    })


    const removeFavorite = useMutation({
        mutationFn: async (cityId: string) => {
            const newFavorites = favorites.filter((city) => city.id !== cityId)
            setFavorites(newFavorites);
            return newFavorites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        },
    })

    return {
        favorites: favoritesQuery.data ?? [],
        addToFavorites,
        removeFavorite,
        isFavorite: (lat: number, lon: number) => {
            return favorites.some((city) => city.lat === lat && city.lon === lon)
        }
    }
}