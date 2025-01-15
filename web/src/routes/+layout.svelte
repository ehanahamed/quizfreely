<script>
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";
let { children } = $props();
</script>

<div style="min-height: 80vh">
    <Header />
    {@render children()}
</div>
<Footer />
