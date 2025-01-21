import { env } from '$env/dynamic/private';

export async function load() {
  fetch(env.API_URL + "/graphql", {
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
  }).then(function (response) {
    response.json().then(function (responseJson) {
      if (responseJson?.data?.featuredStudysets?.length >= 0) {
        return {
          featuredRows: responseJson.data.featuredStudysets,
      activePage: "home"
        };
      } else {
        return {
          featuredRows: false,
      activePage: "home"
        }
      }
    }).catch(function (error) {
      //request.log.error(error);
      return {
        featuredRows: false,
      activePage: "home"
      }
    });
  }).catch(function (error) {
    //request.log.error(error);
    return {
      featuredRows: false,
      activePage: "home"
    }
  });
}
