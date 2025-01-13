<script>
    import Dashboard from "./dashboard/Dashboard.svelte";
    import LandingPage from "./landing-page/LandingPage.svelte";
    let { data } = $props();
</script>

{#if data.dashboard == true}
<Dashboard />
{:else}
<LandingPage />
{/if}
