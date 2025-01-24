import fetchAuthData from "$lib/fetchAuthData.server";
import { env } from "$env/dynamic/private";

export async function load({ cookies }) {
    return {
        ...await fetchAuthData({ cookies }),
        enableOAuthGoogle: (env.ENABLE_OAUTH_GOOGLE == "true"),
        header: {
            /* show sign up link button on sign in page instead of sign in link on its own page */
            showSignUpLink: true
        }
    }
};
