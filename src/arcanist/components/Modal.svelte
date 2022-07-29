<script lang="ts">
  export let title: string;
  export let onClose: () => void;

  function handleKeyPress(e: KeyboardEvent) {
    e.preventDefault();
    if (e.code === "Escape") {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeyPress} />
<div class="modal-backdrop" />
<div class="modal-container animate__animated animate__fadeIn">
  <div class="modal-title">
    {title}
    <div class="modal-close  clickable" on:click={onClose}>✖</div>
  </div>
  <div class="modal-content">
    <slot />
  </div>
</div>

<style>
  .modal-backdrop {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 98;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    z-index: 99;
    display: flex;
    flex-flow: column;
    border-radius: 8px;
    padding: 1rem;
    background-color: #191328;
    min-width: 45rem;
    margin-top: 2rem;
    overflow-y: auto;
  }
  .modal-title {
    position: relative;
    text-transform: uppercase;
    font-weight: 700;
    padding-bottom: 1rem;
    font-size: 1.3em;
  }
  .modal-close {
    position: absolute;
    right: 0;
    top: 0;
  }
  .modal-container .modal-title {
    border-bottom: 2px solid white;
  }
  .modal-content {
    padding: 1rem;
  }

  @media (max-width: 600px) {
    .modal-container {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      min-width: 0;
      min-height: 0;
      transform: none;
      margin: 0;
    }
  }
</style>
