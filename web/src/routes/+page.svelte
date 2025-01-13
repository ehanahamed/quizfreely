<script>
    import Dashboard from "./dashboard/Dashboard.svelte";
    import LandingPage from "./landing-page/LandingPage.svelte";
    let authed = false;
</script>

{#if authed === true}
<Dashboard />
{:else}
<LandingPage />
{/if}
