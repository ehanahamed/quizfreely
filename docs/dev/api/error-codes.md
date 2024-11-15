# API Error Codes

Here's an example of an error response from Quizfreely-API:
```json
{
    "error": {
        "code": "USERNAME_TAKEN",
        "statusCode": 400,
        "message": "Username taken/already being used"
    }
}
```

`error.statusCode` is the HTTP status code of the error (if applicable)

`error.message` is a readable explanation of the error.

`error.code` is an "error code". We can use this to display different error messages based on what type of error happened.

Sometimes Quizfreely-API sends an error message from Node.js, PostgreSQL, Fastify, or Mercurius that might not have `.code`, `.statusCode`, or `.message`. When Quizfreely-API sends its own error message, then it will have all three (`.code`, `.statusCode`, and `.message`).

Here is a list of Quizfreely's error codes:
- `"NOT_FOUND"`
    - a 404; whatever you tried to get or update was not found
- `"NOT_AUTHED"`
    - Not signed in while trying to do something that requires you to be signed in
    - Quizfreely-API uses an Authorization header OR an auth cookie to send the user's token
    - The cookie is supposed to be named `auth`, and its value is supposed to be the token
    - Auth headers are supposed to look like this: `Authorization: Bearer tokenGoesHere`
- `"INCORRECT_USERNAME"`
    - username is wrong (when trying to sign in)
- `"INCORRECT_PASSWORD"`
    - password is wrong (when trying to sign in)
- `"USERNAME_INVALID"`
    - username contains spaces or special characters (when trying to create an account)
    - usernames can have letters or numbers (any alphabet), dot (`.`), underscore (`_`), or dash (`-`)
    - usernames must be 1 or more characters and less than 100 characters
- `"USERNAME_TAKEN"`
    - another account already uses that username (when trying to create an account)
- `?error=oauth-error`
    - querystring sent in redirect to sign in/sign up page if there is an error when trying to sign up or sign in with OAuth
    - all the other error codes are sent in the API's response body as json in `error.code`, but this error is a querystring only for OAuth redirects
