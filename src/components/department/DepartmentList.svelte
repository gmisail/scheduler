<script lang="ts">
    import { getTermState } from "@lib/store/schedule";
    import { onMount } from "svelte";

    const { departments, term } = $props();

    let selectedDepartments = $state(new Set());

    onMount(() => {
        const state = getTermState(term);
        selectedDepartments = new Set(
            state.courses.values().map((course) => course.subject),
        );
    });
</script>

{#each departments as department}
    <a href={"/" + term.id + "/subject/" + department.id.toUpperCase()}>
        <div
            class={{
                "p-4 rounded-sm dark:text-white dark:bg-black/10 hover:bg-gray-50 dark:hover:bg-black/20 border-1 border-gray-300 dark:border-gray-600": true,
                "outline-2 outline-blue-200 hover:outline-blue-200/50 dark:outline-blue-200/70 dark:hover:outline-blue-200/80 ":
                    selectedDepartments.has(department.id),
            }}
        >
            <b class="mr-2">{department.id}</b>
            <span>{department.name}</span>
        </div>
    </a>
{/each}
