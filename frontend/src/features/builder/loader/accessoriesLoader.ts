import { queryClient } from "@/providers/AppProviders";
import { supabase } from "@/lib/supabase";

export async function accessoriesLoader() {
  const cats = ["accessory"];
  await queryClient.prefetchQuery({
    queryKey: ["parts", cats],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .in("category", cats)
        .order("price_usd");
      if (error) throw error;
      return data;
    },
  });
  return null;
}
