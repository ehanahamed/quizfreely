import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import checkApiStatus from '$lib/checkApiStatus.server.js';

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
              featuredStudysets {
                id
                title
                user_display_name
                terms_count
                updated_at
              }
              recentStudysets {
                id
                title
                user_display_name
                terms_count
                updated_at
              }
            }`
          })
        });
        let apiRes = await rawApiRes.json();
        let authed = false;
        let authedUser;
        let featuredStudysets = [];
        let recentStudysets = [];
        if (apiRes?.data?.authed) {
          authed = apiRes.data.authed;
          authedUser = apiRes.data?.authedUser;
        }
        if (apiRes?.data?.featuredStudysets?.length >= 0) {
          featuredStudysets = apiRes.data.featuredStudysets;
        }
        if (apiRes?.data?.recentStudysets?.length >= 0) {
          recentStudysets = apiRes.data.recentStudysets;
        }
        
        let apiStatus;
        /* if there's no data, check qzfr-api status */
        if (!(featuredStudysets?.length >= 1 || recentStudysets?.length >= 1)) {
          apiStatus = await checkApiStatus({
            authCookie: cookies.get("auth"),
            API_URL: env.API_URL
          })
        }
        return {
            featuredStudysets: featuredStudysets,
            recentStudysets: recentStudysets,
            authed: authed,
            authedUser: authedUser,
            header: {
                activePage: "explore"
            },
            graphQLErrors: apiRes?.errors,
            apiStatus: apiStatus
        }
      } catch (err) {
        console.error(err);
        let apiStatus = await checkApiStatus({
          authCookie: cookies.get("auth"),
          API_URL: env.API_URL
        })
        if (!(apiStatus?.apiUp) || (apiStatus?.apiResponseErrorNotJSON)) {
          return {
            authed: false,
            header: {
                activePage: "explore"
            },
            pageServerJSError: false,
            apiStatus: apiStatus
          }
        } else {
          return {
            authed: false,
            header: {
                activePage: "explore"
            },
            pageServerJSError: true,
            apiStatus: apiStatus
          }
        }
      }
}
