<script>
    import Dashboard from "./Dashboard.svelte";
    import LandingPage from "./LandingPage.svelte";
    let authed = false;
</script>

{#if authed === true}
<Dashboard />
{:else}
<LandingPage />
{/if}
