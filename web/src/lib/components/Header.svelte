<script>
    import Searchbar from "$lib/components/Searchbar.svelte";
    import { page } from '$app/state';
</script>

<style>
.menu.nav > div {
  transition-duration: 0.4s;
}
.current {
  transition-duration: 0.4s;
}
</style>

<header class="navbar with-search with-status">
    <div class="menu nav">
      <div class={
        (page.data?.header?.activePage == "home") ? "current" : ""
      }>
        <a href="/home" class="clickable-effect">Home</a>
      </div>
      <div class={ page.data?.header?.activePage == "explore" ? "current" : "" }>
        <a href="/explore" class="clickable-effect">Explore</a>
      </div>
      <div class={ page.data?.header?.activePage == "settings" ? "current" : "" }>
        <a href="/settings" class="clickable-effect">Settings</a>
      </div>
    </div>
    {#if page.data?.header?.hideSearchbar }
        <div class="search"></div>
    {:else}
    <div class="search">
        <Searchbar query={page.data?.header?.searchQuery} />
    </div>
    {/if}
    <div class="status">
        {#if page.data?.authed }
            <div class="dropdown" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
                {#if page.data.authedUser.display_name.length < 10 }
                    <button class="faint">
                      <i class="nf nf-fa-user"></i>
                      <eta>= page.data.authedUser.display_name </eta>
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
        {:else if page.data?.header?.showSignUpLink}
        <div class="flex" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
          <a href="/sign-up" class="button alt">Sign up</a>
        </div>
        {:else}
        <div class="flex" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
          <a href="/sign-in" class="button alt">Sign in</a>
        </div>
        {/if}
    </div>
</header>
