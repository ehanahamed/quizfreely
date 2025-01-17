import { browser } from "$app/environment"

export async function load() {
    let apiUrl;
    if (browser) {
        apiUrl = "/api";
    } else {
        let { API_URL } = import("$env/static/private");
        apiUrl = API_URL;
    }
    req = await fetch(apiUrl + "/graphql", {
        method: "POST",
    })
}
