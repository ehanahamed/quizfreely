import fetchAuthData from "$lib/fetchAuthData.server";
import { ENABLE_OAUTH_GOOGLE } from "$env/static/private";

export async function load({ cookies }) {
    return {
        ...await fetchAuthData({ cookies }),
        enableOAuthGoogle: (ENABLE_OAUTH_GOOGLE == "true")
    }
};
