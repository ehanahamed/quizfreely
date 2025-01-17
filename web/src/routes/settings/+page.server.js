import fetchAuthData from "$lib/fetchAuthData.server"

export async function load({ locals }) {
    return {
        ...await fetchAuthData,
        theme: locals.theme
    }
}
