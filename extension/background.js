// Background Service Worker for iwaraDown Extension

// Handle download requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'download') {
    chrome.downloads.download({
      url: message.url,
      filename: message.name || 'iwara-download.mp4',
      saveAs: message.saveAs || false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
      }
      sendResponse({ success: !!downloadId, downloadId });
    });
    return true; // Keep message channel open for async response
  }

  if (message.type === 'openTab') {
    chrome.tabs.create({
      url: message.url,
      active: message.active !== false
    }, (tab) => {
      sendResponse({ success: true, tabId: tab.id });
    });
    return true;
  }

  if (message.type === 'getSettings') {
    chrome.storage.local.get(message.keys || null, (result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === 'setSettings') {
    chrome.storage.local.set(message.data, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Toggle content script on current tab
  if (tab.url && (tab.url.includes('iwara.tv') || tab.url.includes('iwara.moe'))) {
    chrome.tabs.sendMessage(tab.id, { type: 'toggle' });
  }
});

// Handle install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('iwaraDown extension installed');
    // Set default settings
    chrome.storage.local.set({
      uiScale: 50,
      downloadPath: '/Iwara/%#AUTHOR#%/%#TITLE#%[%#ID#%].mp4',
      downloadType: 3
    });
  }
});