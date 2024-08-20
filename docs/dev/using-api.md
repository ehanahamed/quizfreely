something something
```js
fetch("http://localhost:8008/sign-up", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "abc",
    password: "12345678"
  })
}).then((response) => response.json()
).then((data) => { console.log(data) })
```
