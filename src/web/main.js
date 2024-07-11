import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.0.3/src/index.ts"

const app = new Application();
const router = new Router();

let viewpath = Deno.cwd()+'/views/'
let eta = new Eta({ views: viewpath, cache: true })

router.get("/", function (ctx) {
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = eta.render(
        "home",
        {
            foo: "world"
        }
    )
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(
    {
        port: 8080
    }
);
