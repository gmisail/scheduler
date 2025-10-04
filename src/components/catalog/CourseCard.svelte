<script lang="ts">
    import { onMount } from "svelte";
    import CourseSection from "./CourseSection.svelte";
    import type { Course, Section } from "@lib/catalog";
    import {
        getTermState,
        isSectionSelected,
        toggleSection,
        type ScheduleState,
    } from "@lib/store/schedule";
    import type { Term } from "@lib/term";

    const { term, course }: { term: Term; course: Course } = $props();

    let isOpen = $state(false);
    let schedule = $state<ScheduleState | undefined>(undefined);

    const anySelected = $derived(
        course.sections.some((section) => {
            return schedule?.selected.has(section.id);
        }),
    );

    function toggleCard() {
        isOpen = !isOpen;
    }

    function isSectionActive(section: Section) {
        return schedule ? isSectionSelected(schedule, section) : false;
    }

    function onSectionToggled(section: Section) {
        schedule = toggleSection(term, section, course);
    }

    onMount(() => {
        schedule = getTermState(term);
    });
</script>

<div
    class={{
        "mb-4": true,
        "rounded-sm outline-2 outline-blue-200 hover:outline-blue-200/50 dark:outline-blue-200/70 dark:hover:outline-blue-200/80 ":
            anySelected,
    }}
>
    <button
        class={{
            "w-full rounded-sm text-left dark:bg-black/10 hover:bg-gray-50 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-4": true,
            "rounded-b-none": isOpen,
        }}
        onclick={toggleCard}
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
                    isSelected={isSectionActive(section)}
                    onToggle={onSectionToggled}
                />
            {/each}
        {/if}
    </div>
</div>
