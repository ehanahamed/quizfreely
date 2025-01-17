<script>
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";
import { fade } from "svelte/transition";
let { children, data } = $props();
</script>

<Header />
{#key data.urlPathname}
<div in:fade={{ duration: 250, delay: 250 }} out:fade={{ duration: 250 }}>
    <div style="min-height: 70vh">
        {@render children()}
    </div>
    <Footer />
</div>
{/key}
