fix `404.html` AFTER everything in `index.html` is done

## Findings

```javascript
// re-logs-in the user
supabaseClient.auth.getSession()
// returns user data with email and metadata,
// only after logging in or re-logging in
supabaseClient.auth.getUser()


// returns "result.data.session" as equal to "null" when NOT logged in
supabaseClient.auth.getSession().then(console.log(result));
```
