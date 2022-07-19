<script lang="ts">
    import { base } from '$app/paths';
    let altName = "Zzang";
    let name = "";
    let isValid = false;
    let isFree = false;
    // let idleVideo: HTMLVideoElement;
    let freeVideo: HTMLVideoElement;
    let isGuessing = true;

    // function getRandomItem(arr: string[]) {
    //     return arr[Math.floor(Math.random()*arr.length)]
    // }

    // function randomRepeatedChar(char: string, min: number, max: number) {
    //     const size = Math.floor(Math.random() * (max - min) + min);
    //     return Array(size).fill(char).map(_ => char);
    // }

    // function handleGenerateName() {
    //     // Because I dislike regex
    //     const prefixes = ['z', 's'];
    //     const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    //     const ends = ['g'];

    //     const newName = [
    //         ...randomRepeatedChar(getRandomItem(prefixes), 2, 3),
    //         ...randomRepeatedChar(getRandomItem(vowels), 1, 3),
    //         ...['N'],
    //         ...randomRepeatedChar(getRandomItem(ends), 1, 3)
    //     ].join('')

    //     altName = newName;
    // }

    function handleKeyPress(e: KeyboardEvent) {
        if (e.code === "Enter") {
            checkName();
        }
    }

    function checkName() {
        isGuessing = false;
        const regex = new RegExp("^(z{1,3}|s{1,3})(a{1,3}|e{1,3}|i{1,3}|o{1,3}|u{1,3}|y{1,3})(n)(g{1,3})$");
        isValid = regex.test(name);

        if (isValid && !isFree) {
            isFree = true;
            freeVideo.play();

            setTimeout(
                function() {
                    isFree = false;
                    freeVideo.pause();
                }
            , 3000);

            freeVideo.currentTime = 0;
        }
    }
</script>

<svelte:head>
  <title>Zzang Alt Checker</title>
</svelte:head>

<main>
    <!-- 2 videos for smooth transitions -->
    <div class="video-background">
        <video
            src={`${base}/idle.webm`}
            type='video/webm'
            autoplay
            loop
        />
        <video
            class="freedeo"
            class:show={isFree} 
            bind:this={freeVideo}
            src={`${base}/free.webm`}
            type='video/webm'
        />
    </div> 
	<!-- <h1>#FREE<span>{altName}</span></h1> -->
    <!-- <div class="button" on:click={handleGenerateName}>NEW ALT</div> -->

    <div class="input-area">
        <h1>#FREE</h1>
        <input type="text" bind:value={name} on:keypress={handleKeyPress} on:input={() => isGuessing = true} autofocus />
    </div>
    <div class:disabled={name.length===0} class="button" on:click={checkName}>{name.toUpperCase() === "ZZANG" ? "DUH" : "IS IT ZZANG?"}</div>
    <img class:faded={isGuessing} class={isValid ? "correct" : "incorrect"} src={`${base}/thumbsup.png`} />
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@700');

    .video-background {
        z-index: -3;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .video-background video {
        z-index: -2;
        min-width: 100%;
        min-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        object-fit: cover;
        filter: brightness(70%);
    }
    .video-background .freedeo {
        z-index: -1;
        visibility: hidden;
        opacity: 0;
        transition-property: visibility;
        transition: visibility 0s 1.5s, opacity 1.5s linear;
    }
    .video-background .freedeo.show { 
        visibility: visible;
        opacity: 1;
        transition-property: visibility;
        transition: opacity 0.5s linear;
    }
        
    main {
        color: white;
        width: 100%;
        display: flex;
        align-items: center;
        flex-flow: column;
        margin: 0 auto;
    }

    h1, .input-area, img, .button {
        z-index: 2;
    }

    .button {
        font-family: 'Lato', sans-serif;
        text-align: center;
        border: 3px solid rgba(255,255,255,0.8);
        color: rgba(0,0,0,0.7);
        background-color: rgba(255,255,255,0.7);
        border-radius: 6px;
        padding: 0.5rem;
        width: 8rem;
    }
    .button.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    .button:hover {
        cursor: pointer;
        user-select: none;
        color: black;
        border-color: white;
        background-color: rgba(255,255,255,0.9)
    }
    
    .input-area {
        background: none;
        display: flex;
        margin-left: 4rem;
    }
    .input-area input {
        margin: 0;
        padding: 0;
        outline: none;
        border: none;
        background: none;
        caret-color: white;
        color: white;
        width: 14rem;
    }
    .input-area input:focus {
        outline: none;
    }

	h1 {
		color: grey;
    }
    h1, input {
        font-family: 'Bebas Neue', cursive;
        font-size: 4em;
		font-weight: 100;
    }

    img {
        margin-top: 2rem;
        width: 60px;
        height: auto;
        transition-duration: 0.8s;
        transition-property: transform;
    }
    img.faded {
        opacity: 0.1;
    }
    img.correct{
        transform: none;
    }
    img.incorrect{
        transform: rotate(180deg);
    }
</style>