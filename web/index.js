import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import path from "path";
import { Eta } from "eta";
import { themes } from "./themes.js";

const port = 8080
/* for prod: "quizfreely.com" */
const domain = "localhost"
const apiUrl = "https://api.quizfreely.com"
const apiPublicKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzIzNTIxNjAwLAogICJleHAiOiAxODgxMjg4MDAwCn0.pwb3AzlkbzhG-OTbadLZzSdu6piEkss7WWYEMeFipj0"

const fastify = Fastify({
  logger: true
})

const eta = new Eta({
  tags: [
    "<eta>",
    "</eta>"
  ],
  varName: "data",
  defaultExtension: ".html"
})

fastify.register(fastifyCookie);
fastify.register(fastifyView, {
  engine: {
    eta
  },
  root: path.join(import.meta.dirname, "views"),
  defaultContext: {
    themes: JSON.stringify(themes)
  }
})

fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "assets"),
  prefix: "/assets/"
})

fastify.setErrorHandler(function (error, request, reply) {
  this.log.error(error)
  reply.status(500).send(
    "500 Internal Server Error\n" +
    ":(\n" +
    "Report this at https://github.com/ehanahamed/quizfreely/issues"
  )
})

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).view("404.html", {
    ...themeData(request)
  })
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

function homepage(request, reply) {
  if (request.cookies.dashboard == "true") {
    reply.view("dashboard.html", {
      ...themeData(request)
    });
  } else {
    reply.view("home.html", {
      ...themeData(request)
    });
  }
}

fastify.get("/", homepage);
fastify.get("/home", homepage);
fastify.get("/dashboard", function (request, reply) {
  let time = new Date();
    /* 100 days * 24h * 60m * 60s = 8640000 sec for 100 days */
    time.setSeconds(time.getSeconds() + 8640000)
    reply.setCookie(
      "dashboard",
      "true",
      {
        domain: domain,
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
    ).view("dashboard.html", {
      ...themeData(request)
    })
});
fastify.get("/settings", function (request, reply) {
  reply.view("settings.html", {
    ...themeData(request)
  })
});
fastify.get("/sign-up", function (request, reply) {
  reply.view("/account.html", {
    signup: true,
    apiUrl: apiUrl,
    apiPublicKey: apiPublicKey,
    ...themeData(request)
  })
})

fastify.get("/sign-in", function (request, reply) {
  reply.view("/account.html", {
    signup: false,
    apiUrl: apiUrl,
    apiPublicKey: apiPublicKey,
    ...themeData(request)
  })
})

fastify.get("/settings/themes/:theme", function (request, reply) {
  if (themes.includes(request.params.theme)) {
    let time = new Date();
    /* 100 days * 24h * 60m * 60s = 8640000 sec for 100 days */
    time.setSeconds(time.getSeconds() + 8640000)
    reply.setCookie(
      "theme",
      request.params.theme,
      {
        domain: domain,
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
    ).send("ok :3")
  } else {
    reply.status(400).send("invalid request body :(")
  }
})

fastify.listen({
  port: port
})
