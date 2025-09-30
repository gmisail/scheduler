<script lang="ts">
    import { type Block, type Course, type Section } from "@lib/catalog";
    import type { Term } from "@lib/term";
    import { DAY_LABEL, DAYS, formatTime } from "@lib/day";
    import superjson from "superjson";
    import {
        getScheduleState,
        isSectionSelected,
        toggleSection,
    } from "@lib/store/schedule";

    type CourseSectionProps = {
        term: Term;
        section: Section;
        course: Course;
        isLast: boolean;
    };

    let {
        term,
        section,
        course,
        isLast = false,
    }: CourseSectionProps = $props();

    let schedule = $derived(getScheduleState(term.id).get().schedule);
    let isSelected = $derived(isSectionSelected(schedule, section));

    const instructors = $derived([
        ...new Set(
            section.days
                .values()
                .flatMap((blocks) => blocks)
                .filter((block) => block.instructor != null)
                .map((block: Block) => block.instructor),
        ),
    ]);

    const buildings = $derived([
        ...new Set(
            section.days
                .values()
                .flatMap((blocks) => blocks)
                .filter((block) => block.building != null)
                .map((block: Block) => block.building),
        ),
    ]);

    const toggleSelect = () => {
        schedule = toggleSection(schedule, section, course);
        getScheduleState(term.id).set({ schedule });

        isSelected = !isSelected;
    };
</script>

<button
    class={{
        "w-full flex justify-between px-4 py-4 border-1 border-t-0 border-gray-300 dark:border-gray-600": true,
        "bg-blue-200 hover:bg-blue-200/50 dark:bg-blue-200/70 dark:hover:bg-blue-200/80 dark:text-black":
            isSelected,
        "hover:bg-black/5 dark:hover:bg-black/15 dark:text-white": !isSelected,
        "rounded-b-sm": isLast,
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
        {#each section.days.entries() as [day, blocks]}
            <div>
                <span class="font-semibold">
                    {DAY_LABEL.get(day) ?? "N/A"}
                </span>

                <span class="space-x-2">
                    {#each blocks as block, i}
                        <span>
                            {formatTime(block.start_time)} to {formatTime(
                                block.end_time,
                            )}{i != blocks.length - 1 ? "," : ""}
                        </span>
                    {/each}
                </span>
            </div>
        {/each}
    </div>
</button>
