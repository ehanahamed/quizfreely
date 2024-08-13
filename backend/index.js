import cors from "@fastify/cors";
import supertokens from "supertokens-node";
import { plugin, errorHandler } from "supertokens-node/framework/fastify";
import formDataPlugin from "@fastify/formbody";
import Session from "supertokens-node/recipe/session";
import EmailPassword from"supertokens-node/recipe/emailpassword";
import ThirdParty from"supertokens-node/recipe/thirdparty";

import Fastify from "fastify";
let fastify = Fastify();

supertokens.init({
    framework: "fastify",
    supertokens: {
        // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connectionURI: "https://try.supertokens.com",
        // apiKey: <API_KEY(if configured)>,
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo
        appName: "Quizfreely",
        apiDomain: "http://localhost:8080",
        websiteDomain: "http://localhost:8008",
        apiBasePath: "/auth",
        websiteBasePath: "/auth"
    },
    recipeList: [
        EmailPassword.init(),
        //ThirdParty.init({/*TODO: See next step*/}),
        Session.init() // initializes session features
    ]
});
fastify.register(plugin);

fastify.setErrorHandler(errorHandler());

fastify.register(cors, {
    origin: "http://localhost:8008",
    allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
});
fastify.register(formDataPlugin);

fastify.listen({
  port: 8080
})
