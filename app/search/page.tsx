import { Suspense } from "react";
import SearchResultsPage from "./pager";

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResultsPage />
        </Suspense>
    );
}