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

const fastify = Fastify({
  logger: {
    level: "warn",
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
    "delete from auth.sessions where expires < clock_timestamp()",
    [],
    function (error, result) {
      if (error) {
        fastify.log.error(error);
      }
    }
  )
}

function newSessionCookie(request, reply, userId) {
  clearExpiredSessions()
  fastify.pg.query(
    "insert into auth.sessions (user_id) " +
    "values ($1) returning token",
    [ userId ],
    function (error, result) {
      if (error, result) {
        request.log.error(error);
        reply.status(500).send({
          error: {
            type: "postgres-error"
          }
        })
        return false;
      } else {
        reply.setCookie(
          "session",
          result.rows[0].token,
          cookieOptions()
        )
        return true;
      }
    }
  )
}

fastify.post("/sign-up", function (request, reply) {
  if (request.body && request.body.username && request.body.password) {
    let username = request.body.username;
    /* regex to check if username has letters or numbers (any alphabet) or dot, underscore, or dash */
    if (/^[\p{L}\p{N}\p{M}._-]+$/u.test(username) && username.length >= 2 && username.length < 100) {
      if (request.body.password.length >= 8) {
        fastify.pg.query(
          "insert into auth.users (username, encrypted_password, display_name) " +
          "values ($1, crypt($2, gen_salt('bf')), $1) returning id",
          [username, request.body.password],
          function (error, result) {
            if (error) {
              request.log.error(error)
              reply.status(500).send({
                "error": true
              })
            } else {
              let userId = result.rows[0].id;
              session = newSessionCookie(request, reply, userId)
              if (session) {
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
          }
        )
      } else {
        reply.status(400).send({
          error: {
            type: "password-weak"
          }
        })
      }
    } else {
      reply.status(400).send(
        {
          error: {
            type: "username-invalid"
          }
        }
      )
    }
  } else {
    /* else (password or username not in request.body) */
    reply.status(400).send({
      error: {
        type: "fields-missing"
      }
    })
  }
})

fastify.post("/sign-in", function (request, reply) {
  fastify.pg.query(
    "select id, username, display_name from auth.users " +
    "where username = $1 and encrypted_password = crypt($2, password) limit 1",
    [request.body.username, request.body.password],
    function (error, result) {
      if (error) {
        request.log.error(error);
        reply.status(500).send({
          "error": true
        })
      } else {
        if (result.rowCount = 1) {
          fastify.pg.query(
            "insert into auth.sessions (user_id) " +
            "values ($1) returning token"
            // work in progress
          )
          reply.send({
            "error": false,
            "data": {
              user: result.rows[0],
              session: {
                token: ""
              }
            }
          })
        } else {

        }
      }
    }
  )
})

fastify.get("/studytestn", function (req, reply) {
  fastify.pg.query(
    'SELECT id, user_id, title FROM studysets WHERE id=$1', ["1"],
    function (err, result) {
      reply.send(err || result)
    }
  )
})

fastify.listen({
  port: port,
  host: host
})
