<script lang="ts">
  export let value: boolean
  export let label: string
  export let onChange: (val: boolean)=>void

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    onChange(target.checked)
  }
</script>

<label for={label}>{label}</label>
<input type="checkbox" name={label} class="suggestions-checkbox" bind:checked={value} on:change={handleChange}/>

<style>
  label {
    margin-bottom: 0.5rem;
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    background-color: none;
    margin: 0;
    font: inherit;
    color: white;
    width: 1.3em;
    height: 1.3em;
    border: 0.2em solid white;
    padding: 0.3rem;
    border-radius: 0.15em;
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;
  }

  input[type="checkbox"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    transform: scale(0);
    box-shadow: inset 1em 1em white;
    
    transform-origin: bottom left;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }
</style>