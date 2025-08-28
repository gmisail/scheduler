<script lang="ts">
    import type { Block, Section } from "../../model/catalog";
    import CourseSection from "./CourseSection.svelte";

    const { course } = $props();

    let isOpen = $state(false);
    let selectedSections = $state(new Set());

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="mb-2">
    <button
        class={{
            "w-full text-left hover:bg-gray-50 border-1 border-gray-300 p-4": true,
        }}
        onclick={toggle}
    >
        <b class="mr-2">
            {course.subject}
            {course.number}
        </b>
        <span>{course.title}</span>
        <p class="text-gray-800">{course.description}</p>
    </button>

    <div class="bg-gray-100">
        {#if isOpen}
            {#each course.sections as section, i}
                <CourseSection {section} />
            {/each}
        {/if}
    </div>
</div>
