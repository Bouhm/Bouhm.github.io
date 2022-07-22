<script lang="ts">
    import { base } from '$app/paths';
    import type { Skill } from '../../data/arcanist/types';
    export let skill: Skill;
</script>

<tr class="skill-detail">
    <td class="skill-detail">
        <img src={`${base}/arcanist/${skill.id}.webp`} />
        <div class="skill-name">{skill.name}</div>
    </td>
    <td class="skill-description">{skill.description}</td>
</tr>

<style>
    .skill-info {
        display: flex;
    }
    .skill-detail {
        display: flex;
        flex-flow: column;
        align-items: center;
    }
    .skill-info img {
        width: 64px;
        height: auto;
    }
</style>