/* global chrome */

function getText(selector) {
    const el = document.querySelector(selector);
    return el ? el.innerText.trim() : '';
  }
  
  function extractJobData() {
    const hostname = window.location.hostname;
    let title = '', company = '', location = '', description = '';
  
    if (hostname.includes('linkedin.com')) {
      title = getText('h1');
      company = getText('.topcard__org-name-link');
      location = getText('.topcard__flavor--bullet');
      description = getText('.description__text');
    } else if (hostname.includes('indeed.com')) {
      title = getText('h1');
      // company = getText('.jobsearch-CompanyInfoContainer');
      const companyEl = document.querySelector('[data-company-name]');
      company = companyEl ? companyEl.innerText.trim() : '';
      location = getText('.jobsearch-CompanyInfoContainer div:nth-child(2)');
      description = getText('#jobDescriptionText');
    }
  
    return {
      title,
      company,
      location,
      description,
      link: window.location.href,
      posted: new Date().toISOString(),
      source: hostname
    };
  }
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'getJobData') {
      sendResponse(extractJobData());
    }
  });
  