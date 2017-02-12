/* eslint import/no-webpack-loader-syntax: 0 */
/* @ratpack { jsx: 'h' } */

import 'skatejs-web-components';
import { Deck, Slide } from '../_';
import html from 'raw-loader!./index.html';

customElements.define('sk-deck', Deck);
customElements.define('sk-slide', Slide);

document.getElementById('root').innerHTML = html;
