import { env } from '$env/dynamic/private';

export async function load({ cookies, locals }) {
  /*
    cookies are not permanent, they eventually expire
    resetting the expiration date on every page doesn't make sense
    instead we refresh/update the expiration date when users visit the dashboard
  */
  cookies.set(
    "dashboard",
    "true",
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
  );
  cookies.set(
    "theme",
    locals.theme,
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
  if (cookies.get("auth")) {
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
          }
          myStudysets {
            id
            title
            private
            terms_count
            updated_at
          }
        }`
      })
    });
    try {
    let apiRes = await rawApiRes.json();
        if (apiRes?.data?.authed) {
          if (apiRes?.data?.myStudysets) {
            return {
              authed: apiRes.data.authed,
              authedUser: apiRes.data.authedUser,
              studysetList: apiRes.data.myStudysets,
        header: { activePage: "home" }
            }
          }
        } else {
          return {
            authed: false,
      header: { activePage: "home" }
          }
        }
      } catch (error) {
        //request.log.error(error);
        //reply.send("work in progress error message error during api response json parse")
        return {
          authed: false,
      header: { activePage: "home" }
        }
      }
    } catch (error) {
      //request.log.error(error);
      //reply.send("work in progress error message error during api graphql fetch")
      // in addition to an error message, our dashboard.html view should still be sent so that stuff like local studysets are still usable
      return {
        authed: false,
      header: { activePage: "home" }
      }
    }
  } else {
    return {
      authed: false,
      header: { activePage: "home" }
    }
  }
};
