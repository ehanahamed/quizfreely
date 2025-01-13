export default async function () {
    import { env } from '$env/dynamic/private';
    import { browser } from "$app/environment";
    let url;
    if (browser) {
        url = "/api/graphql";
    } else {
        url = env.API_URL + "/api/graphql";
    }
    fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `query {
            authed
            authedUser {
              id
              username
              display_name
            }
            featuredStudysets {
              id
              title
              user_id
              user_display_name
              terms_count
              updated_at
            }
          }`
        })
      }).then(function (response) {
        response.json().then(function (responseJson) {
          let authed = false;
          let authedUser;
          if (responseJson?.data?.authed) {
            authed = responseJson.data.authed;
            authedUser = responseJson.data?.authedUser;
          }
          if (responseJson?.data?.featuredStudysets?.length >= 0) {
            reply.view("home.html", {
              ...themeData(request),
              featuredRows: responseJson.data.featuredStudysets,
              authed: authed,
              authedUser: authedUser
            });
          } else {
            if (responseJson?.errors?.length >= 1) {
              responseJson.errors.forEach(function (error) {
                request.log.error(error);
              })
            }
            reply.view("home.html", {
              ...themeData(request),
              featuredRows: false,
              authed: authed,
              authedUser: authedUser
            });
          }
        }).catch(function (error) {
          request.log.error(error);
          reply.view("home.html", {
            ...themeData(request),
            featuredRows: false,
            authed: false,
            authedUser: undefined
          });
        });
      }).catch(function (error) {
        request.log.error(error);
        reply.view("home.html", {
          ...themeData(request),
          featuredRows: false,
          authed: false,
          authedUser: undefined
        });
      });
}