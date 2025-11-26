chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'DELETE_LOCALSTORAGE') {
      const {host} = window.location;
        // console.log('Received a message from backend', request, host);

        if (request.domain === host) {
          localStorage.clear();

          if (host === 'bsky.app') {
            // this is only for bsky.app
            // ensure we close the welcomeModalClosed again
            // setting welcomeModalClosed true

            sessionStorage.setItem("welcomeModalClosed", "true");
          }

          window.location.reload();
        }
    }
});
