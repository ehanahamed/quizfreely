import dashboardLoad from "$lib/dashboardLoad";

export async function load({ parent, cookies }) {
    let { authed, authedUser } = await parent();
    if (cookies.get("dashboard") == "true") {
        return dashboardLoad({ cookies }, { authed, authedUser });
    } else {
        return {
            a: "abc"
        }
    }
}