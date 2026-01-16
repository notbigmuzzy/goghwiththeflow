import './style.scss'
import { createDialer } from './components/dialer.js'
import { createPreloader } from './components/preloader.js'
import { initDialerScroll } from './components/dialerScroll.js'

document.querySelector('#app').innerHTML = `
  <div id="gallery">
  	${createPreloader()}
  </div>
  <div id="timeline" class="dialing">
	${createDialer()}
  </div>
`

initDialerScroll()