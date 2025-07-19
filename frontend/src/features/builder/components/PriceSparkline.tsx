import { useQuery } from "@tanstack/react-query";
import { Line } from "recharts"; // recharts already available per shadcn spec
import { ResponsiveContainer, LineChart, Tooltip } from "recharts";

export default function PriceSparkline({ partId }: { partId: string }) {
  const { data } = useQuery({
    queryKey: ["price-history", partId],
    queryFn: async () => {
      const res = await fetch(`/api/price-history/${partId}`);
      return res.json(); // [{date, price}]
    },
  });

  if (!data) return null;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="price" strokeWidth={2} dot={false} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
