# API Error Types

Quizfreely's api sends responses that look like this on error:
```json
{
    "error": {
        "type": "something"
    }
}
```

`error.type` is a simple/consistent way to categorize errors and show error messages based on them.

Here is a list of error types:
- `"not-found"`
  - a 404; whatever you tried to get or update was not found
- `"fields-missing"`
  - required parts of a request body were not sent
  - for example
    - trying to create a studyset without sending the title or content in the request body
    - or trying to sign in without a password in the request body
  - also make sure the requeset body is valid json and has content-type (header) as json
- `"auth-missing"`
  - Authorization http header or auth cookie were not sent
  - The cookie is supposed to be named `auth`, and its value is supposed to be the token
  - Auth headers are supposed to look like this: `Authorization: Bearer abcd1234tokenGoesHere`
  - This error happens when the header or cookie are missing, if the session token is invalid or expired, you get a different error (`session-invalid`)
- `"db-error"`
  - something went wrong while trying to connect to, read from, or write to the database
- `"session-invalid"`
  - the session token is expired or wrong
  - this usually means the user needs to sign in again to get a new session
- `"sign-in-incorrect"`
  - username or password is wrong (when trying to sign in)
- `"password-weak"`
  - password is too short/weak (when trying to create an account)
- `"username-invalid"`
  - username contains spaces or special characters (when trying to create an account)
  - usernames can have letters or numbers (any alphabet), dot (`.`), underscore (`_`), or dash (`-`)
  - usernames must be 2 or more characters and less than 100 characters
- `"username-taken"`
  - another account already uses that username (when trying to create an account)
- `"oauth-error"`
  - an error happened while trying to generate an authorization uri with oauth2
- `"server-error"`
  - a 500 error; an error was so bad that the api couldn't even use any of the other error types
