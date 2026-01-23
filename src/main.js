import './style.scss'
import { createDialer } from './components/dialer.js'
import { createNavBar } from './components/navbar.js'
import { createPreloader } from './components/preloader.js'
import { createMainPage } from './components/mainPage.js'
import { initDialerScroll } from './components/dialerScroll.js'

localStorage.removeItem('currentYear');

document.querySelector('#app').innerHTML = `
  <div id="gallery" class="landing-page">
 	${createMainPage()} 	
  	${createPreloader()}
  </div>
  <div id="navbar">
	${createNavBar()}
  </div>
  <div id="timeline" class="dialing">
	${createDialer()}
  </div>
`

initDialerScroll()