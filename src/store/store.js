import { Store } from 'svelte/store.js';
import API from '../utils/api.js';

class HomePageStore extends Store {
  constructor(state) {
    super(state);
  }

  async init() {
    const sites = await API.getSites();
    const notifications = await API.getNotificationStatus();
    let quotes = [];
    let rawQuotes = await API.getQuotes();
    rawQuotes = rawQuotes.length == 0
      ? ['How are you doing today']
      : rawQuotes ;
    rawQuotes.forEach(quote => quotes.push('- ' + quote));
    // Select quote before the quotes object is stringified
    const quote = rawQuotes[Math.floor(Math.random() * rawQuotes.length)];
    quotes = quotes.join('\n');
    this.set({sites, quotes, quote, notifications});
  }

  async toggleNotifications() {
    const notificationStatus = !this.get().notifications
    console.log(`Here ${notificationStatus}`)
    this.set({
      notifications: notificationStatus
    });
    await API.toggleNotifications(notificationStatus);
  }

  deleteSite(idx) {
    const sites = this.get().sites;
    // Retain the old color
    const deleteSiteColor = sites[idx].color;
    const newSitesList = [
      ...sites.slice(0, idx),
      {
        title: '',
        url: '',
        color: deleteSiteColor,
        character: '-'
      },
      ...sites.slice(idx+1)
    ];
    this.set({
      sites: newSitesList
    });
    this.saveSites(newSitesList);
  }

  updateSite(idx, property, value) {
    const sites = this.get().sites;
    sites[idx][property] = value;
    this.set({sites: sites});
  }

  saveSites(){
    API.saveSites(JSON.parse(JSON.stringify(this.get().sites)));
    this.set({sites: this.get().sites});
  }

  updateQuotes(quotes) {
    this.set({quotes: quotes});
  }

  saveQuotes() {
    API.setQuotes(this.get().quotes);
  }

  importSites(siteList) {
    this.set({sites: siteList});
    this.saveSites(siteList);
  }

  exportSites() {
    return API.exportSites(JSON.stringify(this.get().sites));
  }
}

const store = new HomePageStore({
  sites: [],
  quotes: [],
  quote: '',
  showConfig: false,
  showQuickConfig: false,
  showConfigQuotes: false,
  quickConfigIdx: -1,
  quickConfigSite: {}
});

store.init();

export default store;
