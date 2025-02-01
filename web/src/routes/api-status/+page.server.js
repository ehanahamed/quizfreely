import { env } from "$env/dynamic/private";
import apiStatusConfig from "../../../api-status.config";
import checkApiStatus from "$lib/checkApiStatus.server";

export async function load({ cookies }) {
    return {
      ...await checkApiStatus({
          authCookie: cookies.get("auth"),
          API_URL: env.API_URL
      }),
      config: apiStatusConfig
    }
}
