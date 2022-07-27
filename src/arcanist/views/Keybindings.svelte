<script lang="ts">
    import { base } from '$app/paths';
    import _ from 'lodash';
    import { usedSkills, keyBindings, type KeyBindingConfig } from '../stores/store';
    import SkillKey from '../components/SkillKey.svelte';
    import Modal from '../components/Modal.svelte';

    let showSkillsModal: boolean;
    let clickedSkillSlot: string;

    function isExistingKey(key: string) {
        return _.filter($keyBindings, kb => kb.key === key).length > 1;
    }

    function isExistingSkill(id: number) {
        return id > 199 && _.filter($keyBindings, kb => kb.skillId === id).length > 1;
    }

    function updateStorage(newConfig: KeyBindingConfig) {
        keyBindings.set(newConfig as KeyBindingConfig);
        localStorage.setItem('keyBindings', JSON.stringify(newConfig));
    }

    function handleSkillSelect(skillId: number, control?: string) {
        const newConfig = _.clone($keyBindings);
        newConfig[control!].skillId = skillId;
        updateStorage(newConfig);
        showSkillsModal = false;
    }

    function handleClickSkill(control: string) {
        clickedSkillSlot = control;
        showSkillsModal = true;
    }

    function handleKeyChange(e: Event, control: string) {
        let newConfig = _.clone($keyBindings);
        newConfig[control].key = (e.target as HTMLInputElement).value;
        updateStorage(newConfig);
    }

    function getIcon(skillId: number) {
        if (skillId > -1) {
            return skillId
        } else {
            return 'blank'
        }
    }
</script>

<div class="keybindings">
    {#if showSkillsModal}
        <Modal title='Select Skill' onClose={() => showSkillsModal = false} >
            <div class="skill-selection">
                {#each _.orderBy($usedSkills, id => id) as skill}
                <img 
                    class="clickable"
                    src="{base}/arcanist/{skill}.webp"
                    on:click={() => handleSkillSelect(skill, clickedSkillSlot)}
                />
                {/each}
            </div>
        </Modal>
    {/if}
    <table class="keybindings-content">
        {#each Object.entries($keyBindings) as [control, skillKey], i}
            <tr>
                <td class="keybinding-control">{control.toUpperCase()}</td>
                <td 
                    class="keybinding-skill clickable" 
                >
                    <div 
                        on:click={() => handleClickSkill(control)}
                        class:error={isExistingSkill($keyBindings[control].skillId)} 
                        class="keybinding-skill-wrapper"
                    >
                        <img src="{base}/arcanist/{getIcon(skillKey.skillId)}.webp"/>
                    </div>
                </td>
                <td class="keybinding-input">
                    <input 
                        type="text" 
                        class:error={isExistingKey($keyBindings[control].key)} 
                        maxlength=1 
                        on:change={(e) => handleKeyChange(e, control)}
                        bind:value={$keyBindings[control].key} 
                    />
                </td>
            </tr>
        {/each}
    </table>
</div>


<style>
    .keybindings {
        display: flex;
        flex-flow: column;
        color: white;
    }

    .keybindings-content {
        table-layout: fixed;
        text-align: center;
    }
    td {
        width: 4rem;
    }
    td.keybinding-moveup, td.keybinding-movedown {
        width: 0.5rem;
    }
    td.keybinding-moveup img, td.keybinding-movedown img {
        width: 32px;
    }
    td.keybinding-skill img {
        width: 64px;
    }
    td.keybinding-input {
        width: 3rem;
    }
    td.keybinding-input input {
        font-weight: 700;
        width: 2rem;
    }
    td.keybinding-input input.error {
        color: red;
    }

    .keybinding-skill-wrapper {
        position: relative;
        width: 64px;
    }
    .keybinding-skill-wrapper.error > img {
        filter: grayscale(1);
    }

    .keybinding-skill-wrapper.error::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .keybinding-skill-wrapper.error::after {
        background-color: rgba(193,0,13,0.55);
    }

    .skill-selection {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
    }

    .skill-selection img {
        width: 64px;
    }
</style>