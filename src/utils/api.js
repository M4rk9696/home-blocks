const thenChrome = require('then-chrome');
const colors = [
  '#fcf3af',
  '#fba058',
  '#31cdd4',
  '#ffd1c6',
  '#70a4d8',
  '#9de0fc',
  '#c9bff4',
  '#30dca6',
  '#ffa3bb',
  '#a3c4fd'
];

function parseSites(sites) {
  var topSiteList = [];
  sites.forEach((site) => {
    if(!site.title) {
      site.title = '';
    }
    if(!site.url) {
      site.url = '';
    }
    topSiteList.push({
      title: site.title,
      url: site.url,
      color: colors[Math.floor(Math.random() * 10)],
      character: site.title.substring(0, 1)
    });
  });
  return topSiteList;
}

function ensureValidSites(sites) {
  for(var i=0; i < 20; ++i) {
    if(!sites[i]) {
      sites.push({
        title: '',
        url: '',
        color: colors[Math.floor(Math.random() * 10)],
        character: '-'
      });
    }
    else if(!sites[i].title) {
      sites[i].title = '';
      sites[i].character = '-';
    }
  }
  return sites;
}

function getSites() {
  return thenChrome.storage.sync.get(['page-topSites']).then((results) => {
    if(Object.keys(results).length === 0) {
      return new thenChrome.topSites.get().then((results) => {
        const siteList = ensureValidSites(parseSites(results.slice(0, 20)));
        this.saveSites(siteList);
        return siteList;
      });
    }
    else {
      return ensureValidSites(results['page-topSites'].slice(0, 20));
    }
  });
}

async function saveSites(siteList) {
  new thenChrome.storage.sync.set({'page-topSites': siteList});
}

export default {
  saveSites: saveSites,
  getSites: getSites,
  colors
};
