import fetchAuthData from '$lib/fetchAuthData.server'

export async function load({ cookies }) {
    let userResult = await fetchAuthData({ cookies })
    return {
      studysetId: request.params.studyset,
      authed: userResult.authed,
      authedUser: userResult?.authedUser
    }
}
