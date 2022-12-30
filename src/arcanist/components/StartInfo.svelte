<script lang="ts">
  import Button from "./Button.svelte";
  export let onStart: (() => void) | null = null;
  export let showStartButton = false;

  function handleClickStart() {
    onStart && onStart();
  }
</script>

<div class="start-content">
  <h3>AS OF THE BALANCE CHANGES IN 11/16/2022 THIS GUIDE IS NO LONGER UP-TO-DATE</h3>
  <h3>
    These are combos for intended for 332 (3 Stack skills, 3 Ruin skills, 2
    Normal skills) Empress Arcanist.
  </h3>

  <h3>General Stacking</h3>
  <div>
    Use Scratch Dealer + Quadra Accelerate or Spiral Edge twice (chain skill) to
    gain 4 stacks. The Safety Device Tripod in Scratch Dealer provides attack
    speed to shorten Quadra Accelerate animation so it is used first. Call of
    Destiny will also typically be used prior to Scratch Dealer, and whenever it
    can be wove in for the attack speed buff.
  </div>

  <h3>Ruin Skill Priority</h3>
  <div>
    Although Secret Garden has the highest Damage Per Cooldown (DPC), it is
    difficult to manage optimal rotations off cooldowns. Celestial Rain is
    realistically better as its longer range makes it easier to land.
    Serendipity is inefficient to use in most cases due to its long cooldown but
    can be used when either Secret Garden or Celestial Rain are halfway or more
    through their cooldowns.
  </div>

  <h3>Basic Rotation Pattern</h3>
  <div>
    The bread-and-butter combo is 4 stacks → Return → Ruin skill → 4 stacks →
    Ruin skill. The two Ruin skills should be used during the duration of
    Return's buff.
  </div>
  <div>
    Refer to the Glossary for help if you need to review Arcanist skills.
  </div>
  {#if showStartButton}
    <div class="start-button">
      <Button onClick={handleClickStart}>Start</Button>
    </div>
  {/if}
</div>

<style>
  h3 {
    font-size: 1.4em;
  }
  .start-content div {
    font-size: 1.3em;
    margin-bottom: 1rem;
  }
  .start-button {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 600px) {
    h3 {
      font-size: 1.1em;
    }

    .start-content div {
      font-size: 1em;
    }

    h3:not(:first-child) {
      margin-top: 2.5rem;
    }
  }
</style>
