import './style.scss'
import { createDialer } from './components/dialer.js'
import { createNavBar } from './components/navbar.js'
import { createPreloader } from './components/preloader.js'
import { createMainPage } from './components/mainPage.js'
import { initDialerScroll } from './components/dialerScroll.js'
import { initNavBar } from './components/navbarLogic.js'
import { initKeyboard } from './components/keyboard.js'

localStorage.removeItem('currentYear');

document.querySelector('#app').innerHTML = `
	<div id="gallery" class="landing-page">
 		${createPreloader()}	
  		${createMainPage()} 	
  	</div>
  	<div id="navbar">
		${createNavBar()}
  	</div>
  	<div id="timeline">
		${createDialer()}
  	</div>
`

initDialerScroll()
initNavBar()
initKeyboard()

// PWA
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js')
			.then((registration) => {
				// console.log('SW registered:', registration);
			})
			.catch((error) => {
				// console.log('SW registration failed:', error);
			});
	});
}
