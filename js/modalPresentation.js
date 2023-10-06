document.addEventListener('DOMContentLoaded', () => {
    const presentationModal = $('#presentationModal');
    const presentationPlayer = document.querySelector('#presentationModal .player');
    const presentationPlayerInstance = new Player(presentationPlayer);
    const presentationMobileMode = window.matchMedia('(max-width: 767px)');

    presentationModal.on('shown.bs.modal', () => {
        if (presentationMobileMode.matches) {
            presentationPlayerInstance.openFullscreen();
            presentationPlayer.addEventListener('exitFullscreen', () => {
                presentationModal.modal('hide');
            });
            return;
        }

        presentationPlayerInstance.playVideo();
    });

    presentationModal.on('hidden.bs.modal', () => {
        presentationPlayerInstance.pauseVideo();
    });
});
