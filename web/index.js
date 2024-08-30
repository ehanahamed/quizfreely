import "dotenv/config"
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifyCookie from "@fastify/cookie";
import fastifyRateLimit from "@fastify/rate-limit";
import path from "path";
import { Eta } from "eta";
import { createClient } from '@supabase/supabase-js'
import { themes } from "./themes.js";

const port = process.env.PORT
const host = process.env.HOST
const apiUrl = process.env.API_URL
const cookiesDomain = process.env.COOKIES_DOMAIN
const logLevel = process.env.LOG_LEVEL

const fastify = Fastify({
  logger: {
    level: logLevel,
    file: path.join(import.meta.dirname, "logfile.log")
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

await fastify.register(fastifyCookie);
await fastify.register(fastifyView, {
  engine: {
    eta
  },
  root: path.join(import.meta.dirname, "views"),
  //defaultContext: {}
});
await fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute"
});
await fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "assets"),
  prefix: "/assets/"
});

fastify.setErrorHandler(function (error, request, reply) {
  request.log.error("500 at " + request.url)
  request.log.error(error)
  reply.status(500).send(
    "500 Internal Server Error\n" +
    ":(\n" +
    "Report this at https://github.com/ehanahamed/quizfreely/issues"
  )
})

fastify.setNotFoundHandler(function (request, reply) {
  request.log.warn("404 at " + request.url)
  reply.status(404).view("404.html", {
    ...themeData(request)
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
  let themeCss = `<link rel="stylesheet" href="/assets/themes/${theme}.css" />`;
  if (theme == "custom") {
    themeCss = ""
  }
  return {
    theme: theme,
    themeCss: themeCss
  }
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
    apiUrl: apiUrl
  })
}

function homepage(request, reply) {
  if (request.cookies.dashboard == "true") {
    dashboard(request, reply);
  } else {
    reply.view("home.html", {
      ...themeData(request)
    });
  }
}

fastify.get("/", homepage);
fastify.get("/home", homepage);
fastify.get("/dashboard", dashboard);
fastify.get("/settings", function (request, reply) {
  reply.view("settings.html", {
    ...themeData(request),
    modal: "none"
  })
});
fastify.get("/sign-up", function (request, reply) {
  reply.view("account.html", {
    signup: true,
    apiUrl: apiUrl,
    ...themeData(request)
  })
})

fastify.get("/sign-in", function (request, reply) {
  reply.view("account.html", {
    signup: false,
    apiUrl: apiUrl,
    ...themeData(request)
  })
})

fastify.get("/edit", function (request, reply) {
  reply.view("edit.html", {
    ...themeData(request)
  })
})

fastify.get("/privacy", function (request, reply) {
  reply.view("privacy.html", {
    ...themeData(request)
  })
})

function cookieOptions() {
  let time = new Date();
  /* 100 days * 24h * 60m * 60s = 8640000 sec for 100 days */
  time.setSeconds(time.getSeconds() + 8640000)
  return {
    domain: cookiesDomain,
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
    ).view("settings.html", {
      ...themeData({ cookies: { theme: request.params.theme }}),
      modal: "none"
    })
  } else {
    reply.callNotFound()
  }
})

fastify.get("/settings/clear-cookies", function (request, reply) {
  reply.clearCookie("theme", cookieOptions()).clearCookie("dashboard", cookieOptions()).view(
    "settings.html",
    {
      ...themeData(request),
      modal: "clearedCookies"
    }
  )
})

fastify.get("/studysets/:studyset", function (request, reply) {
  fetch(apiUrl + "/studysets/public/" + request.params.studyset)
    .then(function (response) {
      response.json().then(function (responseJson) {
        if (responseJson.error) {
          reply.callNotFound()
        } else {
          reply.view("studyset.html", {
            ...themeData(request),
            studyset: responseJson.data.studyset,
            apiUrl: apiUrl
          })
        }
      });
    }).catch(function (error) {
      request.log.error(error)
      reply.callNotFound();
    });
})

fastify.listen({
  port: port,
  host: host
})
