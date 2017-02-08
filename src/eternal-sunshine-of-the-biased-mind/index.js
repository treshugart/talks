/* eslint import/no-webpack-loader-syntax: 0 */

import 'skatejs-web-components';
import '@skatejs/vert';
import html from 'raw-loader!./index.html';

document.getElementById('root').innerHTML = html;
