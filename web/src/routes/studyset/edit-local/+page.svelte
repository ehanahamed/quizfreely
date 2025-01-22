<script>
    import Edit from "../../Edit.svelte";
    let { data } = $props();
</script>

<Edit data={{ ...data, new: false, local: true }}/>
