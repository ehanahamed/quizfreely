<script>
    import Searchbar from "$lib/components/Searchbar.svelte";
    let { data } = $props();
</script>

<style>
.current::before {
	/* other existing rules */
	view-transition-name: active-page;
}
</style>

<header class="navbar with-search with-status">
    <div class="menu nav">
      <div class={ data?.page == "home" ? "current" : "" }>
        <a href="/home" class="clickable-effect">Home</a>
      </div>
      <div class={ data?.page == "explore" ? "current" : "" }>
        <a href="/explore" class="clickable-effect">Explore</a>
      </div>
      <div class={ data?.page == "settings" ? "current" : "" }>
        <a href="/settings" class="clickable-effect">Settings</a>
      </div>
    </div>
    {#if data?.hideSearchbar }
        <div class="search"></div>
    {:else}
    <div class="search">
        <Searchbar query={data?.searchQuery} />
    </div>
    {/if}
    <div class="status">
        {#if data?.authed }
            <div class="dropdown" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
                {#if data.authedUser.display_name.length < 10 }
                    <button class="faint">
                      <i class="nf nf-fa-user"></i>
                      <eta>= data.authedUser.display_name </eta>
                    </button>
                {:else}
                    <button class="faint">
                      <i class="nf nf-fa-user"></i>
                      Signed in
                    </button>
                {/if}
                <div class="content" style="right:0">
                  <a href="/users/<eta>= data.authedUser.id </eta>" class="button">Profile</a>
                  <a href="/settings" class="button">Settings</a>
                </div>
            </div>
        {:else}
        <div class="flex" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
          <a href="/sign-in" class="button alt">Sign in</a>
        </div>
        {/if}
    </div>
</header>
