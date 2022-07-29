<script lang="ts">
  import { base } from "$app/paths";
  import _ from "lodash";
  import { keyBindings, type KeyBindingConfig } from "../stores/store";

  function getKbName(i: number) {
    if (i < 8) {
      return "Skill " + (i + 1);
    } else if (i === 8) {
      return "Autoattack";
    } else if (i === 9) {
      return "Awakening";
    } else {
      return "Card " + (i - 9);
    }
  }

  function isExistingKey(key: string) {
    return _.filter($keyBindings, (kb) => kb.key === key).length > 1;
  }

  function isExistingSkill(id: number) {
    return (
      id > 199 && _.filter($keyBindings, (kb) => kb.skillId === id).length > 1
    );
  }

  function dragStart(event: DragEvent, srcIdx: number) {
    if (srcIdx > 7) return;

    const data = { srcIdx };
    event.dataTransfer!.setData("text/plain", JSON.stringify(data));
  }

  function drop(event: DragEvent, targetIdx: number) {
    event.preventDefault();
    if (targetIdx > 7) return;

    const json = event.dataTransfer!.getData("text/plain");
    const data = JSON.parse(json);

    const newConfig = _.clone($keyBindings);
    const srcConfig = newConfig[data.srcIdx];

    newConfig[data.srcIdx] = newConfig[targetIdx];
    newConfig[targetIdx] = srcConfig;
    updateStorage(newConfig);
  }

  function updateStorage(newConfig: KeyBindingConfig) {
    keyBindings.set(newConfig as KeyBindingConfig);
    localStorage.setItem("keyBindingsV2", JSON.stringify(newConfig));
  }

  function handleKeyChange(e: Event, i: number) {
    let newConfig = _.clone($keyBindings);
    newConfig[i].key = (e.target as HTMLInputElement).value;
    updateStorage(newConfig);
  }

  function getIcon(skillId: number) {
    if (skillId > -1) {
      return skillId;
    } else {
      return "blank";
    }
  }
</script>

<div class="keybindings">
  <table class="keybindings-content">
    <tr>
      <td class="keybinding-control">UNDO SKILL</td>
      <td class="keybinding-skill">
        <img class="lock" src="{base}/arcanist/lock-solid.svg" alt="lock" />
      </td>
      <td class="keybinding-input">
        <input type="text" value="Backspace" disabled />
      </td>
    </tr>
    <br />
    <tr>
      <td class="keybinding-control">SUBMIT</td>
      <td class="keybinding-skill">
        <img class="lock" src="{base}/arcanist/lock-solid.svg" alt="lock" />
      </td>
      <td class="keybinding-input">
        <input type="text" value="Enter" disabled />
      </td>
    </tr>
    <br />
    {#each $keyBindings as kb, i}
      <tr>
        <td class="keybinding-control">{getKbName(i)}</td>
        <td
          class="keybinding-skill"
          class:swappable={i < 8}
          draggable={i < 8}
          on:dragstart={(e) => dragStart(e, i)}
          on:drop={(e) => drop(e, i)}
          on:dragover={(e) => {
            e.preventDefault();
          }}
        >
          <div
            class:error={isExistingSkill(kb.skillId)}
            class="keybinding-skill-wrapper"
          >
            <img
              src="{base}/arcanist/{getIcon(kb.skillId)}.webp"
              alt="skill-key"
            />
          </div>
        </td>
        <td class="keybinding-input">
          <input
            type="text"
            class:error={isExistingKey(kb.key)}
            maxlength="1"
            on:change={(e) => handleKeyChange(e, i)}
            bind:value={kb.key}
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
  td.keybinding-control {
    text-align: right;
    text-transform: uppercase;
  }
  td.keybinding-skill {
    padding-left: 2rem;
    text-align: left;
  }
  td.keybinding-skill.swappable:hover {
    background-color: rgba(255, 255, 255, 0.06);
    cursor: pointer;
  }
  td.keybinding-skill img {
    width: 64px;
  }
  td.keybinding-skill .lock {
    width: 16px;
    margin-left: 1.5rem;
  }
  td.keybinding-input {
  }
  td.keybinding-input input {
    text-transform: uppercase;
    font-weight: 700;
    width: 5rem;
    border: 2px solid rgba(0, 0, 0, 0.4);
    text-align: center;
    border-bottom-width: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 0.5rem;
    border-radius: 7px;
    outline: none;
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
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .keybinding-skill-wrapper.error::after {
    background-color: rgba(193, 0, 13, 0.55);
  }

  .skill-selection {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
  }

  .skill-selection img {
    width: 64px;
  }
</style>
