import fetchAuthData from '$lib/fetchAuthData.server'

export async function load({ cookies, url }) {
    let localId = parseInt(url.searchParams.get("id"));
    let userResult = await fetchAuthData({ cookies })
    return {
        localId: localId,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    }
}
