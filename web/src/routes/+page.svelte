<script>
    import Dashboard from "./dashboard/+page.svelte";
    import LandingPage from "./landing-page/+page.svelte";
    let { data } = $props();
</script>

{#if data?.dashboard == true}
<Dashboard data={ data } />
{:else}
<LandingPage data={ data } />
{/if}
