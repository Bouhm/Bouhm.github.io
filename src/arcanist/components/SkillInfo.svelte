<script lang="ts">
    import { base } from '$app/paths';
    import type { Skill } from '../data/types';
    export let skill: Skill;
    export let width = 64;
</script>

<tr class="skill-info">
    <td class="skill-detail">
        <img src={`${base}/arcanist/${skill.id}.webp`} width={width}/>
        <div class="skill-name">{skill.name}</div>
    </td>
    <td class="skill-description">{skill.description}</td>
</tr>

<style>
    .skill-info {
        display: flex;
        margin: 2rem 0;
    }
    .skill-detail {
        text-align: center;
        align-items: center;
        min-width: 10rem;
    }
    .skill-info img {
        height: auto;
    }
    .skill-description {
        font-size: 1.4em;
        margin-left: 1.4rem;
    }
</style>