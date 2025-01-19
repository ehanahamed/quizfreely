import { env } from "$env/dynamic/private";
import themes from '$lib/themes.js';
import { redirect, error } from "@sveltejs/kit";

export function GET({ params, cookies }) {
    if (themes.includes(params.theme)) {

        /* backward-compatible behavoir for v0.27.4 */
        if (env.COOKIES_DOMAIN) {
          /* this clears the theme cookie if it had the old domain attribute */
          cookies.delete(
            "theme",
            {
                domain: env.COOKIES_DOMAIN,
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "lax"
              /* notice how we need to use `domain: ...` here to be able to clear the cookie
              before being able to update/recreate the cookie without `domain: ...` */
            }
          )
        }
    
        /* normal behavior */
        cookies.set(
          "theme",
          params.theme,
          {
            /* 30 days * 24h * 60m * 60s = 2592000 sec for 30 days */
            maxAge: 2592000,
            path: "/",
            httpOnly: true,
            /* when secure is true,
            browsers only send the cookie through https,
            on localhost, browsers send it even if localhost isn't using https */
            secure: true,
            sameSite: "lax"
          }
        )

        redirect(307, "/settings");
      } else {
        error(404, {
            message: "Theme Not Found"
        });
      }
}
