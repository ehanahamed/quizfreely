<script>
    import Searchbar from "$lib/components/Searchbar.svelte";
    import { page } from '$app/state';
    import { fly } from 'svelte/transition';

    import IconMenu from "$lib/icons/Menu.svelte";
    import IconUser from "$lib/icons/User.svelte";
    import IconCloseXMark from "$lib/icons/CloseXMark.svelte";
    import { afterNavigate } from "$app/navigation";

    let sideBarNavMenuThingyVisible = $state(false);
    function openSideBarNavMenuThingy() {
      sideBarNavMenuThingyVisible = true;
      //document.body.addEventListener("click", closeSideBarNavMenuThingy);
    }
    function closeSideBarNavMenuThingy() {
      sideBarNavMenuThingyVisible = false;
    }
    afterNavigate(function () {
      closeSideBarNavMenuThingy();
    })
</script>

<style>
.menu.nav > div {
  transition-duration: 0.4s;
}
.current {
  transition-duration: 0.4s;
}
.side-bar-nav-menu-thingy {
  margin: 0px;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 1rem;
  background-color: var(--bg1);
}
</style>

<header class="navbar with-search with-status">
    <div class="menu nav">
      <div class="side-bar-nav-menu-thingy-open-div">
        <button class="icon-only-button side-bar-nav-menu-thingy-open-button" onclick={openSideBarNavMenuThingy} aria-label="Menu">
          <IconMenu />
        </button>
      </div>
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
            <!--<div class="dropdown" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
                {#if page.data.authedUser.display_name.length < 10 }
                    <button class="faint">
                      <IconUser />
                      { page.data.authedUser.display_name }
                    </button>
                {:else}
                    <button class="faint">
                      <IconUser />
                      Signed in
                    </button>
                {/if}
                <div class="content" style="right:0">
                  <a href="/users/{ page.data.authedUser.id }" class="button">Profile</a>
                  <a href="/settings" class="button">Settings</a>
                </div>
            </div>-->
            <div style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
              {#if page.data.authedUser.display_name.length < 10 }
                  <a href="/settings" class="button faint">
                    <IconUser />
                    { page.data.authedUser.display_name }
                  </a>
              {:else}
                  <a href="/settings" class="button faint">
                    <IconUser />
                    Signed in
                  </a>
              {/if}
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
{#if sideBarNavMenuThingyVisible}
<div class="side-bar-nav-menu-thingy" transition:fly={{ x: -200, duration: 240 }}>
  <button class="icon-only-button" onclick={closeSideBarNavMenuThingy} aria-label="Close Menu">
    <IconCloseXMark />
  </button>
  <a href="/home">Home</a>
  <a href="/explore">Explore</a>
  <a href="/settings">Settings</a>
  <a href="/abc">Nothing</a>
  <a href="/search">Search</a>
</div>
{/if}
