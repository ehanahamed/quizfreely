<script>
    let { children, data } = $props();
    import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
    <link rel="stylesheet" href={ data.themeCss } />
</svelte:head>

{@render children()}
<Footer />
