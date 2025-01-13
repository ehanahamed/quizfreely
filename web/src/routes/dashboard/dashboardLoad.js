import { env } from '$env/dynamic/private';

export default async function ({ cookies }, {authed, authedUser, theme }) {
  
  /* backward-compatibility for v0.27.4 */
  if (env.COOKIES_DOMAIN) {
    /* clear dashboard cookie that had old domain attribute
    we no longer use the domain attribute but we can't update or delete
    the cookie without using the old domain attribute in clearCookie's parameters */
    cookies.delete(
      "dashboard",
      {
        domain: env.COOKIES_DOMAIN,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax"
        /* notice how we need to use `domain: ...` here to be able to clear the cookie
        before being able to update/recreate the cookie without `domain: ...` */
      }
    )
  }

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
    theme,
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
  if (authed) {
    fetch(env.API_URL + "/graphql", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + cookies.get(auth),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `query {
          myStudysets {
            id
            title
            private
            terms_count
            updated_at
          }
        }`
      })
    }).then(function (rawApiRes) {
      rawApiRes.json().then(function (apiRes) {
        if (apiRes?.data?.myStudysets) {
          return {
            dashboard: true,
            studysetList: apiRes.data.myStudysets
          }
        } else {
          return {
            dashboard: true
          };
        }
      }).catch(function (error) {
        //request.log.error(error);
        //reply.send("work in progress error message error during api response json parse")
        return {
          dashboard: true
        };
      })
    }).catch(function (error) {
      //request.log.error(error);
      
      //reply.send("work in progress error message error during api graphql fetch")
      // in addition to an error message, our dashboard.html view should still be sent so that stuff like local studysets are still usable
      return {
        dashboard: true
      };
    })
  } else {
    return {
      dashboard: true
    };
  }
};
