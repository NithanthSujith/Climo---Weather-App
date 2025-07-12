import CurrentWeather from "@/components/CurrentWeather";
import FavoriteBtn from "@/components/FavoriteBtn";
import HourlyTemperature from "@/components/HourlyTemperature";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates || { lat: 0, lon: 0 });
  const forecastQuery = useForecastQuery(coordinates || { lat: 0, lon: 0 });

  if (weatherQuery.error || forecastQuery.error) {
    <Alert variant={"destructive"}>
      <AlertTriangle />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again.</p>
      </AlertDescription>
    </Alert>;
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Fav Cities  */}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavoriteBtn
            favoritesData={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>
      {/* Add to favorite  */}

      {/* Current and hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 ">
          {/* current weather  */}
          <CurrentWeather weatherData={weatherQuery.data} />

          {/* hourly temperature  */}
          <HourlyTemperature forecastData={forecastQuery.data} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* details  */}
          <WeatherDetails detailsData={weatherQuery.data} />

          {/* forecast */}
          <WeatherForecast forecastData={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
