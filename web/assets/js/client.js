var client = {
    apiUrl: "https://api.quizfreely.com",
    get: function (path, callback) {
        fetch(apiUrl + path).then(
            function (response) {
                return response.json()
            }
        ).then(
            function(responseJson) {
                if (responseJson.session) {
                    localStorage.setItem("sessionId", responseJson.session.id);
                    localStorage.setItem("sessionToken", responseJson.session.token);
                }
                callback(responseJson);
            }
        )
    },
    request: function (path, method, body, callback) {
        if (body.session) {
            reqBody = body
        } else if (window.localStorage && localStorage.getItem("sessionId") && localStorage.getItem("sessionToken")) {
            reqBody = {
                ...body,
                session: {
                    id: "e",
                    token: "e"
                }
            }
        } else {
            reqBody = body;
        }
        fetch(
            apiUrl + path,
            {
                method: method.toUpperCase(),
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody)
            }
        ).then(
            function (response) {
                return response.json()
            }
        ).then(
            function(responseJson) {
                if (responseJson.session) {
                    localStorage.setItem("sessionId", responseJson.session.id);
                    localStorage.setItem("sessionToken", responseJson.session.token);
                }
                callback(responseJson);
            }
        )
    }
}
