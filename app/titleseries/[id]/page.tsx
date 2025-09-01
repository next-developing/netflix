// app/titleseries/[id]/page.tsx
import { getSeriesById } from "@/lib/actions/movies";
import SeriesPage from "@/components/seriespage"; // выбранный компонент

export default async function Page({params}: {params: Promise<{ id: number }>}) {
    const id = await params;
    const series = await getSeriesById(id.id);
   
    return (
        <SeriesPage 
            seriesId={id.id} 
            initialSeries={series}
        />
    );
}