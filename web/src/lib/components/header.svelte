<header class="navbar with-search with-status">
    <div class="menu nav">
      <div class={ data.page == "home" ? "current" : "" }>
        <a href="/home" class="clickable-effect">Home</a>
      </div>
      <div class={ data.page == "explore" ? "current" : "" }>
        class="current"
      <eta>}</eta> >
        <a href="/explore" class="clickable-effect">Explore</a>
      </div>
      <div class={ data.page == "settings" ? "current" : "" }>
        class="current"
      <eta>}</eta> >
        <a href="/settings" class="clickable-effect">Settings</a>
      </div>
    </div>
    <eta> if (data.hideSearchbar) { </eta>
    <div class="search"></div>
    <eta> } else { </eta>
    <div class="search">
      <eta>~ include("./searchbar", { searchQuery: data.searchQuery }) </eta>
    </div>
    <eta> } </eta>
    <div class="status">
      <eta> if (data.authed) { </eta>
      <div class="dropdown" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
        <eta> if (data.authedUser.display_name.length < 10) { </eta>
        <button class="faint">
          <i class="nf nf-fa-user"></i>
          <eta>= data.authedUser.display_name </eta>
        </button>
        <eta> } else { </eta>
        <button class="faint">
          <i class="nf nf-fa-user"></i>
          Signed in
        </button>
        <eta> } </eta>
        <div class="content" style="right:0">
          <a href="/users/<eta>= data.authedUser.id </eta>" class="button">Profile</a>
          <a href="/settings" class="button">Settings</a>
        </div>
      </div>
      <eta> } else { </eta>
        <div class="flex" style="margin-top:0px;margin-bottom:0px;margin-left:1rem;margin-right:1rem">
          <a href="/sign-in" class="button alt">Sign in</a>
        </div>
      <eta> } </eta>
    </div>
  </header>  