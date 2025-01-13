import dashboardLoad from "./dashboard/dashboardLoad";

export async function load({ parent, cookies }) {
    let { authed, authedUser, theme } = await parent();
    if (cookies.get("dashboard") == "true") {
        return dashboardLoad({ cookies }, { authed, authedUser, theme });
    } else {
        return {
            a: "abc"
        }
    }
}
