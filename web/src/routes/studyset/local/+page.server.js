import fetchAuthData from "$lib/fetchAuthData.server";
import { error } from "@sveltejs/kit";

export async function load({ params, url }) {
    let localId = url.searchParams.get("id");
    if (localId != null) {
        return {
            ...fetchAuthData,
            localId: parseInt(localId)
        }
    } else {
        error(400, {
            message: "Missing Studyset ID"
        })
    }
}
