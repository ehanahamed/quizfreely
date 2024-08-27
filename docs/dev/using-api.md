# Using API

## SSR

For SSR (server side rendering) code, like in `web/index.js`, we use `fetch()`.

An example is below
```js
fetch(
  "https://api.quizfreely.com/studysets/create",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        id: "session-id-goes-here",
        token: "session-token-goes-here"
      },
      studyset: {
        title: "title goes here!",
        private: false,
        data: {
          terms: [
            ["term 1", "definition 1"],
            ["term 2", "definition 2"]
          ]
        }
      }
    })
  }
).then(function (response) {
  return response.json()
}).then(function (responseJson) {
  if (responseJson.error) {
    console.log(responseJson.error);
  } else {
    console.log(responseJson.data);
  }
});
```

## Client

For client-side js code like in html/eta templates (`web/views/`) or in client js files (`web/assets/js/`)), we made a simple js api client (in `web/assets/js/client.js`)

Client side js needs to store and send session tokens and parse response json, so this js api client does that for us to avoid repetitive code.

Here's an example for using `client`:
```html
<script src="/assets/js/client.js"></script>
<script>
  client.apiUrl = "https://api.quizfreely.com";
  if (client.hasSession()) {
    client.req("/studysets/create", function (responseJson) {
      if (responseJson.error) {
        console.log(responseJson.error);
      } else {
        console.log(responseJson.data);
        /*
        client.req() stores our user's session token for us
        it also sends the stored session in the request body
        */
      }
    })
  }
</script>
```
