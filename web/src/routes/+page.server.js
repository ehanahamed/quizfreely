import dashboardLoad from "./dashboard/dashboardLoad";
import landingPageLoad from "./landing-page/landingPageLoad";

export async function load({ cookies, locals }) {
    if (cookies.get("dashboard") == "true") {
        return {
            ...await dashboardLoad(cookies, locals.theme),
            dashboard: true
        }
    } else {
        return {
            ...await landingPageLoad(),
            dashboard: false
        }
    }
}
