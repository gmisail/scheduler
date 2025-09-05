<script lang="ts">
    import {
        type Block,
        type CourseData,
        type Section,
    } from "../../lib/catalog";
    import { DAY_LABEL, DAYS, formatTime } from "../../lib/day";
    import { scheduleState } from "../../lib/store";

    type CourseSectionProps = {
        section: Section;
        course: CourseData;
    };

    let { section, course }: CourseSectionProps = $props();

    let isSelected = $state(
        scheduleState.get().schedule.isSectionSelected(section),
    );

    const blocksByDay = $derived(
        Object.fromEntries(
            Object.entries(
                Object.groupBy(section.blocks, (block) => block.day),
            ).map(([day, blocks]) => [
                day,
                blocks?.sort((a, b) =>
                    a.start_time.localeCompare(b.start_time),
                ),
            ]),
        ),
    );

    const instructors = $derived([
        ...new Set(
            section.blocks
                .filter((block) => block.instructor != null)
                .map((block: Block) => block.instructor),
        ),
    ]);

    const buildings = $derived([
        ...new Set(
            section.blocks
                .filter((block) => block.building != null)
                .map((block: Block) => block.building),
        ),
    ]);

    const toggleSelect = () => {
        const currentState = scheduleState.get().schedule;

        scheduleState.set({
            schedule: currentState.toggleSection(section, course),
        });

        isSelected = !isSelected;
    };
</script>

<button
    class={{
        "w-full flex justify-between px-4 py-4 border-1 border-t-0 border-gray-300 dark:border-gray-600": true,
        "bg-blue-200 hover:bg-blue-200/50 dark:bg-blue-200/70 dark:hover:bg-blue-200/80 dark:text-black":
            isSelected,
        "hover:bg-black/5 dark:hover:bg-black/15 dark:text-white": !isSelected,
    }}
    onclick={toggleSelect}
>
    <div class="space-x-4">
        <span class="font-semibold">
            {section.crn}-{section.sec}
        </span>

        {#if instructors.length > 0}
            <span id="instructors">{instructors.join(", ")}</span>
        {/if}

        {#if section.sec.startsWith("OL")}
            <span>Online</span>
        {:else}
            <span>{buildings.join(", ")}</span>
        {/if}
    </div>
    <div class="text-left">
        {#each DAYS as DAY}
            <div>
                {#if DAY in blocksByDay}
                    <span class="font-semibold">
                        {DAY_LABEL.get(DAY) ?? ""}
                    </span>
                {/if}

                <span class="space-x-2">
                    {#each blocksByDay[DAY] ?? [] as block, i}
                        <span>
                            {formatTime(block.start_time)} to {formatTime(
                                block.end_time,
                            )}{i != (blocksByDay[DAY] ?? []).length - 1
                                ? ","
                                : ""}
                        </span>
                    {/each}
                </span>
            </div>
        {/each}
    </div>
</button>
