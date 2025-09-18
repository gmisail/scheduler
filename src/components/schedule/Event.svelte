<script>
    // Schedule starts at 7 AM
    const Y_OFFSET = 7 * 60;

    const { title, startTime, endTime, color, children } = $props();

    const position = $derived(startTime - Y_OFFSET);
    const height = $derived(endTime - startTime);
</script>

<div
    class="absolute text-sm overflow-y-auto w-full p-2 z-2 rounded-md"
    style={`margin-top: ${position}px; height: ${height}px; background-color: ${color};`}
>
    <div class="font-bold">
        {title}
    </div>
    <div>
        {@render children()}
    </div>
</div>
