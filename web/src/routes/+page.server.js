import dashboardLoad from "./dashboard/dashboardLoad";
import landingPageLoad from "./landing-page/landingPageLoad";

export async function load({ parent, cookies }) {
    let { authed, authedUser, theme } = await parent();
    if (cookies.get("dashboard") == "true") {
        return dashboardLoad({ cookies }, { authed, authedUser, theme });
    } else {
        return landingPageLoad();
    }
}
