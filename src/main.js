import './style.scss'
import { createDialer } from './components/dialer.js'
import { initDialerScroll } from './components/dialerScroll.js'

document.querySelector('#app').innerHTML = `
  <div id="gallery">
  	<h1>Image Gallery</h1>
  </div>
  <div id="timeline" class="dialing">
	${createDialer()}
  </div>
`

initDialerScroll()