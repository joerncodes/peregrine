import { Meilisearch } from "meilisearch";

export default class SearchFactory {
    private static client: Meilisearch;

    static getInstance(): Meilisearch {
        if(!SearchFactory.client) {
            SearchFactory.client = new Meilisearch({
                host: "http://localhost:7700",
                apiKey: import.meta.env.VITE_MEILI_MASTER_KEY,
            });
        }
        return SearchFactory.client;
    }
}