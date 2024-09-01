# API Error Types

Quizfreely's api sends responses that look like this on success:
```json
{
    "error": false,
    "data": {
        "studyset": {
            "id": "d23a0693-7dfd-414b-a3bb-1be265d1ee4b",
            "userId": "1b073eb1-b453-4c6c-85af-1c0199243a6e",
            "title": "Example Title!",
            "private": false,
            "updatedAt": "2024-08-26T19:41:23.239Z",
            "data": {
                "terms": [
                    ["term 1", "definition 1"],
                    ["term 2", "definition 2"]
                ]
            },
            "user": {
                "id": "1b073eb1-b453-4c6c-85af-1c0199243a6e",
                "username": "eha",
                "displayName": "Eha"
            }
        }
    }
}
```

The api's responses look like this on error:
```json
{
    "error": {
        "type": "not-found"
    }
}
```

Instead of giving sending full error messages/descriptions from the api, the client shows users error messages based on the simple/consistent error type that the response has.

Here is a list that explains these error types.
- `"not-found"`
  - a 404; whatever you tried to get or update was not found
- `"rate-limit"`
  - too many requests in a small amount of time
- `"fields-missing"`
  - required parts of a request body were not sent
  - for example
    - trying to create a studyset but not sending the user's session token in the request's body
    - or trying to sign in without a password in the request body
- `"postgres-error"`
  - something went wrong trying to connect to, read from, or write to the database
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
