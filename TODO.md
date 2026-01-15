# Phase 0
- pick Tech (KISS)
- Vite, GSAP
- Harvesting Script (creates MEGA JSON) Decide which programming language to use (Node.js)
- choose animation scafolding
	- bottom dial for years ( semi circle, can be dragged with mouse, reacts on scroll, ??? )
	- while year scroll happens spawn skeleton card divs (10-15) that fly around instantly (animated before data loads)
	- once year JSON fetches, populate skeletons with actual <img> tags and fade/reveal
	- gallery with "random" moving photos ( 10 - 15 )
	- click on details ( color/card disolve or flip the card )
	- card can be zoomed or moved around
	- user can dig-down in the related to this photo ( what animation for this? )

# Phase 1: The One-Time "Harvest" (Build Step)
- Authentication: get API keys from WikiArt.
- The Artist Crawl: call the /AlphabetJson endpoint to get a list of all 3,000 artists.
- The Portfolio Dive: For each artist, call /PaintingsByArtist.
- The Cleanup: Script strips out the junk and keeps: ID, Artist, Title, Year, Style, Genre, Image URL.
- The Link Maker: Script looks at the Style and Genre and picks 3–5 IDs for the related field in each painting object.

# Phase 2: Data Sharding (Preparation for GH Pages)
*MEGA JSON*
- Step A: Create a folder named /data.
- Step B: The script runs through the MEGA JSON and create a separate file for every year (e.g., 1889.json, 1920.json).
- Step C: Create a master_map.json. This is a small "index" that tells the app which year a specific painting ID belongs to (e.g., {"p-starry-night": 1889}).

# Phase 3: The Frontend (User Experience)
- The Slider: When the user moves the slider to 1920, the app does fetch('./data/1920.json').
- The Gallery: The app loops through that year's data and builds the <img> tags.
- User clicks a painting.
- The app reads the related array from the current image.
- It looks up those IDs in the master_map.json to see which year-files they are in.
- It fetches those years and pulls out the images to show them.

# Phase 3.5: Polish (NICE TO HAVE)
- IndexedDB caching: Check IndexedDB before fetching year JSON files
- If cached, load instantly from disk
- If not cached, fetch from network then save to IndexedDB
- Consider using `idb` library wrapper for cleaner API
- Enables offline-first experience and instant repeat visits

# Phase 4: Deployment
- Git Push: upload index.html, CSS, JS, and the entire /data folder to GitHub.
- Setup GitHub Pages
- Go Live
