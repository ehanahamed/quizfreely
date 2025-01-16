import { load as dashboardLoad } from "./dashboard/+page.server";
import { load as landingPageLoad } from "./landing-page/+page.server";

export async function load({ cookies, locals }) {
    if (cookies.get("dashboard") == "true") {
        return {
            ...await dashboardLoad({ cookies: cookies, locals: locals }),
            dashboard: true
        }
    } else {
        return {
            ...await landingPageLoad(),
            dashboard: false
        }
    }
}
