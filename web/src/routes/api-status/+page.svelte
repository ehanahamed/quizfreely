<script>
    import Noscript from "$lib/components/Noscript.svelte";
    import { onMount } from "svelte";
    import { fancyTimestamp } from "$lib/fancyTimestamp";
    let { data } = $props();
    
    import IconCodeberg from "$lib/icons/Codeberg.svelte";
    import IconGitHub from "$lib/icons/GitHub.svelte";
    import IconGraphQL from "$lib/icons/GraphQL.svelte";

    if (data.config?.enableGitRepoSyncStatus) {
    onMount(function () {
        fetch("https://codeberg.org/api/v1/repos/"+ data.config.codeberg.owner +"/"+ data.config.codeberg.repo +"/commits?sha=" + data.config.codeberg.branch + "&limit=1", {
            method: "GET"
        }).then(function (codebergRes) {
            fetch("https://api.github.com/repos/"+ data.config.gh.owner +"/"+ data.config.gh.repo +"/commits?sha=" + data.config.gh.branch +"&per_page=1&page=1", {
                method: "GET"
            }).then(function (ghRes) {
                showGitRepoSyncStatus(
                    codebergRes,
                    ghRes
                )
            }).catch(ghApiError);
        }).catch(codebergApiError);

        function codebergApiError(error) {
            console.error(error);
            document.getElementById("git-repo-sync-status").classList.add("hide");
        }
        function ghApiError(error) {
            console.error(error);
            document.getElementById("git-repo-sync-status").classList.add("hide");
        }

        function showGitRepoSyncStatus(codebergApiResponse, ghApiResponse) {
            var codebergTotalCommitsCount = codebergApiResponse.headers.get("X-Total");
            var ghTotalCommitsCount = parseLastPageFromLinks(
                ghApiResponse.headers.get("Link")
            );
            codebergApiResponse.json().then(function (codebergApiResJSON) {
                ghApiResponse.json().then(function (ghApiResJSON) {
                    fancyTimestamp.hours = 24;
                    if (codebergApiResJSON[0].sha == ghApiResJSON[0].sha) {
                        document.getElementById("git-repo-sync-status-synced").classList.remove("hide");
                        document.getElementById("git-repo-sync-status-synced-sha").innerText = codebergApiResJSON[0].sha.substring(0, 11);
                        document.getElementById("git-repo-sync-status-synced-timestamp").innerText = fancyTimestamp.format(codebergApiResJSON[0].commit.committer.date);
                    } else {
                        document.getElementById("git-repo-sync-status-outdated").classList.remove("hide");
                        document.getElementById("git-repo-sync-status-outdated-codeberg-sha").innerText = codebergApiResJSON[0].sha.substring(0, 11);
                        document.getElementById("git-repo-sync-status-outdated-codeberg-timestamp").innerText = fancyTimestamp.format(codebergApiResJSON[0].commit.committer.date);
                        document.getElementById("git-repo-sync-status-outdated-codeberg-commit-count").innerText = codebergTotalCommitsCount;
                        document.getElementById("git-repo-sync-status-outdated-gh-sha").innerText = ghApiResJSON[0].sha.substring(0, 11);
                        document.getElementById("git-repo-sync-status-outdated-gh-timestamp").innerText = fancyTimestamp.format(ghApiResJSON[0].commit.committer.date);
                        document.getElementById("git-repo-sync-status-outdated-gh-commit-count").innerText = ghTotalCommitsCount;
                    }
                })
            })
        }

        function parseLastPageFromLinks(links) {
            /*
                The `Link` header looks something like this:
                <https://api.github.com/repositories/123/commits?sha=branch&per_page=1&page=2>; rel="next", <https://api.github.com/repositories/123/commits?sha=branch&per_page=1&page=161>; rel="last"

                we split it by the comma (`,`) to get an array of both links
                and then we use `.find(...)` to figure out which link has `rel="last"`
            */
            var lastLink = links.split(",").find(function (link) {
                return link.includes("rel=\"last\"");
            });
            /*
                Now we take the page number from the rel="last" link
                The url param will always start with `?` or `&`, thats why we have `[?&]` in this regex.
                We use `\d` in the regex to match until the numbers end.
            */
            var page = lastLink.match(/[?&]page=\d+/);
            /*
                Now we remove the `?page=` or `&page=` in the string
                remember that String.prototype.match() returns an array,
                so we use `[0]` to get the first (and only) string in the array
            */
            var pageNum = page[0].replace("?page=", "").replace("&page=", "");
            return pageNum;
        }
    })
    }
</script>

<svelte:head>
    <title>Quizfreely</title>
</svelte:head>

<Noscript />
<main>
      <div class="grid page">
        <div class="content">
            <div class="flex compact-gap" style="margin-top:1rem;margin-bottom:2rem">
                <a href="/api/graphiql" class="button faint">
                    <IconGraphQL /> Qzfr-API GraphiQL
                </a>
                {#if (data.config.codeberg && data.config.gh) }
                    <a href="https://codeberg.org/{ data.config.codeberg.owner }/{ data.config.codeberg.repo }" class="button faint">
                        <IconCodeberg /> Codeberg Repo
                    </a>
                    <a href="https://github.com/{ data.config.gh.owner }/{ data.config.gh.repo }" class="button faint">
                        <IconGitHub /> GitHub Repo
                    </a>
                {:else}
                    <a href="https://codeberg.org/ehanahamed/quizfreely" class="button faint">
                        <IconCodeberg /> Codeberg Repo
                    </a>
                    <a href="https://github.com/ehanahamed/quizfreely" class="button faint">
                        <IconGitHub /> GitHub Repo
                    </a>
                {/if}
            </div>
            {#if (data.config?.enableGitRepoSyncStatus) }
            <div id="git-repo-sync-status" style="margin-bottom: 2rem">
                <p id="git-repo-sync-status-synced" class="hide">Codeberg and GitHub are both at <code id="git-repo-sync-status-synced-sha">...</code></p>
                <div id="git-repo-sync-status-outdated" class="hide">
                    <p>Codeberg is at <code id="git-repo-sync-status-outdated-codeberg-sha">...</code></p>
                    <div class="flex" style="gap: 2rem; margin-top: 0.4rem">
                        <div>
                            <p class="h6" style="margin-bottom: 0.2rem">Branch</p>
                            <p style="margin-top: 0.2rem">
                                { data.config.codeberg.branch }
                            </p>
                        </div>
                        <div>
                            <p class="h6" style="margin-bottom: 0.2rem">Total commits</p>
                            <p style="margin-top: 0.2rem" id="git-repo-sync-status-outdated-codeberg-commit-count">...</p>
                        </div>
                        <div>
                            <p class="h6" style="margin-bottom: 0.2rem">Last committed</p>
                            <p style="margin-top: 0.2rem" id="git-repo-sync-status-outdated-codeberg-timestamp">...</p>
                        </div>
                    </div>
                    <p>GitHub is at <code id="git-repo-sync-status-outdated-gh-sha">...</code></p>
                    <div class="flex" style="gap: 2rem; margin-top: 0.4rem">
                        <div>
                            <p class="h6" style="margin-bottom: 0.2rem">Branch</p>
                            <p style="margin-top: 0.2rem">
                                { data.config.gh.branch }
                            </p>
                        </div>
                        <div>
                            <p class="h6" style="margin-bottom: 0.2rem">Total commits</p>
                            <p style="margin-top: 0.2rem" id="git-repo-sync-status-outdated-gh-commit-count">...</p>
                        </div>
                        <div>
                            <p class="h6" style="margin-bottom: 0.2rem">Last committed</p>
                            <p style="margin-top: 0.2rem" id="git-repo-sync-status-outdated-gh-timestamp">...</p>
                        </div>
                    </div>
                </div>
            </div>
            {/if}

            {#if (data.apiUp && data.apiResponseErrorNotJSON) }
                <div class="box ohno">
                    <p>Qzfr-API is running, but responded with invalid JSON</p>
                </div>
            {:else if (data.apiUp && data.apiResponseErrorNoData) }
                <div class="box ohno">
                    <p>Qzfr-API is running, but responded with an error (and/or no data)</p>
                </div>
            {/if}

            {#if (data.apiUp) }
            <h4>Quizfreely-API is <span class="yay">running</span></h4>
            {:else}
            <h4>Quizfreely-API is <span class="ohno">down</span></h4>
            {/if}
            <div class="flex" style="gap: 2rem;">
                <div>
                    <p style="margin-bottom: 0.2rem;">DB Connection</p>
                    {#if (data.dbConnectionUp) }
                    <p class="h4 yay" style="margin-top: 0.2rem;">Up</p>
                    {:else if (data.apiUp) }
                        <p class="h4 ohno" style="margin-top: 0.2rem;">Down</p>
                    {:else}
                        <p class="h4 fg0" style="margin-top: 0.2rem;">No Info</p>
                    {/if}
                </div>
                <div>
                    <p style="margin-bottom: 0.2rem;">Cron Status</p>
                    {#if (data.apiUp && (data.apiCronAnyEnabled === true || data.apiCronAnyEnabled === false)) }
                        {#if (data.apiCronAnyEnabled) }
                            {#if (data.apiCronErrorCount >= 1) }
                                <p class="h4 ohno" style="margin-top: 0.2rem;">
                                    { data.apiCronErrorCount } Errors
                                </p>
                            {:else}
                                <p class="h4 yay" style="margin-top: 0.2rem;">No Errors</p>
                            {/if}
                        {:else }
                            <p class="h4 fg0" style="margin-top: 0.2rem;">Disabled</p>
                        {/if}
                    {:else }
                        <p class="h4 fg0" style="margin-top: 0.2rem;">No Info</p>
                    {/if}
                </div>
            </div>
            
            <h4>Quizfreely-web is <span class="yay">running</span></h4>
            <div class="flex" style="gap: 2rem;">
                <div>
                    <p style="margin-bottom: 0.2rem;">Cron Status</p>
                    <p class="h4 fg0" style="margin-top: 0.2rem;">N/A</p>
                </div>
            </div>
        </div>
      </div>
    </main>
