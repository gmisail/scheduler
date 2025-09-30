<script lang="ts">
    import CourseSection from "./CourseSection.svelte";
    import superjson from "superjson";

    const { term, course } = $props();

    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="mb-2">
    <button
        class={{
            "w-full rounded-sm text-left dark:bg-black/10 hover:bg-gray-50 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-4": true,
            "rounded-b-none": isOpen,
        }}
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

    <div class="rounded-b-sm bg-gray-100 dark:bg-black/25">
        {#if isOpen}
            {#each course.sections as section, i}
                <CourseSection
                    {term}
                    {section}
                    {course}
                    isLast={i === course.sections.length - 1}
                />
            {/each}
        {/if}
    </div>
</div>
