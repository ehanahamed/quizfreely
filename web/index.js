const port = 8080
/* for prod: "quizfreely.com" */
const domain = "localhost"
const apiUrl = "https://api.quizfreely.com"
const apiPublicKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzIzMDg5NjAwLAogICJleHAiOiAxODgwODU2MDAwCn0.G8CTyZfDfpzoQ5nRN58Se_NXFZFCmEHT6w_oBZwyy78"

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const path = require("node:path");

const HyperExpress = require("hyper-express");
const server = new HyperExpress.Server();

const LiveDirectory = require('live-directory');
const assets = new LiveDirectory(path.join(import.meta.dirname, "assets"), {
  cache: {
    max_file_count: 200,
    max_file_size: 1024 * 1024
  }
})

import { Eta } from "eta";
const eta = new Eta({
  tags: [
    "<eta>",
    "</eta>"
  ],
  varName: "data",
  views: path.join(import.meta.dirname, "views"),
})

const appwrite = require('node-appwrite');
/*const awadmin = new appwrite.Client();
awadmin
  .setEndpoint("https://api.quizfreely.com/v1")
  .setProject("quizfreely")
  .setKey(process.env.APPWRITE_API_KEY_SECRET);*/
const awclient = new appwrite.Client();
awclient
  .setEndpoint("https://api.quizfreely.com/v1")
  .setProject("quizfreely");

import { themes } from "./themes.js";

server.set_error_handler(
  function (request, response, error) {
    console.error(error);
    response.status(500).send(
      "500 Internal Server Error\n" +
      ":( \n Report this at https://github.com/ehanahamed/quizfreely/issues"
    )
  }
)

server.set_not_found_handler(
  function (request, response) {
    response.status(404).type("html").send(
      eta.render("404.eta", pageData(request))
    );
  }
)

server.get("/assets/*", function (request, response) {
  const path = request.path.replace("/assets", "");
  const file = assets.get(path);

  if (file === undefined) {
    return response.status(404).send();
  }

  const filepath = file.path.split(".");
  const ext = filepath[filepath.length - 1];

  const content = file.content;
  if (content instanceof Buffer) {
    return response.type(ext).send(content);
  } else {
    return response.type(ext).stream(content);
  }
})

function pageData(request) {
  let theme = "auto";
  if (request.cookies.theme !== undefined && themes.includes(request.cookies.theme)) {
    theme = request.cookies.theme;
  }
  let themeCss = `<link rel="stylesheet" href="/assets/themes/${theme}.css" />`;
  if (theme == "custom") {
    themeCss = ""
  }
  return {
    domain: domain,
    themes: JSON.stringify(themes),
    theme: theme,
    themeCss: themeCss
  }
}

function page(page) {
  return function (request, response) {
    response.type("html").send(
      eta.render(page, pageData(request))
    )
  }
}

server.get("/", page("home.eta"));
server.get("/home", page("home.eta"));
server.get("/home/", page("home.eta"));
server.get("/settings", page("settings.eta"));
server.get("/settings/", page("settings.eta"));
function signupPage(request, response) {
  response.type("html").send(
    eta.render(
      "account.eta",
      {
        signup: true,
        apiUrl: apiUrl,
        apiPublicKey: apiPublicKey,
        ...pageData(request)
      }
    )
  )
}
function loginPage(request, response) {
  response.type("html").send(
    eta.render(
      "account.eta",
      {
        signup: false,
        apiUrl: apiUrl,
        apiPublicKey: apiPublicKey,
        ...pageData(request)
      }
    )
  )
}

server.get("/signup", signupPage)
server.get("/sign-up", signupPage)
server.get("/login", loginPage)
server.get("/log-in", loginPage)
server.get("/signin", loginPage)
server.get("/sign-in", loginPage)

server.get(
  "/user/:username",
  function (request, response) {
    response.send("hai, you typed " + request.path_parameters.username)
  }
)

server.get(
  "/settings/themes/:theme",
  function (request, response) {
    if (themes.includes(request.path_parameters.theme)) {
      response.cookie(
        "theme",
        request.path_parameters.theme,
        /* expire time in milliseconds,
        100 days, 24hr per day, 60min per hour, 60sec per min, 1000 ms in a second */
        100 * 24 * 60 * 60 * 1000,
        {
          domain: domain,
          path: "/",
          /* expire time in seconds,
          100 days, 24hr/day, 60min/hour, 60sec/min */
          maxAge: 100 * 24 * 60 * 60,
          /* when secure is true,
          browsers only send the cookie through https,
          on localhost, browsers send it even if localhost isn't using https */
          secure: true,
          httpOnly: true,
          sameSite: "lax"
        }
      ).send("ok :3")
    } else {
      response.status(400).send("invalid request body :(")
    }
  }
)

server.listen(port);
