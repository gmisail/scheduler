<script lang="ts">
    import {
        ArrowBigLeft,
        ArrowBigRightDashIcon,
        ArrowRight,
        ChevronLeft,
        ChevronRight,
    } from "@lucide/svelte";

    let { currentSchedule = $bindable(), numSchedules } = $props();

    const nextSchedule = () => {
        currentSchedule = Math.min(currentSchedule + 1, numSchedules - 1);
    };

    const prevSchedule = () => {
        currentSchedule = Math.max(0, currentSchedule - 1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key == "ArrowLeft") {
            prevSchedule();
        } else if (e.key == "ArrowRight") {
            nextSchedule();
        }
    };
</script>

<div class="mb-4 flex items-center justify-between">
    <button
        class={{
            "rounded-md disabled:opacity-50 selected:bg-blue-200 dark:text-white dark:bg-black/10 hover:bg-black/5 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-2": true,
        }}
        disabled={currentSchedule === 0 || numSchedules === 0}
        onclick={prevSchedule}
    >
        <ChevronLeft />
    </button>
    <div class="dark:text-white font-semibold">
        {#if numSchedules > 0}
            {currentSchedule + 1} / {numSchedules}
        {:else}
            <i>No schedules available.</i>
        {/if}
    </div>
    <button
        class={"rounded-md disabled:opacity-50 dark:text-white dark:bg-black/10 hover:bg-black/5 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-2"}
        onclick={nextSchedule}
        disabled={currentSchedule === numSchedules - 1 || numSchedules === 0}
    >
        <ChevronRight />
    </button>
</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />
