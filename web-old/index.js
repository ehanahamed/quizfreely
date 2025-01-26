import "dotenv/config"
import Fastify from "fastify";
import fastifyCompress from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifyCookie from "@fastify/cookie";
import fastifyHttpProxy from "@fastify/http-proxy";
import path from "path";
import { Eta } from "eta";
import { writeFile } from "node:fs";
import { Cron } from "croner";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const themes = require("./themes.json");
const docs = require("./docs.json");
const devDashboardConfig = require("./dev-dashboard.config.json");

const PORT = process.env.PORT
const HOST = process.env.HOST
const API_URL = process.env.API_URL
const LOG_LEVEL = process.env.LOG_LEVEL
const LOG_PRETTY = process.env.LOG_PRETTY || "false"
const CACHE_VIEWS = process.env.CACHE_VIEWS || "false"
const CRON_CLEAR_LOGS = process.env.CRON_CLEAR_LOGS || "false";
const CRON_CLEAR_LOGS_INTERVAL = process.env.CRON_CLEAR_LOGS_INTERVAL;
const ENABLE_OAUTH_GOOGLE = process.env.ENABLE_OAUTH_GOOGLE || "false";

/* COOKIES_DOMAIN is removed/depreciated,
but we can not update cookies without the domain flag if that user had the cookie previously set with the domain flag,
and if we want to delete/clear a cookie, we need to use the same options/flags that the cookie used to have

so, if COOKIES_DOMAIN is still in our dotenv file,
we delete the old cookie using the old COOKIES_DOMAIN
and then recreate the cookie without the domain attribute */
const COOKIES_DOMAIN = process.env.COOKIES_DOMAIN;

if (PORT == undefined || HOST == undefined) {
  console.error(
    "quizfreely/web/.env is missing or invalid \n" +
    "copy .env.example to .env"
  );
  process.exit(1);
}

let loggerConfig = {
  level: LOG_LEVEL,
  file: path.join(import.meta.dirname, "quizfreely-web.log")
};
if (LOG_PRETTY == "true") {
  loggerConfig = {
    level: LOG_LEVEL,
    transport: {
      targets: [
        {
          target: "pino-pretty",
          
        },
        {
          target: "pino/file",
          options: {
            destination: path.join(import.meta.dirname, "quizfreely-web.log")
          }
        }
      ]
    },
  };
}
const fastify = Fastify({
  logger: loggerConfig
})

const eta = new Eta({
  tags: [
    "<eta>",
    "</eta>"
  ],
  varName: "data",
  defaultExtension: ".html"
})

/*
  "Important note! If you are using @fastify/compress plugin together with @fastify/static plugin,
  you must register the @fastify/compress (with global hook) before registering @fastify/static"
*/
await fastify.register(
  fastifyCompress
);
await fastify.register(fastifyCookie);
await fastify.register(fastifyView, {
  engine: {
    eta
  },
  production: (CACHE_VIEWS == "true"),
  root: path.join(import.meta.dirname, "views"),
  //defaultContext: {}
});
await fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "assets"),
  prefix: "/assets/"
});

await fastify.register(fastifyHttpProxy, {
  upstream: API_URL,
  prefix: '/api'
});

fastify.setErrorHandler(function (error, request, reply) {
  request.log.error("500 at " + request.url)
  request.log.error(error)
  try {
    reply.status(500).sendFile("500.html", path.join(import.meta.dirname, "views"));
  } catch (error) {
    reply.status(500).send(
      "500 Internal Server Error \n" +
      ":( \n" +
      "Report this problem at https://github.com/ehanahamed/quizfreely/issues \n" +
      "or on Quizfreely's discord server at https://discord.gg/6qQrybf6kG "
    )
  }
})

fastify.setNotFoundHandler(function (request, reply) {
  request.log.warn("404 at " + request.url)
  userData(request).then(function (userResult) {
    reply.status(404).view("404.html", {
      ...themeData(request),
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/favicon.ico", function (request, reply) {
  reply.sendFile("favicon.ico", import.meta.dirname)
})
fastify.get("/icon.svg", function (request, reply) {
  reply.sendFile("icon.svg", import.meta.dirname)
})
fastify.get("/apple-touch-icon.png", function (request, reply) {
  reply.sendFile("apple-touch-icon.png", import.meta.dirname)
})

function themeData(request) {
  let theme = "auto";
  if (request.cookies.theme !== undefined && themes.includes(request.cookies.theme)) {
    theme = request.cookies.theme;
  }
  let themeCss = `<link rel="stylesheet" href="/assets/themes/ehui-${theme}.min.css" />`;
  if (theme == "custom") {
    themeCss = ""
  }
  return {
    theme: theme,
    themeCss: themeCss
  }
}

async function userData(request) {
  let authed = false;
  let authedUser;
  if (request.cookies.auth) {
    try {
      let rawAuthedRes = await fetch(API_URL + "/graphql", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + request.cookies.auth,
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
    } catch (error) {
      request.log.error(error);
    }
  }
  return {
    authed: authed,
    authedUser: authedUser
  }
}

function landingPage(request, reply) {
  fetch(API_URL + "/graphql", {
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

function dashboard(request, reply) {
  /* backward-compatibility for v0.27.4 */
  if (COOKIES_DOMAIN) {
    /* clear dashboard cookie that had old domain attribute
    we no longer use the domain attribute but we can't update or delete
    the cookie without using the old domain attribute in clearCookie's parameters */
    reply.clearCookie(
      "dashboard",
      {
        ...cookieOptions(),
        domain: COOKIES_DOMAIN
        /* notice how we need to use `domain: ...` here to be able to clear the cookie
        before being able to update/recreate the cookie without `domain: ...` */
      }
    )
  }

  let themeDataObj = themeData(request);
  let cookieOptionsObj = cookieOptions();
  /*
    cookies are not permanent, they eventually expire
    resetting the expiration date on every page doesn't make sense
    instead we refresh/update the expiration date when users visit the dashboard
  */
  reply.setCookie(
    "dashboard",
    "true",
    cookieOptionsObj
  ).setCookie(
    "theme",
    themeDataObj.theme,
    cookieOptionsObj
  )
  if (request.cookies.auth) {
    fetch(API_URL + "/graphql", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + request.cookies.auth,
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
    }).then(function (rawApiRes) {
      rawApiRes.json().then(function (apiRes) {
        if (apiRes?.data?.authed) {
          if (apiRes?.data?.myStudysets) {
            reply.view("dashboard.html", {
              ...themeDataObj,
              authed: apiRes.data.authed,
              authedUser: apiRes.data.authedUser,
              studysetList: apiRes.data.myStudysets
            })
          }
        } else {
          reply.view("dashboard.html", {
            ...themeDataObj,
            authed: false
          })
        }
      }).catch(function (error) {
        request.log.error(error);
        //reply.send("work in progress error message error during api response json parse")
        reply.view("dashboard.html", {
          ...themeDataObj,
          authed: false
        })
      })
    }).catch(function (error) {
      request.log.error(error);
      //reply.send("work in progress error message error during api graphql fetch")
      // in addition to an error message, our dashboard.html view should still be sent so that stuff like local studysets are still usable
      reply.view("dashboard.html", {
        ...themeDataObj,
        authed: false
      })
    })
  } else {
    reply.view("dashboard.html", {
      ...themeDataObj,
      authed: false
    })
  }
}

function home(request, reply) {
  if (request.cookies.dashboard == "true") {
    dashboard(request, reply);
  } else {
    landingPage(request, reply)
  }
}

fastify.get("/", home);
fastify.get("/home", home);
fastify.get("/dashboard", dashboard);
fastify.get("/landing-page", landingPage);
fastify.get("/settings", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("settings.html", {
      ...themeData(request),
      modal: "none",
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })  
  })
});

fastify.get("/dev-dashboard", function (request, reply) {
  let webCronAnyEnabled = false;
  let webCronErrorCount = 0;
  if (CRON_CLEAR_LOGS == "true") {
    webCronAnyEnabled = true;
    if (cronClearLogsError) {
      webCronErrorCount++;
    }
  }
  fetch(API_URL + "/graphql", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + request?.cookies?.auth,
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
  }).then(function (rawApiRes) {
    rawApiRes.json().then(function (apiRes) {
      if (apiRes && apiRes.data) {
        reply.view("dev-dashboard.html", {
          ...themeData(request),
          authed: apiRes?.data?.authed ?? false,
          authedUser: apiRes?.data?.authedUser,
          apiUp: true,
          dbConnectionUp: apiRes.data?.dbConnectionStatus?.connectionUp ?? false,
          apiCronErrorCount: apiRes.data?.cronStatus?.errorCount,
          apiCronAnyEnabled: apiRes.data?.cronStatus?.anyEnabled,
          webCronErrorCount: webCronErrorCount,
          webCronAnyEnabled: webCronAnyEnabled,
          config: devDashboardConfig
        })
      } else {
        reply.view("dev-dashboard.html", {
          ...themeData(request),
          authed: false,
          apiUp: true,
          apiResponseErrorNoData: true,
          webCronErrorCount: webCronErrorCount,
          webCronAnyEnabled: webCronAnyEnabled,
          config: devDashboardConfig
        })
      }
    }).catch(function (error) {
      request.log.error(error);
      reply.view("dev-dashboard.html", {
        ...themeData(request),
        authed: false,
        apiUp: true,
        apiResponseErrorNotJSON: true,
        webCronErrorCount: webCronErrorCount,
        webCronAnyEnabled: webCronAnyEnabled,
        config: devDashboardConfig
      })
    })
  }).catch(function (error) {
    request.log.error(error);
    reply.view("dev-dashboard.html", {
      ...themeData(request),
      authed: false,
      apiUp: false,
      webCronErrorCount: webCronErrorCount,
      webCronAnyEnabled: webCronAnyEnabled,
      config: devDashboardConfig
    })
  });
})

fastify.get("/sign-up", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("account.html", {
      signup: true,
      ...themeData(request),
      authed: userResult.authed,
      authedUser: userResult?.authedUser,
      enableOAuthGoogle: (ENABLE_OAUTH_GOOGLE == "true")
    })
  })
})

fastify.get("/sign-in", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("account.html", {
      signup: false,
      ...themeData(request),
      authed: userResult.authed,
      authedUser: userResult?.authedUser,
      enableOAuthGoogle: (ENABLE_OAUTH_GOOGLE == "true")
    })
  })
})

fastify.get("/privacy", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("privacy.html", {
      ...themeData(request),
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/terms", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("tos.html", {
      ...themeData(request),
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/tos", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("tos.html", {
      ...themeData(request),
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/explore", async function (request, reply) {
  /* this is async, remember to use `return reply.send()` instead of just `reply.send()` */
  
})

fastify.get("/studyset/create", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("edit.html", {
      ...themeData(request),
      new: true,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  });
})

fastify.get("/studysets/:studyset", function (request, reply) {
  let headers = {
    "Content-Type": "application/json"
  };
  if (request.cookies.auth) {
    headers = {
      "Authorization": "Bearer " + request.cookies.auth,
      "Content-Type": "application/json"
    };
  }
  fetch(API_URL + "/graphql", {
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
        id: request.params.studyset
      }
    })
  }).then(function (rawApiRes) {
    rawApiRes.json().then(function (apiRes) {
      let authed = false;
      let authedUser;
      if (apiRes?.data?.authed) {
        authed = apiRes.data.authed;
        authedUser = apiRes.data?.authedUser;
      }
      if (apiRes?.data?.studyset) {
        reply.view("studyset.html", {
          ...themeData(request),
          local: false,
          studyset: apiRes.data.studyset,
          authed: authed,
          authedUser: authedUser
        })
      } else {
        // work in progess should we implement a way to send the already fetched user data from this request to the not found handler
        // that would save an extra api request because our callnotfound handler has 
        reply.callNotFound();
      }
    })
  }).catch(function (error) {
    request.log.warn(error);
    reply.callNotFound();
  })
});

fastify.get("/studyset/local", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("studyset.html", {
      ...themeData(request),
      local: true,
      localId: request?.query?.id,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/studyset/edit/:studyset", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("edit.html", {
      ...themeData(request),
      new: false,
      studysetId: request.params.studyset,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/studyset/edit-local", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("edit.html", {
      ...themeData(request),
      new: false,
      local: true,
      localId: request.query.id,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/studyset/local/review-mode", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("review-mode.html", {
      ...themeData(request),
      local: true,
      localId: request?.query?.id,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
})

fastify.get("/studysets/:studyset/review-mode", function (request, reply) {
  userData(request).then(function (userResult) {
    reply.view("review-mode.html", {
      ...themeData(request),
      local: false,
      studysetId: request.params.studyset,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  })
});

fastify.get("/users/:userid", function (request, reply) {
  userData(request).then(function (userResult) {
    fetch(API_URL + "/v0/public/users/" + request.params.userid)
    .then(function (response) {
      response.json().then(function (responseJson) {
        if (responseJson.error) {
          reply.callNotFound()
        } else {
          reply.view("user.html", {
            ...themeData(request),
            user: responseJson.data.user,
            authed: userResult.authed,
            authedUser: userResult?.authedUser
          })
        }
      });
    }).catch(function (error) {
      request.log.error(error)
      reply.callNotFound();
    });
  })
})

fastify.get("/search", async function (request, reply) {
  if (request?.query?.q) {
    try {
      let rawApiRes = await fetch(API_URL + "/graphql", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + request.cookies.auth,
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
            q: request.query.q
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
        return reply.view("search.html", {
          ...themeData(request),
          query: request.query.q,
          results: apiRes.data.searchStudysets,
          authed: authed,
          authedUser: authedUser
        })
      } else {
        return reply.send("work in progress error message mabye")
      }
    } catch (error) {
      return reply.send("work in progress error message?")
    }
  } else {
    let userResult = await userData(request);
    return reply.view("search.html", {
      ...themeData(request),
      query: false,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    })
  }
})

fastify.get("/discord", function (request, reply) {
  reply.redirect("https://discord.gg/6qQrybf6kG")
})

function cookieOptions() {
  return {
    path: "/",
    signed: false,
    /* 30 days * 24h * 60m * 60s = 2592000 sec for 30 days */
    maxAge: 2592000,
    httpOnly: true,
    sameSite: "lax",
    /* when secure is true,
    browsers only send the cookie through https,
    on localhost, browsers send it even if localhost isn't using https */
    secure: true
  }
}

fastify.get("/docs/*", function (request, reply) {
  let filename = request.url.replace("/docs/", "")
  if (request.url.endsWith(".md")) {
    filename = filename.substring(0, filename.length - 3) + ".html"
  } else if (!request.url.endsWith(".html")) {
    filename = filename + ".html";
  }
  if (docs.files.includes(filename)) {
    userData(request).then(function (userResult) {
      reply.view("docs-page.html", {
        ...themeData(request),
        authed: userResult.authed,
        authedUser: userResult?.authedUser,
        filepath: "./docs/" + filename
      })
    })
  } else {
    reply.callNotFound();
  }
})

fastify.get("/settings/themes/:theme", function (request, reply) {
  if (themes.includes(request.params.theme)) {

    /* backward-compatible behavoir for v0.27.4 */
    if (COOKIES_DOMAIN) {
      /* this clears the theme cookie if it had the old domain attribute */
      reply.clearCookie(
        "theme",
        {
          ...cookieOptions(),
          domain: COOKIES_DOMAIN
          /* notice how we need to use `domain: ...` here to be able to clear the cookie
          before being able to update/recreate the cookie without `domain: ...` */
        }
      )
    }

    /* normal behavior */
    reply.setCookie(
      "theme",
      request.params.theme,
      cookieOptions()
    ).redirect("/settings");
  } else {
    reply.callNotFound()
  }
})

fastify.listen({
  port: PORT,
  host: HOST
}, function (error, address) {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  } else if (LOG_PRETTY == "true") {
    var link = address;
    link = link.replace("://[::]:", "://localhost:")
    link = link.replace("://127.0.0.1:", "://localhost:")
    console.log("Quizfreely-web is running at " + link);
  }
})

let cronClearLogsError = false;
if (CRON_CLEAR_LOGS == "true") {
  new Cron(CRON_CLEAR_LOGS_INTERVAL, async function () {
    try {
      cronClearLogsError = false;
        writeFile(
            path.join(import.meta.dirname, "quizfreely-web.log"),
            "",
            function () {
                fastify.log.info("ran cron job to clear log file")
            }
        )
    } catch (error) {
        cronClearLogsError = true;
        fastify.log.error(error, "error while trying to clear logs with cron job")
    }
  });
}
