<script lang="ts">
    import { base } from '$app/paths';
    import { keyBindings, usedSkills } from '../stores/store';
    let config: { [key: string]: string } = $keyBindings;
    let keyNames = [
        'skill1',
        'skill2',
        'skill3',
        'skill4',
        'skill5',
        'skill6',
        'skill7',
        'skill8',
        'autoattack',
        'awakening',
        'special1',
        'special2' 
    ];

    let keyMap: { [key: string]: number } = {};
    keyNames.forEach((key, i) => {
        keyMap[key] = $usedSkills[i];
    })

    function handleKeyChange() {

    }
</script>

<div class="keybindings view">
    <table class="keybindings-content">
        {#each Object.entries(config) as [control, key]}
            <tr>
                <td class="keybinding-control">{control.toUpperCase()}</td>
                <td class="keybinding-skill"><img src="${base}/arcanist/{keyMap[key]}.webp"/></td>
                <td class="keybinding-input">
                    <input type="text" maxlength=1 bind:value={config[control]} />
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
    }

    td.keybinding-control {
        width: 4rem;
    }
    td.keybinding-skill {
        width: 64px;
    }
    td.keybinding-input {
        width: 10rem;
    }
</style>