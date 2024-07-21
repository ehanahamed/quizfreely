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
  views: path.join(import.meta.dirname, "views"),
  defaultExtension: ".html"
})

const appwrite = require('node-appwrite');
const awadmin = new appwrite.Client();
awadmin
  .setEndpoint("https://api.quizfreely.com/v1")
  .setProject("quizfreely")
  .setKey(process.env.API_KEY_SECRET);
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
    response.status(404).type("html");
    vto.run("./templates/404.vto", {}).then(
      function (result) {
        response.send(
          result.content
        )
      }
    )
  }
)

function homepage(request, response) {
  response.type("html");
  vto.run("./templates/home.vto", {}).then(
    function (result) {
      response.send(
        result.content
      )
    }
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

server.listen(8080);
