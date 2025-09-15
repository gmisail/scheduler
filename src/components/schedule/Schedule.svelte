<script lang="ts">
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
    const numSchedules = $derived(schedules.length);

    const nextSchedule = () => {
        currentSchedule = Math.min(currentSchedule + 1, numSchedules - 1);
    };

    const prevSchedule = () => {
        currentSchedule = Math.max(0, currentSchedule - 1);
    };

    const sections = $derived(
        numSchedules > 0 ? (schedules[currentSchedule] ?? []) : [],
    );
</script>

<div class="mb-4 flex items-center justify-between">
    <button
        class={"w-20 selected:bg-blue-200 dark:text-white dark:bg-black/10 hover:bg-gray-50 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-2"}
        onclick={prevSchedule}
    >
        {"<"}
    </button>
    <div class="dark:text-white">
        {#if numSchedules > 0}
            {currentSchedule + 1} / {numSchedules}
        {:else}
            <i>No schedules available.</i>
        {/if}
    </div>
    <button
        class={"w-20 dark:text-white dark:bg-black/10 hover:bg-gray-50 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600 p-2"}
        onclick={nextSchedule}
    >
        {">"}
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
                            title={courseMap.get(section.course_id)?.title}
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
