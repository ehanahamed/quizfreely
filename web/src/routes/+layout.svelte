<script>
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";
import { fade } from "svelte/transition";
let { children, data } = $props();
</script>

<div style="min-height: 80vh">
    <Header />
    {#key data.urlPathname}
    <div in:fade={{ duration: 250, delay: 250 }} out:fade={{ duration: 250 }}>
        {@render children()}
    </div>
    {/key}
</div>
<Footer />
