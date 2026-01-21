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

<img width="1302" height="838" alt="ss2" src="https://github.com/user-attachments/assets/e7987c6a-44a5-41c4-9fb5-7f95e20c0398" />

---

<img width="1299" height="841" alt="ss3" src="https://github.com/user-attachments/assets/5940f468-637c-4475-b71e-ed8c9dcdab57" />

---
