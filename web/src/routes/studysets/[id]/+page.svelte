<script>
    import StudysetPage from "../../StudysetPage.svelte";
    let { data } = $props();
</script>

<StudysetPage data={{ ...data, local: false }}/>
