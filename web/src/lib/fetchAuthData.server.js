import { API_URL } from "$env/static/private";

export default async function ({ cookies }) {
  let authed = false;
  let authedUser;
  let apiError = false;
  if (cookies.get("auth")) {
    try {
      let rawAuthedRes = await fetch(API_URL + "/graphql", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + cookies.get("auth"),
          "Content-Type": "application/json",
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
          }`
        })
      });
      let authedRes = await rawAuthedRes.json();
      if (authedRes?.data?.authed) {
        authed = authedRes.data.authed;
        authedUser = authedRes.data?.authedUser
      }
      apiError = false;
    } catch (error) {
      console.error(error);
      apiError = true;
    }
  }
  return {
    authed: authed,
    authedUser: authedUser,
    apiError: apiError
  }
}
