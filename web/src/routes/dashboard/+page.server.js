import dashboardLoad from "./dashboardLoad";

export async function load({ parent, cookies }) {
    let { authed, authedUser, theme } = await parent();
    return dashboardLoad({ cookies }, { authed, authedUser, theme });
}
