import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

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
        return {
            featuredStudysets: featuredStudysets,
            recentStudysets: recentStudysets,
            authed: authed,
            authedUser: authedUser
        }
      } catch (err) {
        console.error(err);
        error(404, {
            message: "Not Found"
        })
      }
}
