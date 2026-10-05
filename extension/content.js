// Content Script for iwaraDown Extension
// Loads the main userscript with GM_* API compatibility

(async function() {
  'use strict';

  // Wait for GM compatibility layer to be ready
  if (!window.GM) {
    console.warn('[iwaraDown] GM compatibility layer not loaded, waiting...');
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (window.GM) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 5000);
    });
  }

  // Initialize storage
  if (window.GM && window.GM.loadFromStorage) {
    await window.GM.loadFromStorage();
  }

  // Load the main script
  try {
    const scriptUrl = chrome.runtime.getURL('iwaraDown.user.js');
    const response = await fetch(scriptUrl);
    const scriptCode = await response.text();
    
    // Execute the script in page context
    const script = document.createElement('script');
    script.textContent = scriptCode;
    
    // Remove the userscript header if present
    // The script will use the GM_* functions from gm-compat.js
    
    document.head.appendChild(script);
    console.log('[iwaraDown] Script injected successfully');
  } catch (error) {
    console.error('[iwaraDown] Failed to load script:', error);
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'toggle') {
      // Toggle menu visibility
      const menu = document.getElementById('pluginMenu');
      if (menu) {
        menu.classList.toggle('expanded');
      }
      sendResponse({ success: true });
    }

    if (message.type === 'openSettings') {
      // Open settings panel
      if (window.editConfig) {
        window.editConfig.inject();
      } else {
        // Try to click the settings button
        const settingsBtn = document.querySelector('#pluginMenu li:last-child');
        if (settingsBtn) {
          settingsBtn.click();
        }
      }
      sendResponse({ success: true });
    }

    return true;
  });

  // Register keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC to close config panel
    if (e.key === 'Escape') {
      const configPanel = document.getElementById('pluginConfig');
      if (configPanel) {
        configPanel.remove();
      }
    }
  });

})();