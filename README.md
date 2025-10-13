# 🎮 The Hair Game — AI Rebuild Edition

Welcome to **The Hair Game**!  
This version lets *anyone* — even beginners or kids — rebuild the full game automatically with **Copilot** or **Cursor** using the project’s DNA files.

---

## 🧩 What’s Included

In this folder, you’ll find:

| File / Folder | Description |
|----------------|-------------|
| `assets/` | All images and sounds (avatars, table, music, effects) |
| `assets/layout.json` | Full layout of the game (exact positions, sizes, z-index) |
| `css/style.css` | Complete style sheet — colors, fonts, and layout |
| `modules.json` | Descriptions of all JavaScript modules and their logic |
| `README.md` | This instruction file (you’re reading it!) |

---

## 🚀 How to Use Copilot or Cursor to Build the Game

> 🧠 **Goal:** Rebuild the entire game *exactly* as the original, down to each pixel and value.

Follow these steps carefully 👇

---

### 1️⃣ Prepare Your Environment

1. Open **VS Code** (with GitHub Copilot or Cursor installed).  
2. Create a **new empty folder** for the project.  
3. Copy these items into the folder:
ChatGPT said:

🔥 Perfect — now you’re at the sweet spot where your project can be rebuilt 1:1 by AI from metadata only.

Let’s keep this ultra-practical and brief:

🧩 What You Already Have

✅ /assets/ → all images, sounds, background
✅ assets/layout.json → exact positions, dimensions, z-order
✅ css/style.css → exact visual style
✅ modules.json → full logic map of all JS modules

You now have the complete DNA of your project.

🎯 Next Step: The “Kid-Friendly Build Prompt”

This is the one-shot instruction they paste into Copilot Chat or Cursor inside an empty folder that contains only:

/assets
assets/layout.json
css/style.css
modules.json
README.md (with this prompt)

🧠 THE KIDS PROMPT (copy into README.md or give them directly)
Hi Copilot! I’m learning web development 😄  
Please rebuild the complete Hair Game from the metadata provided.

In this folder you’ll find:
- `assets/layout.json` → layout map
- `css/style.css` → all styles
- `modules.json` → logic descriptions
- `/assets/` → all images & sounds

Follow these instructions carefully:

1️⃣ Create the following project files:
   - `index.html`
   - `/js/audio-manager.js`
   - `/js/character-manager.js`
   - `/js/config.js`
   - `/js/game.js`
   - `/js/hair-system.js`
   - `/js/physics.js`
   - `/js/tools.js`
   - `/js/ui-controls.js`
   - `/js/utils.js`

2️⃣ For each file listed in `modules.json`:
   - Recreate its code exactly as described there (functions, constants, formulas, variables, logic).
   - Use the same names, values, and relationships.
   - Keep module dependencies and exports identical.

3️⃣ Use `layout.json` to:
   - Set up the canvas size (`width`, `height`) and background.
   - Position each item at its `x`,`y`,`width`,`height` (absolute pixel units).
   - Layer elements using `z` order if specified.

4️⃣ Link `style.css` as-is — do not modify it.  
   - It defines the exact look (colors, font sizes, shadows, spacing).

5️⃣ In `index.html`:
   - Include the `<link>` to `css/style.css`.
   - Include all `/js/*.js` scripts in the correct order (use `modules.json` dependency info).
   - Add a `<canvas>` or container that matches the canvas size from `layout.json`.

6️⃣ Once done:
   - Confirm all assets load correctly (background, avatars, table, sounds).
   - Run the game locally with:
     ```
     python3 -m http.server 8000
     ```
     or use VS Code Live Server.
   - Check that the visuals and behavior match the original.

Remember:
- Use **pixel units** only.
- Don’t skip any constant or formula.
- Every value in `modules.json` and `layout.json` must appear exactly in your code.

When finished, print:


✅ Project rebuilt successfully
Total JS modules: [count]
Canvas size: [width]x[height]