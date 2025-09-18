<script lang="ts">
    import {
        ArrowBigLeft,
        ArrowBigRightDashIcon,
        ArrowRight,
        ChevronLeft,
        ChevronRight,
    } from "@lucide/svelte";
    import {
        generateSchedules,
        type CatalogItem,
        type Section,
    } from "../../lib/catalog";
    import { getColorForCrn } from "../../lib/color";
    import { DAY_LABEL, DAYS } from "../../lib/day";
    import {
        isSectionSelected,
        scheduleState,
    } from "../../lib/store/schedule.svelte";
    import Event from "./Event.svelte";

    const schedule = $derived(scheduleState.get().schedule);

    const courses = $derived(schedule.courses.values().toArray());
    const courseMap = $derived(
        new Map(courses.map((course) => [course.id, course])),
    );

    const schedules = $derived.by(() => {
        let res: Section[][] = [];

        const filteredCourses = courses.map((course) => {
            const sections = course.sections.filter((section) => {
                return schedule.selected.has(section.id);
            });

            return { ...course, sections };
        });

        generateSchedules(filteredCourses, 0, [], res);
        return res;
    });

    let currentSchedule = $state(0);
    const numSchedules = $derived(
        schedules.filter((schedule) => schedule.length > 0).length,
    );

    const crns = $derived(
        schedules[currentSchedule]
            ?.map((section) => section.crn)
            .toSorted((a, b) => a - b),
    );

    const nextSchedule = () => {
        currentSchedule = Math.min(currentSchedule + 1, numSchedules - 1);
    };

    const prevSchedule = () => {
        currentSchedule = Math.max(0, currentSchedule - 1);
    };

    const sections = $derived(
        numSchedules > 0 ? (schedules[currentSchedule] ?? []) : [],
    );

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key == "ArrowLeft") {
            prevSchedule();
        } else if (e.key == "ArrowRight") {
            nextSchedule();
        }
    };
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

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

<div class="grid grid-cols-5 gap-4 mb-4">
    {#each DAYS as DAY}
        <div class="relative">
            <div class="text-center pb-2 dark:text-white">
                {DAY_LABEL.get(DAY)}
            </div>

            {#each sections as section}
                {#if isSectionSelected(schedule, section)}
                    {#each section.days.get(DAY) ?? [] as block}
                        <Event
                            title={courseMap.get(section.course_id)?.title ??
                                `id: ${section.course_id}`}
                            startTime={block.start_time}
                            endTime={block.end_time}
                            color={getColorForCrn(block.crn)}
                        >
                            <div>
                                {courseMap.get(section.course_id)?.subject}
                                {courseMap.get(section.course_id)?.number}
                            </div>
                            <div>
                                {section.crn}-{section.sec}
                            </div>
                            <div>{block.instructor}</div>
                            <div>{block.building} {block.room}</div>
                        </Event>
                    {/each}
                {/if}
            {/each}

            <div class="bg-gray-100 dark:bg-gray-700 rounded-md">
                {#each { length: 16 }, i}
                    <div
                        class={{
                            "h-[60px]": true,
                            "border-t-1 border-black/25": i > 0,
                        }}
                    ></div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<div class="space-x-2">
    {#each crns as crn}
        <span
            class="rounded-sm p-2"
            style={`background-color: ${getColorForCrn(crn)};`}
        >
            {crn}
        </span>
    {/each}
</div>
