import type { WeatherData } from "@/apis/types";
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeatherDetailsProps {
  detailsData: WeatherData;
}

const WeatherDetails = ({ detailsData }: WeatherDetailsProps) => {
  const { wind, sys, main } = detailsData;

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icons: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icons: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icons: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icons: Gauge,
      color: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-6">
            {details.map((detail)=>{
                return <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
                    <detail.icons className={`h-5 w-5 ${detail.color}`}  />
                    <div>
                        <p className="text-sm font-medium leading-none">{detail.title}</p>
                        <p className="text-sm text-muted-foreground">{detail.value}</p>
                    </div>
                </div>
            })}
        </div>
      </CardContent>
     
    </Card>
  );
};

export default WeatherDetails;
