import type { WeatherData } from "@/apis/types";
import { useFavorite } from "@/hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  favoritesData: WeatherData;
}

const FavoriteBtn = ({ favoritesData }: FavoriteButtonProps) => {
  const { addToFavorites, isFavorite, removeFavorite } = useFavorite();

  const isFavoriteCity = isFavorite(
    favoritesData.coord.lat,
    favoritesData.coord.lon
  );

  const handleToggleFavorite = ()=>{
    if (isFavoriteCity) {
        removeFavorite.mutate(`${favoritesData.coord.lat}-${favoritesData.coord.lon}`)
        toast.error(`Removed ${favoritesData.name} from Favorites`)
    }else{
        addToFavorites.mutate({
            name : favoritesData.name,
            country : favoritesData.sys.country,
            lat : favoritesData.coord.lat,
            lon : favoritesData.coord.lon
        })
        toast.success(`Added ${favoritesData.name} to Favorites`)
    }
  }


  return (
    <Button
      variant={isFavoriteCity ? "default" : "outline"}
      size={"icon"}
      className={isFavoriteCity ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-all" : "cursor-pointer transition-all"}
      onClick={handleToggleFavorite}
    >
      <Star className={`h-4 w-4 ${isFavoriteCity ? "fill-current" : ""} `} />
    </Button>
  );
};

export default FavoriteBtn;
