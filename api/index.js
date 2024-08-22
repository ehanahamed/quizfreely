import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyPostgres from "@fastify/postgres";
import fastifyRateLimit from "@fastify/rate-limit";
import path from "path";

const port = process.env.PORT;
const host = process.env.HOST;
const pgConnection = process.env.POSTGRES_URI;
const corsOrigin = process.env.CORS_ORIGIN;
const cookiesDomain = process.env.COOKIES_DOMAIN;
const logLevel = process.env.LOG_LEVEL;

const fastify = Fastify({
    logger: {
        level: logLevel,
        file: path.join(import.meta.dirname, "logfile.log")
    }
})

await fastify.register(fastifyCors, {
    origin: corsOrigin
});
await fastify.register(fastifyPostgres, {
    connectionString: pgConnection
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

function cookieOptions() {
    let time = new Date();
    /* 7 days * 24h * 60m * 60s = 8640000 sec for 100 days */
    time.setSeconds(time.getSeconds() + 604800)
    return {
        domain: cookiesDomain,
        path: "/",
        signed: false,
        expires: time,
        maxAge: 604800,
        httpOnly: true,
        sameSite: "lax",
        /* when secure is true,
        browsers only send the cookie through https,
        on localhost, browsers send it even if localhost isn't using https */
        secure: true
    }
}

function clearExpiredSessions() {
    fastify.pg.query(
        "delete from auth.sessions where expire_at < clock_timestamp()",
        [],
        function (error, result) {
            if (error) {
                fastify.log.error(error);
            }
        }
    )
}

function verifySessionCookie(request, reply, callback) {
    /*
        usage example:
        verifySessionCookie(request, reply, function (result) {
            if (result.error) {
                // error
                // use result.error.type
                // and log result.error.error 
            } else if (result.data.user) {
                // user logged in
                // result.data.user.id contains user's id
            } else {
                // result.data.user is false,
                // user not logged in
            }
        })
    */
    if (request.cookies.session) {
        fastify.pg.query(
            "select user_id from auth.sessions" +
            "where token = $1 and expire_at > clock_timestamp() limit 1",
            [request.cookies.session],
            function (error, result) {
                if (error) {
                    callback({
                        error: {
                            type: "postgres-error",
                            error: error
                        }
                    })
                } else {
                    clearExpiredSessions()
                    if (result.rows.length == 1) {
                        let userId = result.rows[0].user_id
                        fastify.pg.query(
                            "delete from auth.sessions where token = $1",
                            [request.cookies.session],
                            function (error, result) {
                                if (error) {
                                    callback({
                                        error: {
                                            type: "postgres-error",
                                            error: error
                                        }
                                    })
                                } else {
                                    newSessionCookie(request, reply, userId,
                                        function (result) {
                                            if (result.error) {
                                                callback({
                                                    error: {
                                                        type: result.error.type,
                                                        error: result.error.error
                                                    }
                                                })
                                            } else {
                                                callback({
                                                    error: false,
                                                    data: {
                                                        user: {
                                                            id: userId
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    } else {
                        /* else, token didn't return a row,
                        so this token is invalid or expired,
                        so we call the callback with error false and login false */
                        callback({
                            error: false,
                            data: {
                                user: false
                            }
                        })
                    }
                }
            }
        )
    } else {
        callback({
            error: false,
            data: {
                user: false
            }
        });
    }
}

/* sets session cookie on reply object,
calls callback function with error parameter true if error was logged
or false if success */
function newSessionCookie(request, reply, userId, callback) {
    /* usage example
        newSessionCookie(
            request,
            reply,
            something.user_id,
            function (result) {
                if (result.error) {
                    request.log.error(result.error.error)
                    reply.send("ERROR: " + result.error.type)
                } else {
                    reply.send("no error")
                }
            }
        )
    */
    clearExpiredSessions()
    fastify.pg.query(
        "insert into auth.sessions (user_id) " +
        "values ($1) returning token",
        [userId],
        function (error, result) {
            if (error) {
                callback({
                    error: {
                        type: "postgres-error",
                        error: error
                    }
                })
            } else {
                reply.setCookie(
                    "session",
                    result.rows[0].token,
                    cookieOptions()
                )
                callback({
                    error: false
                })
            }
        }
    )
}

fastify.post("/sign-up", function (request, reply) {
    /* check if username and password were sent in sign-up request body */
    if (request.body && request.body.username && request.body.password) {
        let username = request.body.username;
        /* regex to check if username has letters or numbers (any alphabet) or dot, underscore, or dash */
        if (/^[\p{L}\p{N}\p{M}._-]+$/u.test(username) && username.length >= 2 && username.length < 100) {
            fastify.pg.query(
                /* check if username already taken */
                "select username from auth.users where username = $1 limit 1",
                [username],
                function (error, result) {
                    if (error) {
                        request.log.error(error)
                        reply.code(500).send({
                            error: {
                                type: "postgres-error"
                            }
                        })
                    } else {
                        if (result.rows.length == 0) {
                            /* if it returned 0 rows, that means this username is not taken, yay */
                            if (request.body.password.length >= 8) {
                                fastify.pg.query(
                                    "insert into auth.users (username, encrypted_password, display_name) " +
                                    "values ($1, crypt($2, gen_salt('bf')), $1) returning id",
                                    [username, request.body.password],
                                    function (error, result) {
                                        if (error) {
                                            request.log.error(error)
                                            reply.code(500).send({
                                                error: {
                                                    type: "postgres-error"
                                                }
                                            })
                                        } else {
                                            /* user_id was generated by postgres when the user was added,
                                            now we send data including the id in the response below */
                                            let userId = result.rows[0].id;
                                            newSessionCookie(
                                                request,
                                                reply,
                                                userId,
                                                function (result) {
                                                    if (result.error) {
                                                        request.log.error(result.error.error);
                                                        reply.code(500).send({
                                                            error: {
                                                                type: result.error.type
                                                            }
                                                        })
                                                    } else {
                                                        reply.send({
                                                            error: false,
                                                            data: {
                                                                user: {
                                                                    id: userId,
                                                                    username: username,
                                                                    display_name: username
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            } else {
                                /* password does not match length */
                                reply.code(400).send({
                                    error: {
                                        type: "password-weak"
                                    }
                                })
                            }
                        } else {
                            console.log(result)
                            /* if the query returned a row, this username is already taken */
                            reply.code(400).send({
                                error: {
                                    type: "username-taken"
                                }
                            })
                        }
                    }
                }
            )
        } else {
            /* username does not match regex or does not match length */
            reply.code(400).send(
                {
                    error: {
                        type: "username-invalid"
                    }
                }
            )
        }
    } else {
        /* password and/or username missing in request.body */
        reply.code(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

fastify.post("/sign-in", function (request, reply) {
    if (request.body && request.body.username && request.body.password) {
        fastify.pg.query(
            "select id, username, display_name from auth.users " +
            "where username = $1 and encrypted_password = crypt($2, encrypted_password) limit 1",
            [request.body.username, request.body.password],
            function (error, result) {
                if (error) {
                    request.log.error(error);
                    reply.code(500).send({
                        error: {
                            type: "postgres-error"
                        }
                    })
                } else {
                    if (result.rows.length == 1) {
                        let user = result.rows[0]
                        newSessionCookie(request, reply, user.id,
                            function(result) {
                                if (result.error) {
                                    request.log.error(error);
                                    reply.code(500).send({
                                        error: {
                                            type: "postgres-error"
                                        }
                                    })
                                } else {
                                    reply.send({
                                        "error": false,
                                        "data": {
                                            user: user,
                                        }
                                    })
                                }
                            }
                        )
                    } else {
                        /* if no rows are returned, then the username or password is wrong */
                        reply.code(400).send({
                            error: {
                                type: "sign-in-incorrect"
                            }
                        })
                    }
                }
            }
        )
    } else {
        /* password and/or username missing in request.body */
        reply.code(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

fastify.get("/studysets/public/:studyset", function (request, reply) {
    fastify.pg.query(
        "select id, user_id, title, data, updated_at FROM studysets " +
        "where private = false and id = $1 limit 1",
        [request.params.studyset],
        function (error, result) {
            if (error) {
                request.log.error(error);
                reply.code(500).send({
                    error: {
                        type: "postgres-error"
                    }
                })
            } else {
                if (result.rows.length == 1) {
                    let studyset = result.rows[0]
                    getUserPublic(result.rows[0].user_id, function (result) {
                        if (result.error)
                        reply.send({
                            error: false,
                            data: {
                                studyset: studyset,
                                user: result.rows[0]
                            }
                        })
                    })
                } else {
                    reply.callNotFound();
                }
            }
        }
    )
})

function getUserPublic(userId, callback) {
    fastify.pg.query(
        "select id, username, display_name from auth.users " +
        "where id = $1",
        [userId],
        function (error, result) {
            if (error) {
                callback({
                    error: {
                        type: "postgres-error",
                        error: error
                    }
                })
            } else {
                if (result.rows.length == 1) {
                    callback({
                        error: false,
                        data: {
                            user: result.rows[0]
                        }
                    })
                } else {
                    callback({
                        error: {
                            type: "not-found"
                        }
                    })
                }
            }
        }
    )
}

fastify.get("/users/public/:user", function (request, reply) {
    getUserPublic(request.params.user, function (result) {
        if (result.error) {
            if (result.error.type == "not-found") {
                reply.callNotFound();
            } else {
                request.log.error(result.error.error);
                reply.callNotFound();
            }
        } else {
            reply.send({
                error: false,
                data: {
                    user: result.data.user
                }
            })
        }
    })
})

fastify.listen({
    port: port,
    host: host
})
