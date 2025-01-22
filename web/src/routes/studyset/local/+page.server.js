import fetchAuthData from "$lib/fetchAuthData.server";
import { error } from "@sveltejs/kit";

export async function load({ params, url, cookies }) {
    let localId = parseInt(url.searchParams.get("id"));
    return {
        ...await fetchAuthData({ cookies }),
        localId: localId
    }
}
