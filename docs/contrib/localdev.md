# Local Development

## Run pocketbase locally

To test quizfreely's backend and stuff, you should run a test pocketbase instance on your own machine.

### Running pocketbase

Pocketbase does not take a lot of resources. In fact, the "real", "production", instance runs on a machine with 1GB total ram.

Anyway, first download pocketbase's latest version from [pocketbase's github releases](https://github.com/pocketbase/pocketbase/releases)

Then, extract the zip file into some remember-able directory.

Now, you can run pocketbase:

```
./pocketbase serve
```

Then navigate to pocketbase's admin ui, which should be at http://127.0.0.1:8090/_/

Create a temporary username and password, it doesn't actually matter.

Under settings, find "import collections", and import our collections configuration which is in our source code, at `backend/collections.json`

Now our local backend "server" is ready.

### Using local instance

Now, make sure Quizfreely's web and/or mobile source code uses `http://127.0.0.1:8090`.

There should be `... = new PocketBase( ... )` somewhere.

When publishing a finished, "production", version, we change that url back to our "real" pocketbase instance, `api.quizfreely.com`.
