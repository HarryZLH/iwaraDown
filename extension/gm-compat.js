// GM_* API Compatibility Layer for Chrome Extension
// Maps Tampermonkey APIs to Chrome Extension APIs

class GMCompat {
  constructor() {
    this.values = {};
    this.listeners = {};
    this.loadFromStorage();
  }

  async loadFromStorage() {
    try {
      const result = await chrome.storage.local.get(null);
      this.values = result || {};
    } catch (e) {
      console.warn('Failed to load storage:', e);
    }
  }

  async saveToStorage() {
    try {
      await chrome.storage.local.set(this.values);
    } catch (e) {
      console.warn('Failed to save storage:', e);
    }
  }

  getValue(key, defaultValue) {
    return this.values[key] !== undefined ? this.values[key] : defaultValue;
  }

  setValue(key, value) {
    this.values[key] = value;
    this.saveToStorage();
    
    // Notify listeners
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => {
        try {
          callback(key, undefined, value, false);
        } catch (e) {
          console.error('Listener error:', e);
        }
      });
    }
  }

  deleteValue(key) {
    delete this.values[key];
    this.saveToStorage();
  }

  listValues() {
    return Object.keys(this.values);
  }

  addValueChangeListener(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
    return this.listeners[key].length - 1;
  }

  removeValueChangeListener(id) {
    // Simplified - in real implementation would track by ID
  }

  setClipboard(text) {
    navigator.clipboard.writeText(text).catch(e => {
      console.warn('Clipboard write failed:', e);
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  }

  download(options) {
    chrome.runtime.sendMessage({
      type: 'download',
      url: options.url,
      name: options.name,
      saveAs: options.saveAs || false
    });
  }

  openInTab(url, options) {
    chrome.runtime.sendMessage({
      type: 'openTab',
      url: url,
      active: options?.active !== false
    });
  }

  xmlHttpRequest(details) {
    // Use fetch API as replacement
    const controller = new AbortController();
    const timeoutId = details.timeout ? setTimeout(() => controller.abort(), details.timeout) : null;

    fetch(details.url, {
      method: details.method || 'GET',
      headers: details.headers || {},
      body: details.data || null,
      signal: controller.signal
    })
    .then(async response => {
      if (timeoutId) clearTimeout(timeoutId);
      
      const responseObj = {
        status: response.status,
        statusText: response.statusText,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        responseText: await response.text(),
        responseURL: response.url,
        readyState: 4
      };

      if (details.onload) details.onload(responseObj);
    })
    .catch(error => {
      if (timeoutId) clearTimeout(timeoutId);
      if (details.onerror) details.onerror(error);
    });

    return {
      abort: () => controller.abort()
    };
  }

  get info() {
    return {
      scriptHandler: 'iwaraDown Extension',
      version: '1.0',
      script: {
        name: 'iwaraDown（byHarryZhang）',
        version: '1.0'
      }
    };
  }
}

// Create global instance
window.GM = new GMCompat();

// Export GM_* functions for compatibility
window.GM_getValue = (key, defaultValue) => window.GM.getValue(key, defaultValue);
window.GM_setValue = (key, value) => window.GM.setValue(key, value);
window.GM_deleteValue = (key) => window.GM.deleteValue(key);
window.GM_listValues = () => window.GM.listValues();
window.GM_addValueChangeListener = (key, callback) => window.GM.addValueChangeListener(key, callback);
window.GM_removeValueChangeListener = (id) => window.GM.removeValueChangeListener(id);
window.GM_setClipboard = (text) => window.GM.setClipboard(text);
window.GM_download = (options) => window.GM.download(options);
window.GM_openInTab = (url, options) => window.GM.openInTab(url, options);
window.GM_xmlhttpRequest = (details) => window.GM.xmlHttpRequest(details);
window.GM_addStyle = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};
window.GM_info = window.GM.info;
window.unsafeWindow = window;