import { env } from "$env/dynamic/private";
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    let headers = {
        "Content-Type": "application/json"
      };
      if (cookies.get("auth")) {
        headers = {
          "Authorization": "Bearer " + cookies.get("auth"),
          "Content-Type": "application/json"
        };
      }
      try {
        let rawApiRes = await fetch(env.API_URL + "/graphql", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            query: `query publicStudyset($id: ID!) {
              authed
              authedUser {
                id
                username
                display_name
              }
              studyset(id: $id) {
                id
                title
                updated_at
                user_id
                user_display_name
                private
                data {
                  terms
                }
                terms_count
              }
            }`,
            variables: {
              id: params.id
            }
          })
        })
        let apiRes = await rawApiRes.json();
        let authed = false;
          let authedUser;
          if (apiRes?.data?.authed) {
            authed = apiRes.data.authed;
            authedUser = apiRes.data?.authedUser;
          }
          if (apiRes?.data?.studyset) {
            return {
              studyset: apiRes.data.studyset,
              authed: authed,
              authedUser: authedUser
            }
          } else {
            // work in progess should we implement a way to send the already fetched user data from this request to the not found handler
            // that would save an extra api request because our callnotfound handler has 
            error(404, {
              message: "Not Found"
            })
          }
      } catch (err) {
        error(404, {
          message: "Not Found"
        })
      }
}
