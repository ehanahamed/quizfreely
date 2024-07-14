import { createRequire } from "module";
const require = createRequire(import.meta.url);
const HyperExpress = require('hyper-express');
const server = new HyperExpress.Server();

import vento from "ventojs";
const vto = vento({
  dataVarname: "data",
  useWith: false,
});

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
