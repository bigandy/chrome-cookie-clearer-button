
const { host } = window.location;

if (host === 'bsky.app') {
  sessionStorage.setItem("welcomeModalClosed", "true");
}