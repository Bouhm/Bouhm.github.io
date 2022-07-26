<script lang="ts">
    import Modal from "./Modal.svelte";
    import Button from "./Button.svelte";
    export let onCloseStartInfo: ()=>void;
    export let onStartGame: ()=>void;

    function handleCloseModal() {
        onCloseStartInfo && onCloseStartInfo();
    }

    function handleStartGame() {
        onStartGame && onStartGame();
    }
</script>

<Modal title="Before you begin" onClose={handleCloseModal} >
    <div class="start-content">
        <h3>
        These are combos for intended for 332 (3 Stack skills, 3 Ruin skills, 2 Normal skills) Empress Arcanist.
        </h3>
        <h3>General Stacking</h3>
        <div> 
        Use Scratch Dealer + Quadra Accelerate or Spiral Edge twice (chain skill) to gain 4 stacks. 
        A tripod in Scratch Dealer provides attack speed to help land all Quadra Accelerate hits so it is used first.
        </div>
        
        <h3>Ruin Skill Priority</h3>
        <div>
        Although Secret Garden has the highest Damage Per Cooldown (DPC), it is difficult to manage optimal rotations off cooldowns. 
        Celestial Rain is realistically better as its longer range makes it easier to land.
        Serendipity is inefficient to use in most cases due to its long cooldown but can be used when
        either Secret Garden or Celestial Rain are halfway or more through their cooldowns.
        </div>

        <h3>Basic Rotation Pattern</h3>
        <div>
        The bread-and-butter combo is 4 stacks → Return → Ruin skill → 4 stacks → Ruin skill. 
        The two Ruin skills should be used during the duration of Return's buff.
        </div>
        <div>
        Refer to the Glossary for help if you need to review Arcanist skills.
        </div>
        <div class="start-info-actions">
            <Button onClick={handleStartGame}>Start</Button>
        </div>
    </div>
</Modal>

<style>
    .start-info-actions {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
    }

    @media (max-width: 600px) {
        h3 {
            font-size: 1.1em;
        }

        h3:not(:first-child) {
            margin-top: 2.5rem;
        }
    }
</style>