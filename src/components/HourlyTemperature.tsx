import type { ForecastData } from "@/apis/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

interface HourlyTempProps {
  forecastData: ForecastData;
}

const HourlyTemperature = ({ forecastData }: HourlyTempProps) => {
  const chartData = forecastData.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Todays Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={300} height={100} data={chartData}>
              <XAxis
                dataKey={"time"}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    return (
                        <div className="rounded-lg border bg-background p-3 shadow-sm">
                            <div className="grid grid-cols-2  ">
                                <div className="flex flex-col items-center border-r pr-3">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Temperature</span>
                                    <span className="font-bold">{payload[0].value}°</span>
                                </div>
                                <div className="flex flex-col items-center ">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Feels Like</span>
                                    <span className="font-bold">{payload[1].value}°</span>
                                </div>
                            </div>
                        </div>
                    )
                }
                return null
              }} />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                strokeDasharray={"5 5"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
