import express from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3030",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(middleware());

supertokens.init({
  framework: "express",
  supertokens: {
    // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: "https://try.supertokens.com",
    // apiKey: <API_KEY(if configured)>,
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "Quizfreely",
    apiDomain: process.env.SUPERTOKENS_API_DOMAIN,
    websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        {
          thirdPartyId: "google",
          clients: [
            {
              clientId: process.env.SUPERTOKENS_GOOGLE_CLIENT_ID,
              clientSecret: process.env.SUPERTOKENS_GOOGLE_CLIENT_SECRET,
            },
          ],
        },
      ],
    }), // initializes signin / sign up features
    Session.init(), // initializes session features
  ],
});

app.use(errorHandler());
