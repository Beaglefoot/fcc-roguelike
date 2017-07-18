import { JSDOM } from 'jsdom';
import moment from 'moment';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = document.defaultView;

Object.keys(window).forEach(key => {
  if (!(key in global)) global[key] = window[key];
});

console.log(`---------------${moment().format('HH:mm:ss')}---------------`);
