<script lang="ts">
    import {
        generateSchedules,
        type CatalogItem,
        type Section,
    } from "@lib/catalog";
    import { getColorForCrn } from "@lib/color";
    import { DAY_LABEL, DAYS } from "@lib/day";
    import { isSectionSelected, scheduleState } from "@lib/store/schedule";
    import Event from "./Event.svelte";
    import ScheduleBar from "./ScheduleBar.svelte";

    const schedule = $derived(scheduleState.get().schedule);
    const courses = $derived([...schedule.courses.values()]);
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

        const startTime = performance.now();
        generateSchedules(filteredCourses, 0, [], res);
        const endTime = performance.now();

        console.debug(
            `[scheduler] generated ${res.length} schedules in ${endTime - startTime} ms`,
        );

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

    const sections = $derived(
        numSchedules > 0 ? (schedules[currentSchedule] ?? []) : [],
    );

    function getTimeSlot(i: number): string {
        const hour = i + 7;

        if (hour > 12) {
            return `${hour % 12} PM`;
        } else {
            return `${hour} AM`;
        }
    }
</script>

<ScheduleBar bind:currentSchedule {numSchedules} />

<div class="grid gap-4 mb-6 grid-cols-[5%_1fr] items-end">
    <div>
        {#each { length: 16 }, i}
            <div class="relative h-[60px]">
                <span
                    class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs dark:text-white"
                >
                    {getTimeSlot(i)}
                </span>
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-5 gap-4">
        {#each DAYS as DAY}
            <div class="relative">
                <div class="text-center font-semibold pb-2 dark:text-white">
                    {DAY_LABEL.get(DAY)}
                </div>

                {#each sections as section}
                    {#if isSectionSelected(schedule, section)}
                        {#each section.days.get(DAY) ?? [] as block}
                            <Event
                                title={courseMap.get(section.course_id)
                                    ?.title ?? ""}
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
