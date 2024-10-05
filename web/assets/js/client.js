var client = {
    apiUrl: "https://api.quizfreely.com",
    req: function (options, callback) {
        var reqHeaders;
        if (options.token) {
            reqHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.token
            }
        } else if (options.public == false && client.hasSession()) {
            reqHeaders = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("auth")
            }
        } else {
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
