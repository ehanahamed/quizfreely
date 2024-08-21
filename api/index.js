require("dotenv").config();
const Fastify = require("fastify");
const fastifyCookie = require("@fastify/cookie");
const fastifyCors = require("@fastify/cors");
const fastifyPostgres = require("@fastify/postgres");
const path = require("node:path");

const port = process.env.PORT;
const host = process.env.HOST;
const pgConnection = process.env.POSTGRES_URI;
const corsOrigin = process.env.CORS_ORIGIN;
const cookiesDomain = process.env.COOKIES_DOMAIN;
const logLevel = process.env.LOG_LEVEL;

const fastify = Fastify({
    logger: {
        level: logLevel,
        file: path.join(__dirname, "logfile.log")
    }
})

fastify.register(fastifyCors, {
    origin: corsOrigin
})
fastify.register(fastifyCookie)
fastify.register(fastifyPostgres, {
    connectionString: pgConnection
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
    if (request.cookies.session) {
        fastify.pg.query(
            "select user_id from auth.sessions" +
            "where token = $1 and expire_at > clock_timestamp() limit 1",
            [request.cookies.session],
            function (error, result) {
                if (error) {
                    callback(error, false)
                } else {
                    clearExpiredSessions()
                    if (result.rows.length == 1) {
                        let userId = result.rows[0].user_id
                        fastify.pg.query(
                            "delete from auth.sessions where token = $1",
                            [request.cookies.session],
                            function (error, result) {
                                if (error) {
                                    request.log.error(error)
                                } else {
                                    newSessionCookie(request, reply, userId,
                                        function (error) {
                                            if (error) {
                                                callback(error, false)
                                            } else {
                                                callback(false, {
                                                    id: userId
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
                        callback(false, false)
                    }
                }
            }
        )
    } else {
        callback(false, false);
    }
}

/* sets session cookie on reply object,
calls callback function with error parameter true if error was logged
or false if success */
function newSessionCookie(request, reply, userId, callback) {
    /* usage example
        newSessionCookie(request, reply, result.something.user_id,
        function (error) {
            if (error) {
                request.log.error(error)
                reply.send("error")
            } else {
                reply.send("no error")
            }
        })
    */
    clearExpiredSessions()
    fastify.pg.query(
        "insert into auth.sessions (user_id) " +
        "values ($1) returning token",
        [userId],
        function (error, result) {
            if (error) {
                callback(error)
            } else {
                reply.setCookie(
                    "session",
                    result.rows[0].token,
                    cookieOptions()
                )
                callback(false)
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
                        reply.status(500).send({
                            error: {
                                type: "postgres-errorrr"
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
                                            reply.status(500).send({
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
                                                function (error) {
                                                    if (error) {
                                                        request.log.error(error);
                                                        reply.status(500).send({
                                                            error: {
                                                                type: "postgres-error"
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
                                reply.status(400).send({
                                    error: {
                                        type: "password-weak"
                                    }
                                })
                            }
                        } else {
                            console.log(result)
                            /* if the query returned a row, this username is already taken */
                            reply.status(400).send({
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
            reply.status(400).send(
                {
                    error: {
                        type: "username-invalid"
                    }
                }
            )
        }
    } else {
        /* password and/or username missing in request.body */
        reply.status(400).send({
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
                    reply.status(500).send({
                        error: {
                            type: "postgres-error"
                        }
                    })
                } else {
                    if (result.rows.length == 1) {
                        newSessionCookie(request, reply, result.rows[0].id,
                            function(error) {
                                if (error) {
                                    request.log.error(error);
                                    reply.status(500).send({
                                        error: {
                                            type: "postgres-error"
                                        }
                                    })
                                } else {
                                    reply.send({
                                        "error": false,
                                        "data": {
                                            user: result.rows[0],
                                        }
                                    })
                                }
                            }
                        )
                    } else {
                        /* if no rows are returned, then the username or password is wrong */
                        reply.status(400).send({
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
        reply.status(400).send({
            error: {
                type: "fields-missing"
            }
        })
    }
})

fastify.get("/studysets/public/:studyset", function (request, reply) {
    fastify.pg.query(
        "SELECT id, user_id, title, data, updated_at FROM studysets " +
        "WHERE private = false and id = $1",
        [request.params.studyset],
        function (error, result) {
            if (error) {
                request.log.error(error);
                reply.status(500).send({
                    error: {
                        type: "postgres-error"
                    }
                })
            } else {
                reply.send({
                    error: false,
                    data: {
                        studyset: result.rows[0]
                    }
                })
            }
        }
    )
})

fastify.listen({
    port: port,
    host: host
})
