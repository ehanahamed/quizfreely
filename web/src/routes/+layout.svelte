<script>
    let { children, data } = $props();
</script>

<svelte:head>
    <link rel="stylesheet" href={ data.themeCSSHref } />
</svelte:head>

{@render children()}
