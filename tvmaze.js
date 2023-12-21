"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $searchFormTerm = $('#searchFormTerm')


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

// async function getShowsByTerm( $sTerm) {
//   // ADD: Remove placeholder & make request to TVMaze search shows API.
//    const res = await 
//   return [
//     {
//       id: 1767,
//       name: "The Bletchley Circle",
//       summary:
//         `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//            women with extraordinary skills that helped to end World War II.</p>
//          <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//            normal lives, modestly setting aside the part they played in
//            producing crucial intelligence, which helped the Allies to victory
//            and shortened the war. When Susan discovers a hidden code behind an
//            unsolved murder she is met by skepticism from the police. She
//            quickly realises she can only begin to crack the murders and bring
//            the culprit to justice with her former friends.</p>`,
//       image:
//         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//     }
//   ];
// }

async function getShowsByTerm(term) {
  // make a request to the TVMaze search shows API
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);

  // map over the response data to format it as required
  const shows = response.data.map(item => ({
    id: item.show.id,
    name: item.show.name,
    summary: item.show.summary,
    image: item.show.image ? item.show.image.medium : "http://static.tvmaze.com/uploads/images/medium_portrait/0/0.jpg", // default image URL
  }));

  return shows;
}


/** Given list of shows, create markup for each and to DOM */

// function populateShows(shows) {
//   $showsList.empty();

//   for (let show of shows) {
//     const $show = $(
//       `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
//          <div class="media">
//            <img
//               src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
//               alt="Bletchly Circle San Francisco"
//               class="w-25 me-3">
//            <div class="media-body">
//              <h5 class="text-primary">${show.name}</h5>
//              <div><small>${show.summary}</small></div>
//              <button class="btn btn-outline-light btn-sm Show-getEpisodes">
//                Episodes
//              </button>
//            </div>
//          </div>
//        </div>
//       `);

//     $showsList.append($show);
//   }
// }

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */




/**
 * Given a show ID, make an AJAX request to the TV Maze API to fetch the episodes of the show.
 *
 * @param {number} id - The ID of the show.
 * @returns {Promise<Array>} A promise that resolves to an array of episode objects, 
 * where each object contains the id, name, season, and number of an episode.
 */



 async function getEpisodes(id) {
  try {
    const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    const episodes = response.data.map(episode => ({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }));
    return episodes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
    throw error; // Re-throw the error to indicate that fetching episodes failed
  }
}

/**
 * Given an array of episodes, create an HTML list item for each episode and append it to the episodes list in the DOM.
 * Also, make the episodes area visible.
 *
 * @param {Array} episodes - An array of episode objects, where each object contains the id, name, season, and number of an episode.
 */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $episodesList.append($episode);
  }

  $episodesArea.show();
}


$showsList.on("click", ".Show-getEpisodes", async function (event) {
  const showId = $(event.target).closest(".Show").data("show-id");
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});