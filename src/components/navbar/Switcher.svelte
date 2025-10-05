<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";

    const { terms, term: currentTerm } = $props();

    const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const termId = event.currentTarget?.value;

        if (!termId) {
            return;
        }

        const nextUrl = location.pathname.replace(currentTerm.id, termId);
        location.assign(nextUrl);
    };
</script>

<select
    class="p-2 rounded-sm font-semibold hover:bg-black/10"
    onchange={handleChange}
>
    {#each terms as term}
        <option selected={term?.id === currentTerm?.id} value={term?.id}>
            {term?.label}
        </option>
    {/each}
</select>
