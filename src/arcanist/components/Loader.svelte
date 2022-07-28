<script lang="ts">
</script>

<div class="loader-container">
  <loader />
  <h1>Loading...</h1>
</div>

<style>
  .loader-container {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin: 20% auto;
  }

  h1 {
    color: white;
  }

  loader {
    width: 30px;
    height: 50px;
    display: block;
    position: relative;
    background: white;
    border-radius: 4px;
  }

  loader::before,
  loader::after {
    content: "";
    position: absolute;
    width: 30px;
    height: 50px;
    border-radius: 4px;
    opacity: 0.5;
    background: white;
    transform-origin: bottom;
    animation-fill-mode: forwards;
  }

  loader::before {
    opacity: 0.2;
    left: 0;
    animation: 2.5s ease-in-out infinite loaderItem;
  }

  loader::after {
    opacity: 0.6;
    right: 0;
    animation: 2.5s ease-in-out infinite loaderItem;
    animation-direction: reverse;
  }

  @keyframes loaderItem {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-16deg) translateX(-16px);
    }
    50% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(16deg) translateX(16px);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>
