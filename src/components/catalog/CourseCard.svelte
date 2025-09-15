<script lang="ts">
    import type { Block, Section } from "../../lib/catalog";
    import CourseSection from "./CourseSection.svelte";
    import superjson from "superjson";

    const { course } = $props();

    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="mb-2">
    <button
        class={"w-full text-left dark:bg-black/10 hover:bg-gray-50 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-4"}
        onclick={toggle}
    >
        <b class="mr-2 dark:text-white">
            {course.subject}
            {course.number}
        </b>
        <span class="dark:text-white">{course.title}</span>
        <p class="text-gray-800 dark:text-gray-100">
            {course.description}
        </p>
    </button>

    <div class="bg-gray-100 dark:bg-black/25">
        {#if isOpen}
            {#each course.sections as section, i}
                <CourseSection {section} {course} />
            {/each}
        {/if}
    </div>
</div>
