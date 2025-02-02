# Icons in qzfr-web

Each icon is a SVG in a `.svelte` component under `web/src/lib/icons/`, they're svelte components so they can be imported into pages. So when our webapp is compiled, the icons are like bundled as part of the html without having to seperatly load.

So for example, an icon like this:
```html
<!-- web/src/lib/icons/example.svelte -->
<script>
    let { width, height } = $props();
</script>
<svg width="{width}" height="{height}" viewbox="0 0 12 34"></svg>
```

...would be used in a page/component like this:
```html
<!-- web/src/routes/example/+page.svelte -->
<script>
    import IconExample from "$lib/icons/example.svelte"
</script>
<div>
    <p>Example paragraph text</p>
    <button>
        <IconExample />
        Button text
    </button>
</div>
```

Since we're importing icons with svelte, they actually become part of the html when svelte compiles our app. This method with components and imports is better than icon fonts cause those fonts have thousands of icons that take a second to load, but not all of them are used each page. This is also better than loading actual seperate SVG files cause that would need multiple extra network requests and more loading time.
