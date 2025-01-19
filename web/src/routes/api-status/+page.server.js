import { env } from "$env/dynamic/private";
import apiStatusConfig from "../../../api-status.config";

export async function load({ cookies }) {
    try {
    let rawApiRes = await fetch(env.API_URL + "/graphql", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + cookies.get("auth"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `query {
            authed
            authedUser {
              id
              username
              display_name
              auth_type
              oauth_google_email
            }
            dbConnectionStatus {
              connectionUp
            }
            cronStatus {
              errorCount
              anyEnabled
            }
          }`
        })
      });
      try {
      let apiRes = await rawApiRes.json()
      if (apiRes && apiRes.data) {
        return {
          authed: apiRes?.data?.authed ?? false,
          authedUser: apiRes?.data?.authedUser,
          apiUp: true,
          dbConnectionUp: apiRes.data?.dbConnectionStatus?.connectionUp ?? false,
          apiCronErrorCount: apiRes.data?.cronStatus?.errorCount,
          apiCronAnyEnabled: apiRes.data?.cronStatus?.anyEnabled,
          config: apiStatusConfig
        };
      } else {
        return {
          authed: false,
          apiUp: true,
          apiResponseErrorNoData: true,
          config: apiStatusConfig
        }
      }
    } catch (error) {
        return {
            authed: false,
            apiUp: true,
            apiResponseErrorNotJSON: true,
            config: apiStatusConfig
          }
    }
    } catch (error) {
        console.error(error);
        return {
            authed: false,
            apiUp: false,
            config: apiStatusConfig
        }
    }
}
