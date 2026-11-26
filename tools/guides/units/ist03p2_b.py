from ist_lib import *
from units.ist_q import QS

# =============================================================================== 3.15
C315 = L("3.15", "Group tags with the div, style a whole group at once, and build side-by-side columns and multi-row layouts.",
  [("div", "a generic block container with no style of its own; it groups other tags"), ("container", "another name for a tag that wraps related tags together"), ("inline-block", "lets divs sit side by side while keeping a width"), ("vertical-align: top", "locks side-by-side columns to the same top edge"), ("98% rule", "the widths in one row should add up to 98% or less")],
  [("A box that does nothing by itself", """The `div` is the most used tag on the web, and it does **nothing visible on its own**. Its whole job is to **group** other tags into one invisible box. Real sites are built from divs: the nav bar, the search box and every product card are divs.

!key: A div has zero style of its own. It exists to group tags so you can style, move or arrange them as one unit."""),
   ("Mass styling", """Put **one** style on a div and everything inside it inherits that look, instead of styling a heading, three paragraphs and a list separately:

`<div style="background-color: navy; color: white; padding: 14px">` ... the heading and paragraph inside both turn white. A tag that has its own color keeps it."""),
   ("Block by default, elastic height", """A div is a **block** tag: it takes 100% width and starts a new line. Its **height is elastic**: it stretches to fit what is inside, so you never set a height for a div full of content.

The exception: an **empty** div (no text, no pictures) collapses to **0 pixels** tall and disappears. Give it an explicit `height` (and a background color so you can see it) and it shows up as a bar."""),
   ("Side-by-side columns", """Two divs stack by default. Give both `display: inline-block` to sit side by side, and give both `vertical-align: top`: without it, two inline-block divs line up by their **text baseline**, so a column with more text drags the other one down.

Use **percent** for width (`width: 45%`) so the columns resize with the screen, and **px** for height."""),
   ("Rows of columns: the 98% rule", """1. Keep the widths of one row at **98% or less**. The spaces between divs need room, so 50% + 50% overflows and the second div drops to a new line.
2. Put an **`hr`** (or any block tag) after the row so the next divs start on a **fresh line**.
3. Repeat the same pattern for each row."""),
  ],
  [HX("A banner, a color bar and two columns", '<div style="background-color: navy;\n color: white; padding: 14px">\n<h2>Sam Rivera</h2>\n<p>Loves music and art.</p>\n</div>\n<div style="height: 20px;\n background-color: orange"></div>\n<div style="display: inline-block;\n vertical-align: top; width: 30%">Side</div>\n<div style="display: inline-block;\n vertical-align: top; width: 60%">Feed</div>', [(0, "background-color: navy", "One style on the div..."), (2, "<h2>Sam Rivera</h2>", "...turns the heading white too."), (3, "<p>Loves music and art.</p>", "...and the paragraph."), (5, "height: 20px", "An empty div needs a height to show."), (8, "vertical-align: top", "Locks the column tops together."), (8, "width: 30%", "A percent width: the column resizes with the screen."), (10, "width: 60%", "30% + 60% = 90%, under the 98% rule.")], cap="One div holds the heading and paragraph, an empty div makes the bar, and two inline-block divs make columns."),
   HX("Two rows of columns", '<div style="display: inline-block;\n vertical-align: top; width: 45%">A</div>\n<div style="display: inline-block;\n vertical-align: top; width: 45%">B</div>\n<hr>\n<div style="display: inline-block;\n vertical-align: top; width: 45%">C</div>\n<div style="display: inline-block;\n vertical-align: top; width: 45%">D</div>', [(1, "width: 45%", "45% + 45% = 90%: two columns fit in one row."), (4, "<hr>", "A block tag forces the next divs onto a fresh line."), (6, "width: 45%", "Row 2 repeats the same pattern.")], cap="A and B share the first row. The hr starts a fresh line, so C and D share the second.")],
  [TX("A div groups and styles", '<div style="background-color: navy; color: white;">\n<h3>Box</h3>\n<p>Inside</p>\n</div>\n<p>Outside</p>', cap="The div is a box for the h3 and the first paragraph, which both inherit white. The last paragraph is outside the div."),
   TX("An empty div", '<div style="height: 40px; background-color: orange;"></div>\n<p>Under the bar</p>', cap="The empty div adds no words to the page, but its 40px height makes an orange bar above the paragraph."),
   TX("Two columns, then a second row", '<div style="display: inline-block; vertical-align: top; width: 45%;">One</div>\n<div style="display: inline-block; vertical-align: top; width: 45%;">Two</div>\n<hr>\n<div style="display: inline-block; vertical-align: top; width: 45%;">Three</div>\n<div style="display: inline-block; vertical-align: top; width: 45%;">Four</div>', cap="One and Two share a row. The hr starts a fresh line, so Three and Four share the next row.")],
  [("`display: inline-block` but no `vertical-align: top`", "A column with more text drags the other column down.", "Add `vertical-align: top` to both columns."), ("Two columns of 50% and 50%", "With the spaces between them the row is wider than 100%, so the second column drops down.", "Keep the widths of a row at 98% or less."), ("No `hr` between two rows of columns", "The next divs can squeeze onto the end of the first row.", "Add an `hr` (or any block tag) after each row."), ("An empty div with no height", "It collapses to 0 pixels and disappears.", "Give it a `height` in px and a background color."), ("`width: 400px` for a column", "It stays 400px even on a small phone screen.", "Use a percent width for columns, and px for heights."), ("Styling the heading and paragraphs one at a time", "It is slow and easy to miss one.", "Put the style on the div that holds them.")],
  [], QS(14), title="Div Tag", kick="The most used tag on the web: group, style and arrange tags with invisible boxes.", site="<b>Notes:</b> div-tag-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Profile Page &nbsp;·&nbsp; <b>Assignment:</b> Amazon Products &nbsp;·&nbsp; <b>Quiz game:</b> 3.15")

# =============================================================================== 3.16
C316 = L("3.16", "Build tables from rows and cells, keep every row the same length, and put other tags inside cells.",
  [("table", "the outer wrapper that starts a data grid"), ("tr", "table row: one horizontal line of the grid"), ("th", "table header: a bold, centered title cell"), ("td", "table data: a normal content cell")],
  [("Four tags, nested like dolls", """Any time information truly belongs in rows and columns, like player stats or pricing plans, a **table** is the right tag. You do not build columns directly. You build one **row** at a time, top to bottom, dropping **cells** into each row, left to right.

| Tag | Job |
| `<table>` | the outer grid: everything lives inside it |
| `<tr>` | one **row**; only cells go directly inside a row |
| `<th>` | a **header cell**: bold and centered by default, usually the whole first row |
| `<td>` | a **data cell**: most of your table is made of these |

Only `tr` tags go directly inside a `table`, and only `th` or `td` tags go directly inside a `tr`."""),
   ("The golden rule of alignment", """**Every row must have the same number of cells.** If row 1 has 4 header cells, every row after it needs exactly 4 data cells. Leave one out and the table's columns break."""),
   ("Other tags inside a cell", """A `td` can hold any other tag: a link, a picture, bold words, even a whole list. Put the tag **inside** the cell:

`<td><a href="https://www.espn.com">View</a></td>`

Real sites do this all the time, like a link in the last cell of every pricing row."""),
   ("Styling a table", """A table takes styles like any other tag. Put them in the style attribute of the `table`, or of individual cells:

- `border: 3px solid navy; width: 80%; text-align: center` on the **table** (the centered text is inherited by every cell)
- `background-color: #1B2A4A; color: white` on each **header cell**

Use `th` for column titles even when `td` would look the same: screen readers announce a header differently."""),
  ],
  [HX("A header row and a data row", '<table style="border: 3px solid navy;\n width: 80%; text-align: center">\n<tr>\n<th>Rank</th>\n<th>Player</th>\n</tr>\n<tr>\n<td>1</td>\n<td>Ana</td>\n</tr>\n</table>', [(0, "border: 3px solid navy", "A border around the table."), (1, "width: 80%", "The table is 80% as wide as the page."), (2, "<tr>", "One row starts here."), (3, "<th>Rank</th>", "A header cell: bold and centered."), (6, "<tr>", "The next row starts here."), (7, "<td>1</td>", "A data cell: a normal cell."), (9, "</tr>", "Every row has the same number of cells: 2.")], cap="The header cells are bold, the data cells are normal. Both rows have exactly two cells."),
   HX("Tags inside cells", '<table>\n<tr>\n<td><strong>Owls</strong></td>\n<td>9</td>\n<td><a href="https://www.espn.com"\n target="_blank">Stats</a></td>\n</tr>\n</table>', [(2, "<strong>Owls</strong>", "Bold words inside a cell."), (3, "<td>9</td>", "A plain data cell."), (4, "<a href=", "A link inside a cell."), (5, "Stats</a></td>", "The a tag closes before the cell does.")], cap="One cell holds bold words, one holds a number, and one holds a link.")],
  [TX("A one-row table", '<table>\n<tr>\n<td>Red</td>\n<td>Green</td>\n<td>Blue</td>\n</tr>\n</table>', cap="A row shows its cells on one line, left to right. The page ends up with Red Green Blue on a single line."),
   TX("Header cells and data cells", '<table>\n<tr>\n<th>Name</th>\n<th>Age</th>\n</tr>\n<tr>\n<td>Sam</td>\n<td>14</td>\n</tr>\n</table>', cap="The first row is the header row: Name Age. The second row adds Sam 14 below it."),
   TX("Links and bold inside cells", '<table>\n<tr>\n<td><strong>Owls</strong></td>\n<td><a href="https://www.espn.com">Stats</a></td>\n</tr>\n<tr>\n<td>Hawks</td>\n<td>7</td>\n</tr>\n</table>', cap="Tags inside a cell do not change the words on the page. Row 1 shows Owls Stats and row 2 shows Hawks 7.")],
  [("A row with fewer cells than the header", "The table's columns break.", "Give every row the same number of cells."), ("Text typed straight inside `<table>` or `<tr>`", "Only rows go in a table and only cells go in a row.", "Put the words inside a `<td>`."), ("`<td>` closed with `</tr>` (or `<th>` with `</td>`)", "The closing tag must match the opening tag.", "Close each cell with its own tag."), ("`<td>` for column titles", "It works, but a screen reader will not announce them as headers.", "Use `<th>` for the header row."), ("Forgetting `</table>`", "The rest of the page can end up inside the table.", "Close it: `</table>`."), ("A table used only to make a page look like a grid", "A table is for data that belongs in rows and columns.", "Use divs for page layout.")],
  [], QS(15), title="Tables", kick="Rows, cells and the golden rule: every row has the same number of cells.", site="<b>Notes:</b> tables-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Leaderboard &nbsp;·&nbsp; <b>Assignment:</b> ESPN Scoreboard &nbsp;·&nbsp; <b>Quiz game:</b> 3.16")
CHAPTERS_B = [C315, C316]
