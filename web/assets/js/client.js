var client = {
    apiUrl: "https://api.quizfreely.com",
    get: function (path, callback) {
        fetch(client.apiUrl + path).then(
            function (response) {
                response.json().then(
                    function(responseJson) {
                        callback(responseJson);
                    }
                )
            }
        ).catch(function (error) {
            callback({
                error: {
                    type: "client-fetch-error",
                    error: error
                }
            })
        })
    },
    req: function (path, options, callback) {
        var reqMethod = "POST";
        if (options.method) {
            reqMethod = options.method
        }

        var reqBody = {};
        if (options.body && options.body.session) {
            reqBody = options.body;
        } else if (client.hasSession()) {
            if (options.body) {
                reqBody = {
                    ...options.body,
                    session: {
                        id: localStorage.getItem("sessionId"),
                        token: localStorage.getItem("sessionToken")
                    }
                }
            } else {
                reqBody = {
                    session: {
                        id: localStorage.getItem("sessionId"),
                        token: localStorage.getItem("sessionToken")
                    }
                }
            }
        } else if (options.body) {
            reqBody = options.body;
        }

        fetch(
            client.apiUrl + path,
            {
                method: reqMethod,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody)
            }
        ).then(
            function (response) {
                response.json().then(function(responseJson) {
                    if (responseJson.data && responseJson.data.session && window.localStorage) {
                        localStorage.setItem("sessionId", responseJson.data.session.id);
                        localStorage.setItem("sessionToken", responseJson.data.session.token);
                    }
                    callback(responseJson);
                })
            }
        ).catch(
            function (error) {
                callback({
                    error: {
                        type: "client-fetch-error",
                        error: error
                    }
                })
            }
        )
    },
    hasSession: function () {
        if (window.localStorage && localStorage.getItem("sessionId") && localStorage.getItem("sessionToken")) {
            return true;
        } else{
            return false;
        }
    }
}
