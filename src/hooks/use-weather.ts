import type { Coordinates } from "@/apis/types";
import { weatherAPI } from "@/apis/weather";
import { useQuery } from "@tanstack/react-query";


export const WEATHER_KEY = {
    weather: (coords: Coordinates) => ['weather', coords] as const,
    forecast: (coords: Coordinates) => ['forecast', coords] as const,
    location: (coords: Coordinates) => ['location', coords] as const,
    search: (query: string) => ['location-search', query] as const,
} as const

export function useWeatherQuery(coordinates: Coordinates) {
    return useQuery({
        queryKey: WEATHER_KEY.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => {
            console.log("Weather")
            return coordinates ? weatherAPI.getCurrentWeather(coordinates) : null
        },
        enabled: !!coordinates

    })
}
export function useForecastQuery(coordinates: Coordinates) {
    return useQuery({
        queryKey: WEATHER_KEY.forecast(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => {
            console.log("Forecast")
            return coordinates ? weatherAPI.getForecast(coordinates) : null
        },
        enabled: !!coordinates

    })
}
export function useReverseGeolocationQuery(coordinates: Coordinates) {
    return useQuery({
        queryKey: WEATHER_KEY.location(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => {
            return coordinates ? weatherAPI.reverseGeoCode(coordinates) : null
        },
        enabled: !!coordinates

    })
}

export function useLocationSearch(query:string){
     return useQuery({
        queryKey: WEATHER_KEY.search(query),
        queryFn: () => {
            return weatherAPI.searchLocations(query) 
        },
        enabled: query.length >= 3

    })
}