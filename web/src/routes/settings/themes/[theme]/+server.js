import { env } from "$env/dynamic/private";
import themes from '$lib/themes.js';
import { redirect, error } from "@sveltejs/kit";

export function GET({ params, cookies }) {
    if (themes.includes(params.theme)) {
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
