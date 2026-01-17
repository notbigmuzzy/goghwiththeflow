import './style.scss'
import { createDialer } from './components/dialer.js'
import { createPreloader } from './components/preloader.js'
import { createMainPage } from './components/mainPage.js'
import { initDialerScroll } from './components/dialerScroll.js'

document.querySelector('#app').innerHTML = `
  <div id="gallery">
  	${createPreloader()}
	${createMainPage()}
  </div>
  <div id="timeline" class="dialing">
	${createDialer()}
  </div>
`

initDialerScroll()