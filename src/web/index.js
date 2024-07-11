import { Eta } from "eta"

const eta = new Eta({
  views: import.meta.dir + '/views/',
  cache: true
})

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      const headers = new Headers();
      headers.append("Content-Type", "text/html");
      return new Response(
        eta.render(
          "home"
        ),
        {
          headers: headers
        }
      );
    }
    return new Response(
      eta.render(
        "404"
      )
    );
  },
});
