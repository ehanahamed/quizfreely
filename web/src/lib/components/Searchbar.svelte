<script>
    let props = $props();
    /* remove whitespace so textbox's placeholder/label shows if empty and use ?? to default to empty string instead of throwing error on undefined */
    let query = (props.query ?? "").replace(/\s+/g, '');;

    function onSearchbarInput(event) {
        if (event.target.value.length > 0 && event.target.value.length < 50) {
            fetch(
                "/api/v0/public/search/queries?q=" + encodeURIComponent(event.target.value)
            ).then(function (response) {
                response.json().then(function (responseJson) {
                    if (responseJson.data && responseJson.data.queries && responseJson.data.queries.length > 0) {
                        /* clear old items */
                        document.getElementById("searchbar-autocomplete").innerHTML = "";
                        /* iterate over queries and add their link element to the list */
                        for(var i = 0; i < responseJson.data.queries.length; i++) {
                            var link = document.createElement("a");
                            link.href = "/search?q=" + encodeURIComponent(
                                responseJson.data.queries[i].query
                            );
                            link.innerText = responseJson.data.queries[i].query;
                            document.getElementById("searchbar-autocomplete").appendChild(link);
                        }
                        /* show the container */
                        document.getElementById("searchbar-autocomplete").classList.remove("hide");
                    } else {
                        /* hide and clear container on error */
                        document.getElementById("searchbar-autocomplete").classList.add("hide");
                        document.getElementById("searchbar-autocomplete").innerHTML = "";
                    }
                }).catch(function (error) {
                    /* hide and clear container on error */
                    document.getElementById("searchbar-autocomplete").classList.add("hide");
                    document.getElementById("searchbar-autocomplete").innerHTML = "";
                    console.error(error);
                })
            }).catch(function (error) {
                document.getElementById("searchbar-autocomplete").classList.add("hide");
                document.getElementById("searchbar-autocomplete").innerHTML = "";
                console.error(error);
            })
        } else {
            document.getElementById("searchbar-autocomplete").classList.add("hide");
            document.getElementById("searchbar-autocomplete").innerHTML = "";
        }
    }
</script>

<form action="/search" method="get" class="searchbar with-autocomplete" style="margin-bottom:0px">
    <i class="searchbar-icon nf nf-fa-search"></i>
    <input type="text"
        name="q"
        id="searchbar-input"
        placeholder="Search"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        value={ query }
        oninput={
            onSearchbarInput
        }
    />
    <div id="searchbar-autocomplete" class="searchbar-autocomplete hide"></div>
</form>
