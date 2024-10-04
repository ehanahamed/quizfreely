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
        var reqBody = {};
        var reqHeaders = {}
        if (options.method) {
            reqMethod = options.method
        }
        if (options.body) {
            reqBody = options.body;
        }

        if (client.hasSession()) {
            reqHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("auth")
            }
        } else {
            reqHeaders = {
                "Content-Type": "application/json"
            }
        }

        fetch(
            client.apiUrl + path,
            {
                method: reqMethod,
                headers: reqHeaders,
                body: JSON.stringify(reqBody)
            }
        ).then(
            function (response) {
                response.json().then(function(responseJson) {
                    if (responseJson.auth && window.localStorage) {
                        localStorage.setItem("auth", responseJson.auth);
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
        if (window.localStorage && localStorage.getItem("auth")) {
            return true;
        } else{
            return false;
        }
    },
    deleteLocalSession: function () {
        if (window.localStorage) {
            localStorage.removeItem("auth")
        }
    },
    refreshSession: function (token, callback) {
        /* when the API updates the token, the old token becomes invalid */
        if (token) {
            fetch(
                client.apiUrl + "/session/refresh",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({})
                }
            ).then(
                function (response) {
                    response.json().then(function(responseJson) {
                        if (responseJson.auth && window.localStorage) {
                            localStorage.setItem("auth", responseJson.auth);
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
        } else {
            callback({
                error: {
                    type: "client-missing-fields"
                }
            })
        }
    }
}
