global.browser = require('webextension-polyfill');
global.browser = require('@webcomponents/webcomponentsjs/webcomponents-bundle');
global.browser = require('@webcomponents/webcomponentsjs/custom-elements-es5-adapter');
import { render, html } from 'lighterhtml';

require('@ionic/core/dist/ionic');
//
// document.createElement('ion-content')
// document.createElement('ion-app')
// document.createElement('ion-button')

window.customElements.define('my-sanaz', class extends HTMLElement {
  constructor() {
    super();
    this.state = { yup: 0, nope: 0 };
    this.render = render.bind(
      // used as update callback context
      this,
      // used as target node
      // it could either be the node itself
      // or its shadow root, even a closed one
      this.attachShadow({ mode: 'closed' }),
      // the update callback
      this.render,
    );
    // first render
    this.render();
  }

  render() {
    const { yup, nope } = this.state;
    return html`
    Isn't this <strong>awesome</strong>?
    <hr>
    <button data-key=yup onclick=${this}>yup ${yup}</button>
    <button data-key=nope onclick=${this}>nope ${nope}</button>
    <ion-app>
    <!-- Cool thing, the Ionic CSS utilities could be used too -->
        <ion-content text-center>
            <h1>Basic usage</h1>
            <!-- We add an ion-button with an onclick event -->
            <ion-button onclick=${this}>Click me ${nope}</ion-button>
        </ion-content>
    </ion-app>`;

  }

  handleEvent(event) {
    this[`on${event.type}`](event);
  }

  onclick(event) {
    event.preventDefault();
    const { key } = event.currentTarget.dataset;
    this.state[key]++;
    this.render();
  }
});
let root = document.createElement('my-sanaz');
root.setAttribute('style', `
        display:'none';
        background-color: #f5f5f6;
        position: fixed;
        top: 10%;
        right: 0;
        width: 65%;
        max-width: 400px;
        padding: 0px;
        box-sizing: border-box;
        z-index: 9999999999999999 ;`);
root.setAttribute('id', 'sanaz-container');

root.setAttribute('show', 'true');
document.body.appendChild(root);

window.addEventListener('message', function(event) {
  // We only accept messages from ourselves
  if (event.source !== window)
    return;

  if (event.data.type && (event.data.type === 'TFXI_HANDSHAKEُ')) {
    console.log('Sanaz received: ' + JSON.stringify(event.data));
  }
}, false);


chrome.runtime.onMessage.addListener((msgObj, sender, sendResponse) => {
  let sanazElement = document.getElementById('sanaz-container');
  if (msgObj.hasOwnProperty('event') && msgObj.event === 'toggle') {
    let showSanaz = sanazElement.style.display === 'block';
    showSanaz = !showSanaz;
    sanazElement.style.display = showSanaz ? 'block' : 'none';
    sanazElement.show = showSanaz ? 'true' : 'none';
  }
  sendResponse({ farewell: showSanaz ? 'Hi' : 'Goodbye' });
});