<script lang="ts">
    import { type Block, type Section } from "../../model/catalog";
    import { scheduleState } from "../../model/store";

    const DAYS = ["M", "T", "W", "Th", "F"];

    let { section }: { section: Section } = $props();
    let isSelected = $state(scheduleState.get().selected.has(section.id));

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
        ...new Set(section.blocks.map((block: Block) => block.instructor)),
    ]);

    const buildings = $derived([
        ...new Set(section.blocks.map((block: Block) => block.building)),
    ]);

    const toggleSelect = () => {
        const currentState = scheduleState.get().selected;
        if (isSelected) {
            currentState.delete(section.id);
            scheduleState.set({ selected: currentState });
        } else {
            scheduleState.set({ selected: currentState.add(section.id) });
        }

        isSelected = !isSelected;
    };

    function formatTime(dateTime: string): string {
        const [hours, minutes] = dateTime.split(":");
        const hourNum = parseInt(hours);
        const period = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    }
</script>

<button
    class={{
        "w-full flex justify-between px-4 py-4 border-1 border-t-0 border-gray-300": true,
        "bg-blue-200 hover:bg-blue-200/50": isSelected,
        "hover:bg-gray-200/50": !isSelected,
    }}
    onclick={toggleSelect}
>
    <div class="space-x-4">
        <span class="font-semibold">
            {section.crn}-{section.sec}
        </span>
        <span>{instructors.join(", ")}</span>
        <span>{buildings.join(", ")}</span>
    </div>
    <div class="text-left">
        {#each DAYS as DAY}
            <div>
                {#if DAY in blocksByDay}
                    <span class="font-semibold">
                        {DAY}
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
