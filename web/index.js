import "dotenv/config"

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const path = require("node:path");

const HyperExpress = require("hyper-express");
const server = new HyperExpress.Server();

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

server.set_error_handler(
  function (request, response, error) {
    response.status(500).send(
      "500 Internal Server Error\n" +
      ":( \n Report this at https://github.com/ehanahamed/quizfreely/issues"
    )
  }
)

server.set_not_found_handler(
  function (request, response) {
    response.status(404).type("html").send(
      eta.render("./404.eta")
    )
  }
)

function homepage(request, response) {
  response.type("html").send(
    eta.render("./home.eta", {
      theme: request.cookies.theme
    })
  )
}

server.get("/", homepage);
server.get("/home", homepage);
server.get("/home/", homepage);

server.get(
  "/user/:username",
  function (request, response) {
    response.send("hai, you typed " + request.path_parameters.username)
  }
)

server.get(
  "/settings/theme/:theme",
  function (request, response) {
    response.cookie(
      "theme",
      request.path_parameters.theme,
      /* expire time in milliseconds,
      365 days, 24 hours per day, 60 mins per hour, 60 seconds per minute, 1000 milliseconds in a second */
      365 * 24 * 60 * 60 * 1000
    ).send(
      "ok :3"
    )
  }
)

server.listen(8080);
