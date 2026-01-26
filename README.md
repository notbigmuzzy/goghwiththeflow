# Ꞷ goghwiththeflow Ꞷ
A time-traveling art gallery that lets you scrub through 500 years of art history in seconds. Instead of jumping between static pages, you use a chronological slider to watch the world change from the 1400s to the 1900s—moving seamlessly from Renaissance to early 20th century.

If you ever wanted to scroll through 500 years of Art without a single loading spinner, this is it ;)

---

### Check it out at:
https://notbigmuzzy.github.io/goghwiththeflow/

---

## Tech & Fluidity
- The Star of the Show is absolutely wonderfull "The MET API" - https://metmuseum.github.io/
- To minimise impact on the API every time user want to quickly scrub to a certain year, I scraped the collection to build local JSON shards indexed by year. When you move the slider, the app pulls a tiny year.json file. It’s instant.
- GSAP handles the heavy lifting. The animations are timed to prevent "ghosting" or layout pops, making the transition between years feel like a single, continuous stream
- Mega-Image Zoom: Click any work to ping the API for the full-resolution source. Once the real file hits, it swaps the source and enables scroll-based scaling for looking at brushstrokes and other details

---
<img width="1300" height="800" alt="1" src="https://github.com/user-attachments/assets/81d960f0-ab6e-474b-9b58-45ef613a67bd" />
---
<img width="1300" height="800" alt="2" src="https://github.com/user-attachments/assets/a32e3a62-26c7-4767-9f3d-5bcaefbf8507" />
---
<img width="1300" height="800" alt="3" src="https://github.com/user-attachments/assets/c53c7614-af19-4e58-9a82-8ac91193bdcb" />
---
