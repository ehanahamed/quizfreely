var client = {
    apiUrl: "https://api.quizfreely.com",
    req: function (options, callback) {
        var reqHeaders = {};
        if (options.public && options.body) {
            reqHeaders = {
                "Content-Type": "application/json"
            }
        } else if (options.public) {
            reqHeaders = {};
        } else if (options.token && options.body) {
            reqHeaders = {
                "Authorization": "Bearer " + options.token,
                "Content-Type": "application/json"
            }
        } else if (options.token) {
            reqHeaders = {
                "Authorization": "Bearer " + options.token
            }
        } else if (client.hasSession() && options.body) {
            reqHeaders = {
                "Authorization": "Bearer " + localStorage.getItem("auth"),
                "Content-Type": "application/json"
            }
        } else if (client.hasSession()) {
            reqHeaders = {
                "Authorization": "Bearer " + localStorage.getItem("auth")
            }
        } else if (options.body) {
            reqHeaders = {
                "Content-Type": "application/json"
            }
        }
        if (options.body) {
            fetch(
                client.apiUrl + options.path,
                {
                    method: options.method,
                    headers: reqHeaders,
                    body: JSON.stringify(options.body)
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
            fetch(
                client.apiUrl + options.path,
                {
                    method: options.method,
                    headers: reqHeaders,
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
        }
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
    }
}
