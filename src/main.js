import './css/style.css'

import router from './js/router';

const path = window.location.pathname
await router(window.location.pathname);
console.log(path)

