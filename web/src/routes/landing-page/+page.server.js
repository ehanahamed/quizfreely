import { env } from '$env/dynamic/private';

export async function load() {
  try {
  let response = await fetch(env.API_URL + "/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `query {
        featuredStudysets {
          id
          title
          user_id
          user_display_name
          terms_count
          updated_at
        }
      }`
    })
  })
  try {
  let responseJson = await response.json()
      if (responseJson?.data?.featuredStudysets?.length >= 0) {
        return {
          featuredRows: responseJson.data.featuredStudysets,
      header: { activePage: "home" }
        };
      } else {
        return {
          featuredRows: false,
      header: { activePage: "home" }
        }
      }
    } catch (error) {
      //request.log.error(error);
      return {
        featuredRows: false,
      header: { activePage: "home" }
      }
    };
  } catch (error) {
    //request.log.error(error);
    return {
      featuredRows: false,
      header: { activePage: "home" }
    }
  };
}
