<script lang="ts">
    import { base } from '$app/paths';
    import _ from 'lodash';
    import { keyBindings, usedSkills, type KeyBindingConfig } from '../stores/store';
    let config: KeyBindingConfig = _.clone($keyBindings);
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

    function isExistingKey(key: string) {
        return _.filter(config, kb => kb.key === key).length > 1;
    }

    function handleKeyChange(e: Event, control: string) {
        let newConfig = _.clone(config);
        newConfig[control].key = (e.target as HTMLInputElement).value;
        keyBindings.set(newConfig as KeyBindingConfig);
    }
</script>

<div class="keybindings view">
    <table class="keybindings-content">
        {#each Object.entries(config) as [control, skillKey]}
            <tr>
                <td class="keybinding-control">{control.toUpperCase()}</td>
                <td class="keybinding-skill"><img src="{base}/arcanist/{keyMap[control]}.webp"/></td>
                <td class="keybinding-input">
                    <input type="text" class:error={isExistingKey(config[control].key)} maxlength=1 on:change={(e) => handleKeyChange(e, control)} bind:value={config[control].key} />
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
    td.keybinding-skill img {
        width: 64px;
    }
    td.keybinding-input {
        width: 10rem;
    }
    td.keybinding-input input.error {
        color: red;
    }
</style>