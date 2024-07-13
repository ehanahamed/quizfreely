import { Eta } from "eta";

const eta = new Eta({
  views: import.meta.dir + '/views/',
  cache: true
});

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    const headersHtml = new Headers();
    headersHtml.append("Content-Type", "text/html; charset=UTF-8");
    if (
      (url.pathname == "/") ||
      (url.pathname == "/home")
    ) {
      return new Response(
        eta.render(
          "home"
        ),
        { headers: headersHtml }
      );
    } else if (
      url.pathname.startsWith()
    ) {

    } else {
      return new Response(
        eta.render(
          "404"
        ),
        { headers: headersHtml }
      );
    }
  },
});
