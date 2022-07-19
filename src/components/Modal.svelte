<script lang="ts">
    export let title: string;
</script>

<div class="modal-backdrop">

</div>
<div class="modal-container">
    <div class="modal-title">
        {title}
    </div>
    <div class="modal-content">
        <slot></slot>
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
        background: rgba(0,0,0,0.5);
    }

    .modal-container {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 99;
        display: flex;
        flex-flow: column;
        border-radius: 6px;
    }
    .modal-container .modal-title {
        border-bottom: 2px solid white;
    }
    .modal-container .modal-content {

    }
</style>