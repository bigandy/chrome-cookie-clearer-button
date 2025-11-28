import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: "Custom Storage Clearer",
  version: pkg.version,
  icons: {
    48: 'public/close-48.png',
  },
  action: {
    default_icon: {
      48: 'public/close-48.png',
    },
    // default_popup: 'src/popup/index.html',
  },
  "host_permissions": [
    "<all_urls>"
  ],
  permissions: [
    "browsingData",
    "activeTab",
    "scripting",
    "cookies",
    "tabs",
    'contentSettings',
    'storage'
  ],
  content_scripts: [{
    js: ['src/content/main.ts'],
    matches: ['https://*/*'],
  }],
  options_page: 'src/options/index.html',
  background: {
    service_worker: "src/background.ts",
    "type": "module"
  }
})
