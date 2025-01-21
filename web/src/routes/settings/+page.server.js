import fetchAuthData from "$lib/fetchAuthData.server"

export async function load({ locals, cookies }) {
    return {
        ...await fetchAuthData({ cookies }),
        theme: locals.theme,
        activePage: "settings"
    }
}
