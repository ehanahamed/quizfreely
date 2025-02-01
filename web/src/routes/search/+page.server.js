import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import fetchAuthData from '$lib/fetchAuthData.server';

export async function load({ cookies, url }) {
let searchQuery = (url.searchParams.get("q") ?? "")
if (searchQuery.replace(/\s+/g, '') == "") {
  searchQuery = "";
}

if (searchQuery.length >= 1) {
    try {
      let rawApiRes = await fetch(env.API_URL + "/graphql", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + cookies.get("auth"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `query SearchResults($q: String!) {
            authed
            authedUser {
              id
              username
              display_name
              auth_type
              oauth_google_email
            }
            searchStudysets(q: $q) {
              id
              title
              user_id
              user_display_name
              terms_count
            }
          }`,
          variables: {
            q: url.searchParams.get("q")
          }
        })
      });
      let apiRes = await rawApiRes.json();
      let authed = false;
      let authedUser;
      if (apiRes?.data?.authed) {
        authed = apiRes.data.authed;
        authedUser = apiRes.data?.authedUser
      }
      if (apiRes?.data?.searchStudysets?.length >= 0) {
        return {
          query: searchQuery,
          header: {
            activePage: "explore",
            searchQuery: searchQuery
          },
          results: apiRes.data.searchStudysets,
          authed: authed,
          authedUser: authedUser
        }
      } else {
        error(500, {
            message: "looks like this is broken, idk why though :("
        })
      }
    } catch (err) {
      console.error(err);
      error(500, {
            message: "something went wrong, idk"
        }
      )
    }
  } else {
    let userResult = await fetchAuthData({ cookies });
    return {
      query: "",
      authed: userResult.authed,
      authedUser: userResult?.authedUser,
      header: {
        activePage: "explore",
        hideSearchbar: true
      }
    }
  }
}
