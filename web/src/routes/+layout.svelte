<script>
    let { children, data } = $props();
    import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href={ data.themeCss } />
</svelte:head>

<Header />
{@render children()}
