import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemperature from "@/components/HourlyTemperature";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeolocationQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  // ...inside WeatherDashboard
  const weatherQuery = useWeatherQuery(coordinates || { lat: 0, lon: 0 });
  const forecastQuery = useForecastQuery(coordinates || { lat: 0, lon: 0 });
  const locationQuery = useReverseGeolocationQuery(
    coordinates || { lat: 0, lon: 0 }
  );

  // ... rest of your component
  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <LoadingSkeleton />;
  }
  if (locationError) {
    return (
      <Alert variant={"destructive"}>
        <AlertTriangle />
        <AlertTitle>Location Error!</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 w-4 h-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!coordinates) {
    return (
      <Alert variant={"destructive"}>
        <AlertTriangle />
        <AlertTitle>Location Required!</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 w-4 h-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    <Alert variant={"destructive"}>
      <AlertTriangle />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again.</p>
        <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
          <RefreshCw className="mr-2 w-4 h-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>;
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <LoadingSkeleton/>
  }

  return (
    <div className="space-y-4">
      {/* Fav Cities  */}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant={"outline"} size={"icon"} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
          <RefreshCw className= {`h-4 w-4 ${weatherQuery.isFetching || forecastQuery.isFetching ? 'animate-spin': ""}`} />
        </Button>
      </div>

      {/* Current and hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4 ">
          {/* current weather  */}
          <CurrentWeather weatherData={weatherQuery.data} locationName={locationName }/>


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

export default WeatherDashboard;
