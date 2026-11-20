/* APPENDIX C: IMAGE EDITING WITH PILLOW (shared pieces for the walkthroughs).
   The walkthroughs are in appendix-c-1.js ... appendix-c-5.js. They reuse the engine in appendix-a-core.js and the helpers in appendix-b-core.js.
   Works in the browser AND in Node (the tests use it). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  var B = root.PYB || (typeof require !== "undefined" ? require("./appendix-b-core.js") : null);
  var UNIT = "Appendix C: Image Editing with Pillow";
  var C = { UNIT: UNIT, seq: B.seq, bring: B.bring };
  C.add = function (w) { w.unit = UNIT; w.prefix = "pc"; P.add(w); };

  /* the five lines that load a photo from the web (used at the top of most photo walkthroughs) */
  C.PHOTO_URL = "https://picsum.photos/id/1015/600/400";
  C.LOAD = "import io\nimport requests\nfrom PIL import Image\n\nresponse = requests.get(\"https://picsum.photos/id/1015/600/400\")\nphoto = Image.open(io.BytesIO(response.content))";

  var T = P.TIPS;
  T.c_pil = { title: "What is Pillow? How do I see my pictures?", sections: [
    { p: "**Pillow** is a Python library for working with pictures: making them, drawing on them, resizing, filtering, and saving. You use it with `from PIL import Image` (the library is named PIL, for \"Python Imaging Library\")." },
    { rows: [["img.show()", "shows the picture in the Output box", "you will use this all the time"], ["img.save(\"name.png\")", "saves it and gives you a Download link", "the ending (.png .jpg .gif) picks the file type"], ["Image.new(...)", "a brand new picture", "you decide the size and color"], ["Image.open(...)", "opens a picture that already exists", "from the web or one you added"]] },
    { p: "Click a picture in the Output box to make it bigger. Click again to shrink it. The **Save** link under it downloads the picture to your computer." },
    { good: "Pictures live in the Output box, so you can run your program again and again and compare them. Use **Clear output** to start fresh." }
  ] };
  T.c_pixels = { title: "Pixels and coordinates", sections: [
    { p: "A picture is a grid of tiny dots called **pixels**. Each pixel has a **position** `(x, y)` and a **color**." },
    { ex: ["(0, 0) ------------------> x   (the width is how many pixels across)", "  |", "  |", "  v", "  y     (the height is how many pixels down)"] },
    { list: ["**(0, 0) is the top-left corner.** x grows going RIGHT. **y grows going DOWN**.", "A 300 by 200 picture has x from 0 to 299 and y from 0 to 199. The last pixel is `(299, 199)`, not `(300, 200)`.", "`img.size` is `(width, height)`, so `img.width` and `img.height` are the two numbers."] },
    { ex: ["img.putpixel((10, 20), (255, 0, 0))   # color one pixel red", "print(img.getpixel((10, 20)))         # (255, 0, 0)"] },
    { warn: "The position goes first and the color second, and each is its own pair of brackets: `putpixel((x, y), (r, g, b))`." }
  ] };
  T.c_colors = { title: "Colors: names, RGB and hex", sections: [
    { p: "A color is how much **red**, **green** and **blue** light, each from 0 to 255. Pillow takes colors in three forms:" },
    { rows: [["\"skyblue\"", "a color name", "about 140 names work, like \"red\", \"gold\", \"navy\", \"hotpink\""], ["(135, 206, 235)", "an RGB tuple", "(red, green, blue), each 0 to 255"], ["\"#87ceeb\"", "a hex code", "the same color written in base 16, common on websites"], ["(135, 206, 235, 128)", "RGBA", "a fourth number, alpha: 255 solid, 0 invisible"]] },
    { rows: [["(0, 0, 0)", "black", "no light at all"], ["(255, 255, 255)", "white", "all light"], ["(255, 0, 0)", "red", "(0, 255, 0) is green, (0, 0, 255) is blue"], ["(255, 255, 0)", "yellow", "red + green light"], ["(128, 128, 128)", "gray", "equal amounts, half strength"]] },
    { good: "Each of the three numbers fits in **one byte** (8 bits), so one pixel takes 3 bytes. That is why a big photo has a big file." }
  ] };
  T.c_modes = { title: "Image modes: RGB, RGBA, L and more", sections: [
    { p: "The **mode** says what kind of numbers each pixel holds. Check it with `img.mode`." },
    { rows: [["\"RGB\"", "three numbers per pixel", "normal color pictures"], ["\"RGBA\"", "four numbers: red, green, blue, alpha", "color with see-through parts (PNG)"], ["\"L\"", "one number: 0 black to 255 white", "grayscale"], ["\"1\"", "black or white only", "like a fax"], ["\"P\"", "a palette: each pixel is a number that points to a color in a list", "small PNG and GIF files, many sprites"]] },
    { ex: ["gray = photo.convert(\"L\")        # to grayscale", "color = gray.convert(\"RGB\")     # back to three numbers (still looks gray)", "sprite = sprite.convert(\"RGBA\")  # unlock see-through"] },
    { warn: "Some tools only work in certain modes. If you get an error like \"not supported\", print `img.mode` and `.convert(\"RGB\")` first. And JPEG cannot store alpha, so save see-through pictures as .png." }
  ] };
  T.c_draw = { title: "ImageDraw cheat sheet", sections: [
    { p: "To draw shapes on a picture, make a **pen** for it with `ImageDraw.Draw(img)`. Every shape draws onto the picture and later shapes cover earlier ones." },
    { ex: ["from PIL import Image, ImageDraw", "", "img = Image.new(\"RGB\", (400, 300), \"white\")", "draw = ImageDraw.Draw(img)", "draw.rectangle((50, 50, 200, 150), fill=\"orange\", outline=\"black\", width=4)", "draw.ellipse((220, 50, 320, 150), fill=\"gold\")", "draw.line((0, 0, 400, 300), fill=\"red\", width=5)", "draw.polygon([(60, 250), (110, 180), (160, 250)], fill=\"green\")", "draw.text((20, 270), \"hello\", fill=\"black\")", "img.show()"] },
    { rows: [["draw.rectangle((x1, y1, x2, y2), fill=, outline=, width=)", "a rectangle", "two corners: top-left and bottom-right"], ["draw.ellipse((x1, y1, x2, y2), fill=)", "an oval or circle", "fits inside that rectangle (a square gives a circle)"], ["draw.line((x1, y1, x2, y2), fill=, width=)", "a line", "can have more points: (x1, y1, x2, y2, x3, y3)"], ["draw.polygon([(x, y), (x, y), ...], fill=)", "any straight-sided shape", "a list of corner points"], ["draw.point((x, y), fill=)", "one pixel", ""], ["draw.arc((x1, y1, x2, y2), start, end, fill=)", "part of an oval's outline", "angles in degrees"], ["draw.text((x, y), \"words\", fill=, font=)", "text", "see the Text help"]] },
    { warn: "A box is `(left, top, right, bottom)`, **not** `(x, y, width, height)`. To draw a circle with center `(cx, cy)` and radius `r`: `(cx - r, cy - r, cx + r, cy + r)`." }
  ] };
  T.c_text = { title: "Drawing text", sections: [
    { p: "The built-in font is tiny unless you ask for a size. Make a font once, then use it for every `draw.text` call." },
    { ex: ["from PIL import ImageFont", "", "font = ImageFont.load_default(size=40)", "draw.text((250, 150), \"Hello!\", font=font, fill=\"white\", anchor=\"mm\")"] },
    { rows: [["anchor=\"la\"", "x, y is the top-left of the text", "the default"], ["anchor=\"mm\"", "x, y is the middle of the text", "great for centering"], ["anchor=\"mt\"", "x, y is the top-middle", "titles"], ["anchor=\"mb\"", "x, y is the bottom-middle", "captions"], ["draw.textlength(text, font=font)", "the width of the text in pixels", "to see if it fits"], ["draw.textbbox((0, 0), text, font=font)", "(left, top, right, bottom) of the text", "width is the 3rd number minus the 1st"]] },
    { good: "To center text in a 500 pixel wide picture, put it at x = 250 (half the width) with `anchor=\"mm\"` or `anchor=\"mt\"`. Then it stays centered even if you change the text." },
    { warn: "`font` sizes are in pixels. If your text does not show, it may be the same color as the background, or placed outside the picture." }
  ] };
  T.c_open = { title: "Getting a picture to work with", sections: [
    { p: "There are three ways to get a picture into your program." },
    { steps: ["**From the web** with `requests` (the editor cannot read files on your computer by itself).", "**From your computer** with the **Add a picture** button above the Output box. Then `Image.open(\"name.jpg\")` with the exact name shown in the blue box.", "**Make one yourself** with `Image.new(...)` and draw on it."] },
    { ex: ["import io", "import requests", "from PIL import Image", "", "response = requests.get(\"https://picsum.photos/id/1015/600/400\")", "photo = Image.open(io.BytesIO(response.content))"] },
    { p: "`response.content` is the raw bytes of the picture file. `io.BytesIO(...)` wraps those bytes so they look like a file, and `Image.open` reads it." },
    { rows: [["https://picsum.photos/id/1015/600/400", "a fjord landscape", "id 1015, 600 wide, 400 tall"], ["https://picsum.photos/id/237/600/400", "a black puppy", "change the numbers for another size"], ["https://picsum.photos/id/1025/600/400", "a pug in a blanket", ""], ["https://picsum.photos/id/1074/600/400", "a lioness", ""], ["https://picsum.photos/id/1003/600/400", "a fawn in a forest", ""], ["https://picsum.photos/id/1039/600/400", "a waterfall", ""], ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", "a tiny Pikachu sprite", "change 25 to any Pokemon number"]] },
    { warn: "If a photo will not load, check `response.status_code` (it should be 200). Some school networks block photo sites. Then use **Add a picture**. Pictures from a phone can be huge (4000 pixels wide). Shrink them first with `photo.thumbnail((800, 800))`." }
  ] };
  T.c_geometry = { title: "Boxes, sizes and the transform tools", sections: [
    { rows: [["photo.resize((300, 200))", "a new picture of exactly that size", "the shape can stretch"], ["photo.crop((left, top, right, bottom))", "a new picture of just that box", "a box is two corners, not a size"], ["photo.thumbnail((200, 200))", "shrinks THE SAME picture to fit in 200 by 200", "keeps the shape, never enlarges, returns None"], ["photo.rotate(45)", "turns it counter-clockwise by 45 degrees", "add expand=True so the corners are not cut off"], ["photo.transpose(Image.Transpose.FLIP_LEFT_RIGHT)", "a mirror image", "also FLIP_TOP_BOTTOM, ROTATE_90, ROTATE_180"], ["photo.copy()", "a separate copy to change safely", ""]] },
    { ex: ["w, h = photo.size                  # unpack the two numbers", "half = photo.resize((w // 2, h // 2))    # // keeps whole numbers", "center = photo.crop((w // 4, h // 4, w * 3 // 4, h * 3 // 4))"] },
    { warn: "`resize`, `crop`, `rotate` and `filter` give back a **new** picture. You must catch it: `small = photo.resize(...)`. Writing just `photo.resize(...)` throws the answer away. (`thumbnail` is the exception: it changes the picture itself.)" },
    { good: "To keep the shape when resizing, work out the new height from the new width: `new_height = int(photo.height * new_width / photo.width)`." }
  ] };
  T.c_enhance = { title: "ImageEnhance and ImageOps", sections: [
    { ex: ["from PIL import ImageEnhance, ImageOps", "", "brighter = ImageEnhance.Brightness(photo).enhance(1.5)   # 1.0 is the original", "punchy = ImageEnhance.Contrast(photo).enhance(1.8)", "vivid = ImageEnhance.Color(photo).enhance(2.0)         # 0 is gray, 1 is normal", "crisp = ImageEnhance.Sharpness(photo).enhance(3.0)"] },
    { rows: [["ImageEnhance.Brightness(img).enhance(f)", "lighter or darker", "f below 1 darker, above 1 lighter"], ["ImageEnhance.Contrast(img).enhance(f)", "more or less difference between light and dark", ""], ["ImageEnhance.Color(img).enhance(f)", "more or less color", "0 is black and white"], ["ImageEnhance.Sharpness(img).enhance(f)", "blurrier or sharper", ""], ["ImageOps.grayscale(img)", "black and white", "like convert(\"L\")"], ["ImageOps.invert(img)", "a negative", "RGB or L pictures only"], ["ImageOps.autocontrast(img)", "stretches the colors to use the full range", "rescues dull photos"], ["ImageOps.posterize(img, 3)", "fewer colors, a poster look", "bits per color, 1 to 8"], ["ImageOps.solarize(img, 128)", "inverts only the bright parts", ""], ["ImageOps.mirror(img)  /  ImageOps.flip(img)", "left-right or upside-down", ""], ["ImageOps.colorize(gray, \"black\", \"white\")", "paints a gray picture between two colors", "sepia and duotone"]] },
    { warn: "`ImageEnhance.Brightness(photo)` makes an enhancer object. The `.enhance(factor)` is what makes the new picture." }
  ] };
  T.c_filters = { title: "ImageFilter cheat sheet", sections: [
    { ex: ["from PIL import ImageFilter", "", "soft = photo.filter(ImageFilter.GaussianBlur(5))   # radius 5", "edges = photo.filter(ImageFilter.FIND_EDGES)", "sharp = photo.filter(ImageFilter.SHARPEN)"] },
    { rows: [["ImageFilter.BLUR", "a quick blur", ""], ["ImageFilter.GaussianBlur(radius)", "a smooth blur, as strong as the radius", "try 2, 5, 10"], ["ImageFilter.SHARPEN", "crisper edges", ""], ["ImageFilter.SMOOTH", "gentle smoothing", ""], ["ImageFilter.EDGE_ENHANCE", "stronger outlines", ""], ["ImageFilter.FIND_EDGES", "only the edges, on black", "a line drawing look"], ["ImageFilter.CONTOUR", "an outline sketch", ""], ["ImageFilter.EMBOSS", "a raised, stamped look", ""], ["ImageFilter.MedianFilter(size)", "evens out the colors in small areas", "a painted look; size must be odd, like 5"]] },
    { p: "To pixelate, shrink a picture with a blocky method and then enlarge it with the same method: `small = photo.resize((40, 27), Image.Resampling.NEAREST)` then `small.resize(photo.size, Image.Resampling.NEAREST)`." }
  ] };
  T.c_loops = { title: "Looping over every pixel", sections: [
    { p: "To change every pixel yourself, use two loops: one for each x, and inside it one for each y. `img.load()` gives a fast way to read and write pixels with square brackets." },
    { ex: ["px = img.load()                     # a fast pixel table", "for x in range(img.width):", "    for y in range(img.height):", "        r, g, b = px[x, y]          # read: three numbers at once", "        px[x, y] = (255 - r, 255 - g, 255 - b)   # write the new color"] },
    { list: ["Work on a **copy** if you still need the original: `result = photo.copy()`, then load and change the copy.", "A 600 by 400 picture has **240,000** pixels, so a loop that does a few steps each is fine (about a tenth of a second).", "A color number cannot be above 255 or below 0. Clamp it: `min(255, value)` and `max(0, value)`.", "Colors must be **whole numbers**. Use `int(...)` or `//` if you divide."] },
    { rows: [["px[x, y]", "(r, g, b)", "read a pixel"], ["px[x, y] = (r, g, b)", "", "write a pixel"], ["img.width, img.height", "numbers", "how far the loops go"], ["range(img.width)", "0 to width - 1", "all the x values"]] }
  ] };
  T.c_alpha = { title: "Transparency, masks and paste", sections: [
    { p: "`base.paste(other, (x, y))` copies one picture onto another. The position `(x, y)` is where the **top-left** of `other` lands. It changes `base` itself." },
    { ex: ["canvas = Image.new(\"RGB\", (400, 300), \"white\")", "canvas.paste(small, (20, 20))                 # a plain paste", "canvas.paste(sprite, (200, 100), sprite)      # a masked paste: only the solid parts"] },
    { p: "The third thing is a **mask**: a picture whose brightness says how much of the pasted picture to keep at each pixel. White keeps everything, black keeps nothing, gray mixes. A see-through (RGBA) picture can be its own mask." },
    { ex: ["mask = Image.new(\"L\", small.size, 0)                      # all black: keep nothing", "ImageDraw.Draw(mask).ellipse((0, 0, small.width, small.height), fill=255)   # white circle: keep this", "canvas.paste(small, (20, 20), mask)                          # a round picture!"] },
    { rows: [["Image.blend(a, b, 0.5)", "a 50/50 mix of two pictures", "must be the same size and mode"], ["Image.alpha_composite(base, overlay)", "lays a see-through picture over another", "both must be RGBA"], ["img.putalpha(128)", "makes the whole picture half see-through", ""]] },
    { warn: "`paste` changes the picture it is called on and returns nothing. Make a `.copy()` first if you want to keep the original. A pasted picture that sticks out past the edge is just cut off." }
  ] };
  T.c_gif = { title: "Animated GIFs", sections: [
    { p: "An animation is a list of pictures (**frames**) shown quickly one after another. Pillow saves the list as a GIF." },
    { ex: ["frames = []", "for i in range(10):", "    frame = Image.new(\"RGB\", (200, 100), \"white\")", "    ImageDraw.Draw(frame).ellipse((i * 18, 30, i * 18 + 30, 60), fill=\"red\")", "    frames.append(frame)", "", "frames[0].save(\"ball.gif\", save_all=True, append_images=frames[1:], duration=100, loop=0)"] },
    { rows: [["save_all=True", "save every frame, not just the first", "required"], ["append_images=frames[1:]", "the rest of the frames", "the first one is the picture you call .save on"], ["duration=100", "milliseconds each frame stays", "100 is 10 frames per second"], ["loop=0", "repeat forever", "1 plays once"]] },
    { good: "The editor shows your GIF right in the Output box, animated, and gives a Download link. Total time = number of frames times duration. 20 frames at 100 ms is 2 seconds." }
  ] };
  T.c_errors = { title: "Errors and what they mean", sections: [
    { rows: [["FileNotFoundError", "no picture with that name", "use Add a picture, and type the name exactly"], ["UnidentifiedImageError", "the bytes were not a picture", "print response.status_code; it must be 200"], ["OSError: cannot write mode RGBA as JPEG", "JPEG cannot hold see-through pixels", "save as .png, or .convert(\"RGB\") first"], ["ValueError: unknown file extension", "the saved name has no .png or .jpg", "end the name with .png, .jpg or .gif"], ["ValueError: images do not match", "blend or paste with different sizes or modes", "resize and convert both the same"], ["TypeError: 'NoneType' ... (after thumbnail)", "thumbnail changes the picture and gives back None", "do not write photo = photo.thumbnail(...)"], ["TypeError: function takes ... positional arguments", "a box or size needs its own brackets", "photo.resize((300, 200)) has double brackets"], ["ValueError: not enough values to unpack", "a pixel has a different number of values", "RGBA has four: r, g, b, a = px[x, y]"], ["TypeError: 'float' object cannot be interpreted as an integer", "a size or position was a decimal", "wrap it in int(...) or use //"], ["Nothing appears", "no show() call, or the picture changed after show()", "call show() last"]] }
  ] };
  T.c_debug = { title: "Debugging a picture program", sections: [
    { steps: ["Read the red message. It tells you the line number.", "Look the message up in the **Errors** help.", "Print what you have: `print(img.size, img.mode)`. Is it the size and mode you expected?", "Use `img.show()` **in the middle** of your program to see the picture at each stage.", "Check the order of your steps. Each one uses the picture the line before it made.", "Make the problem smaller: use a tiny picture (`thumbnail((100, 100))`) so you can run it fast and look at pixels."] },
    { good: "If the picture is all black or all white, a color was probably wrong (0 or 255 everywhere). Print one pixel with `img.getpixel((10, 10))`." }
  ] };
  T.c_files = { title: "Saving and downloading", sections: [
    { ex: ["img.save(\"poster.png\")                 # lossless, keeps see-through parts", "img.save(\"photo.jpg\", quality=85)       # smaller file, some detail lost", "frames[0].save(\"anim.gif\", save_all=True, append_images=frames[1:], duration=100, loop=0)"] },
    { list: ["The ending of the name picks the type: `.png`, `.jpg` (or `.jpeg`), `.gif`, `.webp`.", "The editor shows a **Download it** link under each saved picture. Files are not kept after you reload the page, so download what you want to keep.", "**PNG** is lossless and good for drawings, text and see-through. **JPG** is smaller for photos, but it throws away tiny details to do it (lossy)."] }
  ] };
  T.c_apmap = { title: "How this connects to AP CSP", sections: [
    { p: "Pictures are a perfect way to see the big ideas in AP Computer Science Principles." },
    { rows: [["Data (Big Idea 2)", "a picture is numbers: a grid of pixels, each three bytes (red, green, blue)", "width times height times 3 bytes"], ["Binary and bytes", "each color number is 0 to 255, which is exactly one byte (8 bits)", "(255, 0, 0) is red"], ["Compression", "PNG keeps every pixel (lossless). JPEG throws away detail to make a smaller file (lossy)", "compare the file sizes"], ["Metadata", "data about the data: size, mode, format", "img.size, img.mode"], ["Algorithms (Big Idea 3)", "a filter is a step-by-step rule applied to every pixel", "invert: 255 minus each color"], ["Abstraction", "you use ImageFilter without knowing the math inside", "compare your own loop with the library"], ["a list", "frames = [...], images = [...]", "stores many values in one variable"], ["a procedure with a parameter", "def make_gray(img):", "named, reusable code you give an input to"], ["selection and iteration", "if brightness > 128:  for x in range(width):", "decisions and repeating"]] },
    { good: "The exam writes algorithms in pseudocode (`FOR EACH`, `IF`). The ideas are the same as the Python you write here." }
  ] };

  root.PYC = C;
  if (typeof module !== "undefined" && module.exports) module.exports = C;
})(typeof window !== "undefined" ? window : globalThis);
