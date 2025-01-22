<script>
    import ReviewMode from "../../../ReviewMode.svelte"
    let { data } = $props();
</script>

<ReviewMode data={{ ...data, local: true }} />
