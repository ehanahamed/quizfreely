import dashboardLoad from "./dashboard/dashboardLoad";
import landingPageLoad from "./landing-page/landingPageLoad";

export async function load({ cookies, locals }) {
    if (cookies.get("dashboard") == "true") {
        return {
            ...dashboardLoad(cookies, locals.theme),
            dashboard: true
        }
    } else {
        return {
            ...landingPageLoad(),
            dashboard: false
        }
    }
}
