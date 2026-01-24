# Virtual Postcard (Canvas Export)
- Use an off-screen HTML5 Canvas.
	1. Draw the painting image to the canvas
	2. Add a "frame" border
	3. Draw the Title, Artist, and Year in a nice font at the bottom
	4. Add a small "GoghWithTheFlow" watermark
- canvas.toDataURL("image/png") triggers a download OR soc. share

# The Soundscape (Audio Crossfading)
- To make this work without the audio "glitching" when the user slides the bar quickly, use Web Audio API or a library like Howler.js.
- 3 or 4 ambient loops (Lute for Renaissance, Harpsichord for Baroque, Soft Piano for Impressionism).
- The Trigger: As getEra(year) changes, trigger a crossfade.
- The Feel: Volume of Era A goes to 0 while Era B goes to 0.5 over about 2 seconds.

# The "Curated Path" (Auto-Pilot)
- Basically a "Guided Tour." Since we have local shards, this is just a sequence of GSAP tweens.
- Create a highlights.json with an array of [year, id].
- A "Play" button that runs a loop:
- GSAP animates the slider value to the target year.
- The app loads the shard and renders.
- A 5-second pause.
- Move to the next highlight.

# NICE TO HAVE
- IndexedDB caching: Check IndexedDB before fetching year JSON files
- If cached, load instantly from disk
- If not cached, fetch from network then save to IndexedDB
- Consider using `idb` library wrapper for cleaner API
- Enables offline-first experience and instant repeat visits
