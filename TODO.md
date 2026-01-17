<!-- SKIP FOR NOW 

PHASE 1: HARVEST (Collecting MET Data)
[ ] Fetch Object IDs: Call the MET API search endpoint to retrieve a list of all IDs categorized as Paintings that have images.
[ ] Data Scraping: Iterate through the IDs and extract: objectID, title, artistDisplayName, objectBeginDate (year), and primaryImageSmall (image URL).
[ ] Cleanup: Remove any entries that are missing a year or a valid image URL.
[ ] Generate MEGA.json: Save the entire collection into a single master file on your local machine as a backup.

PHASE 2: SHARDING (Splitting by Year)
[ ] Develop Sharding Script: Create a script to parse MEGA.json and generate individual files for each year (e.g., data/years/1890.json).
[ ] Data Minification: Use abbreviated keys in the year-shards (e.g., "a" for artist, "t" for title, "u" for URL) to minimize file size.
[ ] Create Index Map: Generate a years_index.json file that lists all valid years containing artwork so the UI slider knows which steps to enable.

 -->

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
