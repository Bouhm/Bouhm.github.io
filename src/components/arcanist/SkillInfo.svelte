<script lang="ts">
    import { base } from '$app/paths';
    import type { Skill } from '../../data/arcanist/types';
    export let skill: Skill;
</script>

<div class="skill-detail">
    <div class="skill-detail">
        <img src={`${base}/arcanist/${skill.id}.webp`} />
        <div class="skill-name">{skill.name}</div>
    </div>
    <div class="skill-description">{skill.description}</div>
</div>

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