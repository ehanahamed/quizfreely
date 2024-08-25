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
                    localStorage.setItem("session", responseJson.session.id);
                    localStorage.setItem("token", responseJson.session.token);
                }
                callback(responseJson);
            }
        )
    },
    post: function (path, body, callback) {
        if (body.session) {
            reqBody = body
        } else {
            reqBody = {
                ...body,
                session: {
                    id: "e",
                    token: "e"
                }
            }
        }
        fetch(
            apiUrl + path,
            {
                method: "POST",
                body: ""
            }
        ).then(
            function (response) {
                return response.json()
            }
        ).then(
            function(responseJson) {
                if (responseJson.session) {
                    localStorage.setItem("session", responseJson.session.id);
                    localStorage.setItem("token", responseJson.session.token);
                }
                callback(responseJson);
            }
        )
    }
}
