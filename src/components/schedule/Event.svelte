<script>
    // Schedule starts at 7 AM
    const Y_OFFSET = 7 * 60;

    const { title, startTime, endTime, color, children } = $props();

    const position = startTime - Y_OFFSET;
    const height = endTime - startTime;
</script>

<div
    class="absolute text-sm overflow-y-auto w-full p-2 z-2"
    style={`margin-top: ${position}px; height: ${height}px; background-color: ${color};`}
>
    <div class="font-medium">{title}</div>
    <div>
        {@render children()}
    </div>
</div>
