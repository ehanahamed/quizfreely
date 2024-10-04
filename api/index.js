import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyOauth2 from "@fastify/oauth2";
import pg from "pg";
const { Pool, Client } = pg;
import path from "path";
import { Cron } from "croner";

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const API_URL = process.env.API_URL;
const POSTGRES_URI = process.env.POSTGRES_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const LOG_LEVEL = process.env.LOG_LEVEL;
const OAUTH_GOOGLE_ID = process.env.OAUTH_GOOGLE_CLIENT_ID;
const OAUTH_GOOGLE_SECRET = process.env.OAUTH_GOOGLE_CLIENT_SECRET;
const WEB_OAUTH_CALLBACK = process.env.WEB_OAUTH_CALLBACK_URL;

if (PORT == undefined || HOST == undefined) {
    console.error(
        "quizfreely/api/.env is missing or invalid \n" +
        "copy .env.example to .env"
    );
    process.exit(1);
}

const fastify = Fastify({
    logger: {
        level: LOG_LEVEL,
        file: path.join(import.meta.dirname, "quizfreely-api.log")
    }
})

const pool = new Pool({
    connectionString: POSTGRES_URI
})

await fastify.register(fastifyCors, {
    origin: CORS_ORIGIN
});
await fastify.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["openid", "profile", "email"],
    credentials: {
      client: {
        id: OAUTH_GOOGLE_ID,
        secret: OAUTH_GOOGLE_SECRET
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: "/oauth/google",
    callbackUri: API_URL + "/oauth/google/callback",
    cookie: {
        path: "/",
        secure: true,
        sameSite: "lax",
        httpOnly: true
    },
    pkce: "S256"
})

fastify.setErrorHandler(function (error, request, reply) {
    request.log.error(error)
    reply.code(500).send({
        error: {
            type: "server-error"
        }
    })
})

fastify.setNotFoundHandler(function (request, reply) {
  reply.code(404).send({
    error: {
        type: "not-found"
    }
  })
})

fastify.post("/sign-up", async function (request, reply) {
    /* check if username and password were sent in sign-up request body */
    if (request.body && request.body.username && request.body.password) {
        if (request.body.password.length >= 8) {
            let username = request.body.username;
             /* regex to check if username has letters (any alphabet, but no uppercase) or numbers (any alphabet) or dot, underscore, or dash */
            if (/^(?!.*\p{Lu})[\p{L}\p{M}\p{N}._-]+$/u.test(username) && username.length >= 2 && username.length < 100) {
                let client = await pool.connect();
                try {
                    await client.query("BEGIN");
                    await client.query("set role quizfreely_auth");
                    let result = await client.query(
                        "select username from auth.users where username = $1 limit 1",
                        [username]
                    );
                    if (result.rows.length == 0) {
                        let result2 = await client.query(
                            "insert into auth.users (username, encrypted_password, display_name) " +
                            "values ($1, crypt($2, gen_salt('bf')), $1) returning id",
                            [username, request.body.password]
                        );
                        let userId = result2.rows[0].id;
                        let session = await client.query(
                            "insert into auth.sessions (user_id) values ($1) returning token, user_id",
                            [userId]
                        );
                        await client.query("COMMIT");
                        return reply.send({
                            error: false,
                            data: {
                                user: {
                                    id: userId,
                                    username: username,
                                    displayName: username
                                },
                            },
                            auth: session.rows[0].token
                        })
                    } else {
                        await client.query("ROLLBACK");
                        return reply.code(400).send({
                            error: {
                                type: "username-taken"
                            }
                        })
                    }
                } catch (error) {
                    await client.query("ROLLBACK");
                    request.log.error(error);
                    return reply.code(500).send({
                        error: {
                            type: "db-error"
                        }
                    })
                } finally {
                    /* finally block will execute even though we put return statements in try block or catch block
                    which is good for our use case :D */
                    client.release();
                }
            } else {
                /* username does not match regex or does not match length */
                return reply.code(400).send(
                    {
                        error: {
                            type: "username-invalid"
                        }
                    }
                )
            }
        } else {
            return reply.code(400).send({
                error: {
                    type: "password-weak"
                }
            })
        }
    } else {
        /* password and/or username missing in request.body */
        return reply.code(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

fastify.post("/sign-in", async function (request, reply) {
    if (request.body && request.body.username && request.body.password) {
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let result = await client.query(
                "select id, username, display_name from auth.users " +
                "where username = $1 and encrypted_password = crypt($2, encrypted_password) limit 1",
                [request.body.username, request.body.password]
            )
            if (result.rows.length == 1) {
                let session = await client.query(
                    "insert into auth.sessions (user_id) values ($1) returning token, user_id",
                    [result.rows[0].id]
                )
                await client.query("COMMIT");
                return reply.send({
                    error: false,
                    data: {
                        user: {
                            id: result.rows[0].id,
                            username: result.rows[0].username,
                            displayName: result.rows[0].display_name
                        },
                    },
                    auth: session.rows[0].token
                })
            } else {
                await client.query("ROLLBACK");
                return reply.code(400).send({
                    error: {
                        type: "sign-in-incorrect"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release();
        }
    } else {
        /* password and/or username missing in request.body */
        return reply.code(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

async function googleAuthCallback(tokenObj) {
    try {
        let response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + tokenObj.access_token
            }
          }
        );
        let userinfo = await response.json();
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let upsertedUser = await client.query(
                "insert into auth.users (display_name, auth_type, oauth_google_id, oauth_google_email) " +
                "values ($1, 'oauth-google', $2, $3) on conflict (oauth_google_id) do update " +
                "set oauth_google_email = $3 returning id, display_name",
                [
                    userinfo.name,
                    userinfo.id,
                    userinfo.email
                ]
            );
            let newSession = await client.query(
                /* 10-second-expiry token sent in url searchparams to let client request a new normal-expiry token */
                "insert into auth.sessions (user_id, expire_at) values ($1, clock_timestamp() + '10 seconds'::interval) returning id, token",
                [upsertedUser.rows[0].id]
            )
            await client.query("COMMIT");
            return {
                error: false,
                data: {
                    user: {
                        id: upsertedUser.rows[0].id,
                        displayName: upsertedUser.rows[0].id
                    },
                },
                auth: newSession.rows[0].token
            }
        } catch (error) {
            await client.query("ROLLBACK");
            return {
                error: {
                    type: "db-error",
                    error: error
                }
            }
        } finally {
            client.release();
        }
    } catch (error) {
        return {
            error: {
                type: "fetch-error",
                error: error
            }
        }
    }
}

fastify.get('/oauth/google/callback', function (request, reply) {
    // Note that in this example a "reply" is also passed, it's so that code verifier cookie can be cleaned before
    // token is requested from token endpoint
    fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request, reply, function (error, result) {
        if (error) {
            request.log.error(error);
            reply.redirect(WEB_OAUTH_CALLBACK + "?error=oauth-error");
        } else {
            googleAuthCallback(result.token).then(
                function (result) {
                    if (result.error) {
                        request.log.error(result.error.error)
                        reply.redirect(WEB_OAUTH_CALLBACK + "?error=oauth-error")
                    } else {
                        reply.redirect(WEB_OAUTH_CALLBACK + "?" + (new URLSearchParams({ token: result.auth }).toString()))
                    }
                }
            )
        }
    })
})

fastify.post("/session/refresh", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let session = await client.query(
                "select token, user_id from auth.verify_and_refresh_session($1)",
                [ authToken ]
            );
            if (session.rows.length == 1) {
                await client.query("COMMIT")
                return reply.send({
                    "error": false,
                    "data": {}, 
                    auth: session.rows[0].token
                })
            } else {
                await client.query("ROLLBACK");
                return reply.code(401).send({
                    error: {
                        type: "session-invalid"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release()
        }
    } else {
        /*
            401 Unauthorized means the client is NOT logged in or authenticated
            403 Forbidden means the client is logged in but not allowed,
            so in this case we're responding with a 401 if our Authentication header is missing
        */
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.post("/user", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let session = await client.query(
                "select token, user_id from auth.verify_and_refresh_session($1)",
                [ authToken ]
            );
            if (session.rows.length == 1) {
                let userData = await client.query(
                    "select id, username, display_name from public.profiles " +
                    "where id = $1",
                    [
                        session.rows[0].user_id
                    ]
                );
                if (userData.rows.length == 1) {
                    await client.query("COMMIT");
                    return reply.send({
                        "error": false,
                        "data": {
                            user: {
                                id: userData.rows[0].id,
                                username: userData.rows[0].username,
                                displayName: userData.rows[0].display_name
                            },
                        },
                        auth: session.rows[0].token
                    })
                } else {
                    await client.query("ROLLBACK");
                    return reply.callNotFound();
                }
            } else {
                await client.query("ROLLBACK");
                return reply.code(401).send({
                    error: {
                        type: "session-invalid"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release()
        }
    } else {
        /*
            401 Unauthorized means the client is NOT logged in or authenticated
            403 Forbidden means the client is logged in but not allowed,
            so in this case we're responding with a 401 if our Authentication header is missing
        */
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.post("/user-auth-info", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let session = await client.query(
                "select token, user_id from auth.verify_and_refresh_session($1)",
                [ authToken ]
            );
            if (session.rows.length == 1) {
                let userData = await client.query(
                    "select id, username, display_name, auth_type, oauth_google_email from auth.users " +
                    "where id = $1",
                    [
                        session.rows[0].user_id
                    ]
                );
                if (userData.rows.length == 1) {
                    await client.query("COMMIT");
                    return reply.send({
                        "error": false,
                        "data": {
                            user: {
                                id: userData.rows[0].id,
                                username: userData.rows[0].username,
                                displayName: userData.rows[0].display_name,
                                authType: userData.rows[0].auth_type,
                                oauthGoogleEmail: userData.rows[0].oauth_google_email
                            },
                        },
                        auth: session.rows[0].token
                    })
                } else {
                    await client.query("ROLLBACK");
                    return reply.callNotFound();
                }
            } else {
                await client.query("ROLLBACK");
                return reply.code(401).send({
                    error: {
                        type: "session-invalid"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release()
        }
    } else {
        /*
            401 Unauthorized means the client is NOT logged in or authenticated
            403 Forbidden means the client is logged in but not allowed,
            so in this case we're responding with a 401 if our Authentication header is missing
        */
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.post("/studysets/create", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        if (
            request.body &&
            request.body.studyset &&
            request.body.studyset.title &&
            (
                request.body.studyset.private === true || 
                request.body.studyset.private === false
            ) &&
            request.body.studyset.data
        ) {
            let studysetTitle = request.body.studyset.title || "Untitled Studyset";
            let client = await pool.connect();
            try {
                await client.query("BEGIN");
                await client.query("set role quizfreely_auth");
                let session = await client.query(
                    "select token, user_id from auth.verify_and_refresh_session($1)",
                    [ authToken ]
                );
                if (session.rows.length == 1) {
                    await client.query("set role quizfreely_auth_user");
                    await client.query("select set_config('quizfreely_auth.user_id', $1, true)", [session.rows[0].user_id]);
                    let insertedStudyset = await client.query(
                        "insert into public.studysets (user_id, title, private, data, terms_count) " +
                        "values ($1, $2, $3, $4, $5) returning id, user_id, title, private, terms_count, updated_at",
                        [
                            session.rows[0].user_id,
                            studysetTitle,
                            request.body.studyset.private,
                            request.body.studyset.data,
                            /* we use optional chaining (that .?) and nullish coalescing (that ??) to default to 0 (without throwing an error) if terms or terms.length are undefined */
                            request.body.studyset.data?.terms?.length ?? 0
                        ]
                    );
                    await client.query("COMMIT")
                    return reply.send({
                        "error": false,
                        "data": {
                            studyset: {
                                id: insertedStudyset.rows[0].id,
                                userId: insertedStudyset.rows[0].user_id,
                                title: insertedStudyset.rows[0].title,
                                private: insertedStudyset.rows[0].private,
                                termsCount: insertedStudyset.rows[0].terms_count,
                                updatedAt: insertedStudyset.rows[0].updated_at
                            },
                        },
                        auth: session.rows[0].token
                    })
                } else {
                    await client.query("ROLLBACK");
                    return reply.code(401).send({
                        error: {
                            type: "session-invalid"
                        }
                    })
                }
            } catch (error) {
                await client.query("ROLLBACK");
                request.log.error(error);
                return reply.code(500).send({
                    error: {
                        type: "db-error"
                    }
                })
            } finally {
                client.release()
            }
        } else {
            return reply.code(400).send({
                error: {
                    type: "fields-missing"
                }
            })
        }
    } else {
        /*
            401 Unauthorized means the client is NOT logged in or authenticated
            403 Forbidden means the client is logged in but not allowed,
            so in this case we're responding with a 401 if our Authentication header is missing
        */
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.post("/studysets/update/:studysetid", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        if (
            request.body &&
            request.body.studyset &&
            request.body.studyset.title &&
            (
                request.body.studyset.private === true || 
                request.body.studyset.private === false
            ) &&
            request.body.studyset.data
        ) {
            let studysetTitle = request.body.studyset.title || "Untitled Studyset";
            let client = await pool.connect();
            try {
                await client.query("BEGIN");
                await client.query("set role quizfreely_auth");
                let session = await client.query(
                    "select token, user_id from auth.verify_and_refresh_session($1)",
                    [ authToken ]
                );
                if (session.rows.length == 1) {
                    await client.query("set role quizfreely_auth_user");
                    await client.query("select set_config('quizfreely_auth.user_id', $1, true)", [session.rows[0].user_id]);
                    let updatedStudyset = await client.query(
                        "update public.studysets set title = $2, private = $3, data = $4, terms_count = $5, updated_at = clock_timestamp() " +
                        "where id = $1 returning id, user_id, title, private, terms_count, updated_at",
                        [
                            request.params.studysetid,
                            studysetTitle,
                            request.body.studyset.private,
                            request.body.studyset.data,
                            /* we use optional chaining (that .?) and nullish coalescing (that ??) to default to 0 (without throwing an error) if terms or terms.length are undefined */
                            request.body.studyset.data?.terms?.length ?? 0
                        ]
                    );
                    if (updatedStudyset.rows.length == 1) {
                        await client.query("COMMIT")
                        return reply.send({
                            "error": false,
                            "data": {
                                studyset: {
                                    id: updatedStudyset.rows[0].id,
                                    userId: updatedStudyset.rows[0].user_id,
                                    title: updatedStudyset.rows[0].title,
                                    private: updatedStudyset.rows[0].private,
                                    termsCount: updatedStudyset.rows[0].terms_count,
                                    updatedAt: updatedStudyset.rows[0].updated_at
                                }
                            },
                            auth: session.rows[0].token
                        })
                    } else {
                        await client.query("ROLLBACK");
                        return reply.callNotFound();
                    }
                } else {
                    await client.query("ROLLBACK");
                    return reply.code(401).send({
                        error: {
                            type: "session-invalid"
                        }
                    })
                }
            } catch (error) {
                await client.query("ROLLBACK");
                request.log.error(error);
                return reply.code(500).send({
                    error: {
                        type: "db-error"
                    }
                })
            } finally {
                client.release()
            }
        } else {
            return reply.code(400).send({
                error: {
                    type: "fields-missing"
                }
            })
        }
    } else {
        /*
            401 Unauthorized means the client is NOT logged in or authenticated
            403 Forbidden means the client is logged in but not allowed,
            so in this case we're responding with a 401 if our Authentication header is missing
        */
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.post("/studysets/delete/:studysetid", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let session = await client.query(
                "select token, user_id from auth.verify_and_refresh_session($1)",
                [ authToken ]
            );
            if (session.rows.length == 1) {
                await client.query("set role quizfreely_auth_user");
                await client.query("select set_config('quizfreely_auth.user_id', $1, true)", [session.rows[0].user_id]);
                await client.query(
                    "delete from public.studysets " +
                    "where id = $1",
                    [
                        request.params.studysetid
                    ]
                );
                await client.query("COMMIT")
                return reply.send({
                    "error": false,
                    "data": {},
                    auth: session.rows[0].token
                })
            } else {
                await client.query("ROLLBACK");
                return reply.code(401).send({
                    error: {
                        type: "session-invalid"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release()
        }
    } else {
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.post("/studysets/view/:studysetid", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let session = await client.query(
                "select token, user_id from auth.verify_and_refresh_session($1)",
                [ authToken ]
            );
            if (session.rows.length == 1) {
                await client.query("set role quizfreely_auth_user");
                await client.query("select set_config('quizfreely_auth.user_id', $1, true)", [session.rows[0].user_id]);
                let selectedStudyset = await client.query(
                    "select id, user_id, title, private, data, updated_at from public.studysets " +
                    "where id = $1",
                    [
                        request.params.studysetid
                    ]
                );
                if (selectedStudyset.rows.length == 1) {
                    await client.query("COMMIT")
                    return reply.send({
                        "error": false,
                        "data": {
                            studyset: {
                                id: selectedStudyset.rows[0].id,
                                userId: selectedStudyset.rows[0].user_id,
                                title: selectedStudyset.rows[0].title,
                                data: selectedStudyset.rows[0].data,
                                private: selectedStudyset.rows[0].private,
                                updatedAt: selectedStudyset.rows[0].updated_at
                            }
                        },
                        auth: session.rows[0].token
                    })
                } else {
                    await client.query("ROLLBACK");
                    return reply.callNotFound();
                }
            } else {
                await client.query("ROLLBACK");
                return reply.code(401).send({
                    error: {
                        type: "session-invalid"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release()
        }
    } else {
        return reply.code(400).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.get("/studysets/public/:studysetid", async function (request, reply) {
    try {
        let result = await pool.query(
            "select s.id, s.user_id, u.display_name, s.title, s.data, s.updated_at, s.terms_count " +
            "from public.studysets s inner join public.profiles u on s.user_id = u.id " +
            "where s.id = $1 and s.private = false limit 1",
            [request.params.studysetid]
        )
        if (result.rows.length == 1) {
            return reply.send({
                error: false,
                data: {
                    studyset: result.rows[0]
                }
            })
        } else {
            return reply.callNotFound();
        }
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
            error: {
                type: "db-error"
            }
        })
    }
})

fastify.post("/studysets/list", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        let client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("set role quizfreely_auth");
            let session = await client.query(
                "select token, user_id from auth.verify_and_refresh_session($1)",
                [ authToken ]
            );
            if (session.rows.length == 1) {
                await client.query("set role quizfreely_auth_user");
                await client.query("select set_config('quizfreely_auth.user_id', $1, true)", [session.rows[0].user_id]);
                let studysets = await client.query(
                    "select id, user_id, title, private, updated_at from public.studysets " +
                    "where user_id = $1 order by updated_at desc limit 100",
                    [
                        session.rows[0].user_id
                    ]
                );
                await client.query("COMMIT");
                return reply.send({
                    "error": false,
                    "data": {
                        rows: studysets.rows,
                    },
                    auth: session.rows[0].token
                })
            } else {
                await client.query("ROLLBACK");
                return reply.code(401).send({
                    error: {
                        type: "session-invalid"
                    }
                })
            }
        } catch (error) {
            await client.query("ROLLBACK");
            request.log.error(error);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        } finally {
            client.release()
        }
    } else {
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.get("/users/:userid", async function (request, reply) {
    try {
        let result = await pool.query(
            "select id, username, display_name from public.profiles " +
            "where id = $1",
            [request.params.userid]
        )
        if (result.rows.length == 1) {
            return reply.send({
                error: false,
                data: {
                    user: {
                        id: result.rows[0].id,
                        username: result.rows[0].username,
                        displayName: result.rows[0].display_name
                    }
                }
            })
        } else {
            return reply.callNotFound();
        }
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
            error: {
                type: "db-error"
            }
        })
    }
})

fastify.post("/user/update", async function (request, reply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.toLowerCase().startsWith("bearer ")
    ) {
        /* "Bearer " (with space) is 6 characters, so 7 is where our token starts */
        let authToken = request.headers.authorization.substring(7);
        if (
            request.body &&
            request.body.user &&
            (request.body.user.displayName /* || request.body.user. */)
        ) {
            let client = await pool.connect();
            try {
                await client.query("BEGIN");
                await client.query("set role quizfreely_auth");
                let session = await client.query(
                    "select token, user_id from auth.verify_and_refresh_session($1)",
                    [ authToken ]
                );
                if (session.rows.length == 1) {
                    if (request.body.user.displayName) {
                        let userData = await client.query(
                            "update auth.users set display_name = $2 " +
                            "where id = $1 returning id, username, display_name",
                            [
                                session.rows[0].user_id,
                                request.body.user.displayName
                            ]
                        );
                        if (userData.rows.length == 1) {
                            await client.query("COMMIT");
                            return reply.send({
                                "error": false,
                                "data": {
                                    user: {
                                        id: userData.rows[0].id,
                                        username: userData.rows[0].username,
                                        displayName: userData.rows[0].display_name
                                    }
                                },
                                auth: session.rows[0].token
                            })
                        } else {
                            await client.query("ROLLBACK");
                            return reply.callNotFound();
                        }
                    }
                    /* using if, NOT using else, so we can update multiple OR just one value in a reqeust */
                    // if (request.body.user. ) {
                    //
                    // }
                } else {
                    await client.query("ROLLBACK");
                    return reply.code(401).send({
                        error: {
                            type: "session-invalid"
                        }
                    })
                }
            } catch (error) {
                await client.query("ROLLBACK");
                request.log.error(error);
                return reply.code(500).send({
                    error: {
                        type: "db-error"
                    }
                })
            } finally {
                client.release()
            }
        } else {
            return reply.code(400).send({
                error: {
                    type: "fields-missing"
                }
            })
        }
    } else {
        return reply.code(401).send({
            error: {
                type: "auth-header-missing"
            }
        })
    }
})

fastify.get("/studysets/search", async function (request, reply) {
    if (request.query && request.query.q) {
        try {
            let result = await pool.query(
                "select s.id, s.user_id, u.display_name, s.title, s.updated_at, s.terms_count " +
                "from public.studysets s inner join public.profiles u on s.user_id = u.id " +
                "where tsvector_title @@ websearch_to_tsquery('english', $1)",
                [
                    request.query.q
                ]
            )
            return reply.send({
                error: false,
                data: {
                    rows: result.rows
                }
            })
        } catch (error) {
            /* on error, try again before actually error-ing */
            try {
                let result = await pool.query(
                    "select s.id, s.user_id, u.display_name, s.title, s.updated_at, s.terms_count " +
                    "from public.studysets s inner join public.profiles u on s.user_id = u.id " +
                    "where tsvector_title @@ websearch_to_tsquery('english', $1)",
                    [
                        request.query.q
                    ]
                )
                return reply.send({
                    error: false,
                    data: {
                        rows: result.rows
                    }
                })
            } catch (error2) {
                request.log.error(error2);
                return reply.code(500).send({
                    error: {
                        type: "db-error"
                    }
                })
            }
        }
    } else {
        return reply.code(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

fastify.get("/studysets/list-recent", async function (request, reply) {
    try {
        let result = await pool.query(
            "select s.id, s.user_id, u.display_name, s.title, s.updated_at, s.terms_count " +
            "from public.studysets s inner join public.profiles u on s.user_id = u.id " +
            "order by s.updated_at desc limit 3"
        )
        return reply.send({
            error: false,
            data: {
                rows: result.rows
            }
        })
    } catch (error) {
        /* try again (once) */
        try {
            let result = await pool.query(
                "select s.id, s.user_id, u.display_name, s.title, s.updated_at, s.terms_count " +
                "from public.studysets s inner join public.profiles u on s.user_id = u.id " +
                "order by s.updated_at desc limit 3"
            )
            return reply.send({
                error: false,
                data: {
                    rows: result.rows
                }
            })
        } catch (error2) {
            request.log.error(error2);
            return reply.code(500).send({
                error: {
                    type: "db-error"
                }
            })
        }
    }
})

fastify.get("/featured/list", async function (request, reply) {
    try {
        let result = await pool.query(
            "select s.id, s.user_id, u.display_name, s.title, s.updated_at, s.terms_count " +
            "from public.studysets s inner join public.profiles u on s.user_id = u.id " +
            "where s.featured = true order by s.updated_at desc limit 3"
        )
        if (result.rows.length >= 1) {
            return reply.send({
                error: false,
                data: {
                    rows: result.rows
                }
            })
        } else {
            return reply.callNotFound();
        }
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
            error: {
                type: "db-error"
            }
        })
    }
})

Cron("0 0 * * *", function () {
    pool.query("call auth.delete_expired_sessions()");
});

fastify.listen({
    port: PORT,
    host: HOST
})
