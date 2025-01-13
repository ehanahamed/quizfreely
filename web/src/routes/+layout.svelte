<script>
    let { children, data } = $props();
    import Header from '$lib/components/Header.svelte';
    import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
    <link rel="stylesheet" href={ data.themeCss } />
</svelte:head>

<Header />
{@render children()}
<Footer />
