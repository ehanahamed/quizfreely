import "dotenv/config"
import Fastify from "fastify";
import fastifyCompress from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifyCookie from "@fastify/cookie";
import path from "path";
import { Eta } from "eta";
import { themes } from "./themes.js";

const PORT = process.env.PORT
const HOST = process.env.HOST
const API_URL = process.env.API_URL
const COOKIES_DOMAIN = process.env.COOKIES_DOMAIN
const LOG_LEVEL = process.env.LOG_LEVEL

if (PORT == undefined || HOST == undefined) {
  console.error(
    "quizfreely/web/.env is missing or invalid \n" +
    "copy .env.example to .env"
  );
  process.exit(1);
}

const fastify = Fastify({
  logger: {
    level: LOG_LEVEL,
    file: path.join(import.meta.dirname, "quizfreely-web.log")
  }
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
  root: path.join(import.meta.dirname, "views"),
  //defaultContext: {}
});
await fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "assets"),
  prefix: "/assets/"
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
  reply.status(404).view("404.html", {
    ...themeData(request),
    apiUrl: API_URL
  })
})

fastify.get("/favicon.ico", function (request, reply) {
  reply.sendFile("favicon.ico", import.meta.dirname)
})
fastify.get("/icon.svg", function (request, reply) {
  reply.sendFile("icon.svg", import.meta.dirname)
})
fastify.get("/apple-touch-icon.ico", function (request, reply) {
  reply.sendFile("apple-touch-icon.ico", import.meta.dirname)
})

function themeData(request) {
  let theme = "auto";
  if (request.cookies.theme !== undefined && themes.includes(request.cookies.theme)) {
    theme = request.cookies.theme;
  }
  let themeCss = `<link rel="stylesheet" href="/assets/themes/${theme}.min.css" />`;
  if (theme == "custom") {
    themeCss = ""
  }
  return {
    theme: theme,
    themeCss: themeCss
  }
}

function landingPage(request, reply) {
  fetch(API_URL + "/public/list/featured?limit=3")
    .then(function (response) {
      response.json().then(function (responseJson) {
        if (responseJson.error) {
          reply.view("home.html", {
            ...themeData(request),
            apiUrl: API_URL,
            featuredRows: false
          });
        } else {
          reply.view("home.html", {
            ...themeData(request),
            apiUrl: API_URL,
            featuredRows: responseJson.data.rows
          });
        }
      });
    }).catch(function (error) {
      reply.view("home.html", {
        ...themeData(request),
        apiUrl: API_URL,
        featuredRows: false
      });
    });
}

function dashboard(request, reply) {
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
  ).view("dashboard.html", {
    ...themeDataObj,
    apiUrl: API_URL
  })
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
  reply.view("settings.html", {
    ...themeData(request),
    modal: "none",
    apiUrl: API_URL
  })
});
fastify.get("/sign-up", function (request, reply) {
  reply.view("account.html", {
    signup: true,
    apiUrl: API_URL,
    ...themeData(request)
  })
})

fastify.get("/sign-in", function (request, reply) {
  reply.view("account.html", {
    signup: false,
    apiUrl: API_URL,
    ...themeData(request)
  })
})

fastify.get("/edit", function (request, reply) {
  reply.view("edit.html", {
    ...themeData(request),
    apiUrl: API_URL,
  })
})

fastify.get("/privacy", function (request, reply) {
  reply.view("privacy.html", {
    ...themeData(request),
    apiUrl: API_URL,
  })
})

fastify.get("/terms", function (request, reply) {
  reply.view("tos.html", {
    ...themeData(request),
    apiUrl: API_URL,
  })
})

fastify.get("/tos", function (request, reply) {
  reply.view("tos.html", {
    ...themeData(request),
    apiUrl: API_URL,
  })
})

fastify.get("/explore", async function (request, reply) {
  /* this is async, remember to use `return reply.send()` instead of just `reply.send()` */
  try {
    let featuredRows = false;
    let featuredResponse = await (
      await fetch(API_URL + "/public/list/featured?limit=3")
    ).json();
    if (featuredResponse.error == false && featuredResponse.data) {
      featuredRows = featuredResponse.data.rows;
    } /* else, like if featuredResponse.error, featuredRows will stay false */
    
    let recentRows = false;
    let recentsResponse = await (
      await fetch(API_URL + "/public/list/recent?limit=3")
    ).json();
    if (recentsResponse.error == false && recentsResponse.data) {
      recentRows = recentsResponse.data.rows;
    }  /* if recentsResponse.error == true, recentRows will stay false */
    
    return reply.view("explore.html", {
        ...themeData(request),
        apiUrl: API_URL,
        featuredRows: featuredRows,
        recentRows: recentRows
    });
  } catch (error) {
    request.log.error(error);
    return reply.callNotFound();
  }
})

fastify.get("/studyset/create", function (request, reply) {
  reply.view("edit.html", {
    ...themeData(request),
    new: true,
    apiUrl: API_URL
  })
})

fastify.get("/studysets/:studyset", function (request, reply) {
  fetch(API_URL + "/public/studysets/" + request.params.studyset)
    .then(function (response) {
      response.json().then(function (responseJson) {
        if (responseJson.error) {
          reply.callNotFound()
        } else {
          reply.view("studyset.html", {
            ...themeData(request),
            ssr: true,
            local: false,
            studyset: responseJson.data.studyset,
            studysetId: request.params.studyset,
            studysetPage: "/studysets/" + request.params.studyset,
            studysetEditPage: "/studyset/edit/" + request.params.studyset,
            apiUrl: API_URL
          })
        }
      });
    }).catch(function (error) {
      request.log.error(error)
      reply.callNotFound();
    });
})

fastify.get("/studyset/private/:studyset", function (request, reply) {
  reply.view("studyset.html", {
    ...themeData(request),
    ssr: false,
    local: false,
    studysetId: request.params.studyset,
    studysetPage: "/studyset/private/" + request.params.studyset,
    studysetEditPage: "/studyset/edit/" + request.params.studyset,
    apiUrl: API_URL
  })
})

fastify.get("/studyset/local/:studyset", function (request, reply) {
  reply.view("studyset.html", {
    ...themeData(request),
    ssr: false,
    local: true,
    studysetId: request.params.studyset,
    studysetPage: "/studyset/local/" + request.params.studyset,
    studysetEditPage: "/studyset/edit-local/" + request.params.studyset,
    apiUrl: API_URL
  })
})

fastify.get("/studyset/edit/:studyset", function (request, reply) {
  reply.view("edit.html", {
    ...themeData(request),
    new: false,
    studysetId: request.params.studyset,
    apiUrl: API_URL
  })
})

fastify.get("/users/:userid", function (request, reply) {
  fetch(API_URL + "/public/users/" + request.params.userid)
    .then(function (response) {
      response.json().then(function (responseJson) {
        if (responseJson.error) {
          reply.callNotFound()
        } else {
          reply.view("user.html", {
            ...themeData(request),
            user: responseJson.data.user,
            apiUrl: API_URL
          })
        }
      });
    }).catch(function (error) {
      request.log.error(error)
      reply.callNotFound();
    });
})

fastify.get("/search", function (request, reply) {
  if (request.query && request.query.q) {
    fetch(
      API_URL + "/public/search/studysets?" + (new URLSearchParams({ q: request.query.q })).toString()
    ).then(function (response) {
      response.json().then(function (responseJson) {
        if (responseJson.error) {
          request.log.error(responseJson.error);
          reply.callNotFound();
        } else {
          reply.view("search.html", {
            ...themeData(request),
            query: request.query.q,
            results: responseJson.data.rows,
            apiUrl: API_URL
          })
        }
      })
    }).catch(function (error) {
      reply.callNotFound();
    })
  } else {
    reply.view("search.html", {
      ...themeData(request),
      query: false,
      apiUrl: API_URL
    })
  }
})

fastify.get("/discord", function (request, reply) {
  reply.redirect("https://discord.gg/6qQrybf6kG")
})

function cookieOptions() {
  let time = new Date();
  /* 100 days * 24h * 60m * 60s = 8640000 sec for 100 days */
  time.setSeconds(time.getSeconds() + 8640000)
  return {
    domain: COOKIES_DOMAIN,
    path: "/",
    signed: false,
    expires: time,
    maxAge: 8640000,
    httpOnly: true,
    sameSite: "lax",
    /* when secure is true,
    browsers only send the cookie through https,
    on localhost, browsers send it even if localhost isn't using https */
    secure: true
  }
}

fastify.get("/settings/themes/:theme", function (request, reply) {
  if (themes.includes(request.params.theme)) {
    reply.setCookie(
      "theme",
      request.params.theme,
      cookieOptions()
    ).redirect("/settings");
  } else {
    reply.callNotFound()
  }
})

fastify.get("/settings/clear-cookies", function (request, reply) {
  reply.clearCookie("theme", cookieOptions()).clearCookie("dashboard", cookieOptions()).view(
    "settings.html",
    {
      ...themeData(request),
      modal: "clearedCookies",
      apiUrl: API_URL
    }
  )
})

fastify.listen({
  port: PORT,
  host: HOST
})
