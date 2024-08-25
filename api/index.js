import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import pg from "pg";
const { Pool, Client } = pg;
import path from "path";

const port = process.env.PORT;
const host = process.env.HOST;
const pgConnection = process.env.POSTGRES_URI;
const corsOrigin = process.env.CORS_ORIGIN;
const logLevel = process.env.LOG_LEVEL;

const fastify = Fastify({
    logger: {
        level: logLevel,
        file: path.join(import.meta.dirname, "logfile.log")
    }
})

const pool = new Pool({
    connectionString: pgConnection
})

await fastify.register(fastifyCors, {
    origin: corsOrigin
});
await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute"
});

fastify.setErrorHandler(function (error, request, reply) {
  if (error.statusCode == 429) {
    reply.code(429).send({
        error: {
            type: "rate-limit"
        }
    })
  } else {
    request.log.error(error)
    reply.code(500).send({
        error: {
            type: "server-error"
        }
    })
  }
})

fastify.setNotFoundHandler(function (request, reply) {
  reply.code(404).send({
    error: {
        type: "not-found"
    }
  })
})

const newSessionQuery = "insert into auth.sessions (user_id) values ($1) returning id, token";
const clearExpiredSessionsQuery = "delete from auth.sessions where expire_at < clock_timestamp()";
const verifyAndRefreshSessionQuery = "select id, token, user_id from auth.verify_and_refresh_session($1, $2)";

fastify.post("/sign-up", async function (request, reply) {
    /* check if username and password were sent in sign-up request body */
    if (request.body && request.body.username && request.body.password) {
        if (request.body.password.length >= 8) {
            let username = request.body.username;
             /* regex to check if username has letters or numbers (any alphabet) or dot, underscore, or dash */
            if (/^[\p{L}\p{N}\p{M}._-]+$/u.test(username) && username.length >= 2 && username.length < 100) {
                let client = await pool.connect();
                try {
                    await client.query("BEGIN");
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
                        await client.query(
                            clearExpiredSessionsQuery
                        );
                        let session = await client.query(
                            newSessionQuery,
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
                                session: {
                                    id: session.rows[0].id,
                                    token: session.rows[0].token
                                }
                            }
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
                            type: "postgres-error"
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
            let result = await client.query(
                "select id, username, display_name from auth.users " +
                "where username = $1 and encrypted_password = crypt($2, encrypted_password) limit 1",
                [request.body.username, request.body.password]
            )
            if (result.rows.length == 1) {
                let session = await client.query(
                    newSessionQuery,
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
                        session: {
                            id: session.rows[0].id,
                            token: session.rows[0].token
                        }
                    }
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
                    type: "postgres-error"
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

fastify.post("/studysets/new", async function (request, reply) {
    if (
        request.body &&
        request.body.session &&
        request.body.session.id &&
        request.body.session.token &&
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
            session = await client.query(
                "select id, token, user_id from auth.verify_and_refresh_session($1, $2)",
                [request.body.session.id, request.body.session.token]
            );
            if (session.rows.length == 1) {
                let insertedStudyset = await client.query(
                    "insert into public.studysets (user_id, title, private, data) " +
                    "values ($1, $2, $3, $4) returning id, user_id, title, private, updated_at",
                    [
                        session.rows[0].user_id,
                        studysetTitle,
                        request.body.studyset.private,
                        request.body.studyset.data
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
                            updatedAt: insertedStudyset.rows[0].updated_at
                        },
                        session: {
                            id: session.rows[0].id,
                            token: session.rows[0].token
                        }
                    }
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
                    type: "postgres-error"
                }
            })
        }
    } else {
        reply.code(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

fastify.get("/studysets/public/:studyset", async function (request, reply) {
    try {
        let result = await pool.query(
            "select id, user_id, title, data, updated_at FROM studysets " +
            "where private = false and id = $1 limit 1",
            [request.params.studyset]
        )
        if (result.rows.length == 1) {
            let user = await pool.query(
                "select id, username, display_name from public.profiles " +
                "where id = $1",
                [result.rows[0].user_id]
            )
            if (user.rows.length == 1) {
                return reply.send({
                    error: false,
                    data: {
                        studyset: {
                            id: result.rows[0].id,
                            userId: result.rows[0].user_id,
                            title: result.rows[0].title,
                            private: result.rows[0].private,
                            user: {
                                id: user.rows[0].id,
                                username: user.rows[0].username,
                                displayName: user.rows[0].display_name
                            }
                        }
                    }
                })
            } else {
                /* if querying for the user returns no rows,
                then the user was deleted or for some reason not found,
                but we found the studyset, so return the studyset
                with the user set to false,
                which means the studyset was found, but the user was not found */
                return reply.send({
                    error: false,
                    data: {
                        studyset: {
                            id: result.rows[0].id,
                            userId: result.rows[0].user_id,
                            title: result.rows[0].title,
                            private: result.rows[0].private,
                            user: false
                        }
                    }
                })
            }
        } else {
            return reply.callNotFound();
        }
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
            error: {
                type: "postgres-error"
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
                type: "postgres-error"
            }
        })
    }
})

fastify.listen({
    port: port,
    host: host
})
