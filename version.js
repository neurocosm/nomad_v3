// NOMAD Central Version Registry
// Edit this single line at the end of a session to update the version across all pages and modals.
window.NOMAD_VERSION = "v3.08302026.0722";

function applyNomadVersion() {
  const version = window.NOMAD_VERSION || "v3.0";

  // 1. Generic class / attribute selectors
  document.querySelectorAll('.nomad-version, [data-nomad-version]').forEach((el) => {
    el.textContent = version;
  });

  // 2. Specific ID hooks
  const modalVersion = document.getElementById('nomad-modal-version');
  if (modalVersion) {
    modalVersion.textContent = version;
  }

  const geekFirmware = document.getElementById('geek-system-firmware');
  if (geekFirmware) {
    geekFirmware.textContent = `SYSTEM FIRMWARE: ${version} // VT220-CRT`;
  }

  const featuresVersion = document.getElementById('features-version');
  if (featuresVersion) {
    featuresVersion.textContent = version;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyNomadVersion);
} else {
  applyNomadVersion();
}
