/**
 * ==========================================================
 * STORYBOOK WEBSITE (Library + Flipbook Reader)
 * ==========================================================
 * This file does the "brain work":
 *  - Stores book data (title, author, pages)
 *  - Renders the home library
 *  - Opens a book into a flipbook reader
 *  - Flips pages with animation
 *  - Adds keyboard controls (left/right arrows)
 *
 * Kid-friendly idea:
 *  - Add your own books inside the BOOKS array
 *  - Each book has "pages" with title + text + fun note
 * ==========================================================
 */

/* ------------------------------
   1) BOOK DATA (YOU CAN EDIT!)
   ------------------------------ */
const BOOKS = [
  {
    id: "dragon",
    title: "The legend of the Sage of Time",
    author: "You 👑",
    cover: {
      // We'll use a CSS gradient as a "cover image"
      // (No images needed, works offline!)
      gradient: "linear-gradient(135deg, #ffb84d, #ff5c7a)",
      emoji: "🐉"
    },
    pages: [
      {
        heading: "Page 1: The Sage stones",
        text:
          "Once upon a time in a far away land called Tritopia there were ancient artifacts called Sage stones." +
          "Sage stones were created to help awaken sages." +
          "Sages could be magical Tritopians,Tritos,Triors,Trions or Trioedos with natural powers in their bloodline from ancient gods and goddess." +
          "When Tritopia was first created it was in danger by the king of demons 'Triondorf'.",
        note: "✨ Sage stones Weren't created to give ancient power to the wielder."
      },
      {
        heading: "The Trioni",
        text:
          "To stop Triondorf,Sage stones were created.The ancient artifacts had to be kept secret so a ancient race called the Trioni." +
          "The Trioni made contructs that could be powered by magic,but they took that for granted and their entire race almost went exctint." +
          "The only survivors of the Trioni is a king named Terry and his elder sister,Tineru.",
        note: "🐲 Tineru and Terry can both use sage stones because they both have powers of their own."
      },
      {
        heading: "Page 3: The First Flight",
        text:
          "Trieru has the power to leave her sprit from her body and when amplified from the power of the secret stone she can possess things and constructs." +
          ""+
          "",
        note: "🏆 Small wins = big wins."
      },
      {
        heading: "Page 4: The Big Promise",
        text:
          "Dino promised to help the dragon learn to fly, and the dragon promised to never burn the pizza. " +
          "They pinky-promised… with a claw.",
        note: "🤝 Teamwork!"
      }
    ]
  },

  {
    id: "space",
    title: "Captain Moon & The Lost Star",
    author: "You 🚀",
    cover: {
      gradient: "linear-gradient(135deg, #7c5cff, #2ee59d)",
      emoji: "🌙"
    },
    pages: [
      {
        heading: "Page 1: A Missing Sparkle",
        text:
          "Captain Moon noticed the sky looked… less sparkly. One star was missing! " +
          "That’s like losing one sprinkle from a donut. Unacceptable.",
        note: "⭐ A mystery begins!"
      },
      {
        heading: "Page 2: Star Tracks",
        text:
          "Using the Super-Serious Telescope, Captain Moon spotted glittery footprints leading to a cloud. " +
          "Clouds aren’t supposed to have footprints. That’s suspicious.",
        note: "🔎 Detective mode!"
      },
      {
        heading: "Page 3: The Star’s Secret",
        text:
          "The lost star was hiding because it was shy. Captain Moon said, “It’s okay. " +
          "You can shine softly. You’re still a star.”",
        note: "💛 Kindness matters."
      }
    ]
  },

  {
    id: "jungle",
    title: "The Jungle Zipline Race",
    author: "You 🐒",
    cover: {
      gradient: "linear-gradient(135deg, #2ee59d, #4b8cff)",
      emoji: "🌿"
    },
    pages: [
      {
        heading: "Page 1: Challenge Accepted",
        text:
          "Mango the monkey challenged everyone to a zipline race! " +
          "The rule was simple: NO banana cheating.",
        note: "🍌 No cheating!"
      },
      {
        heading: "Page 2: The Squeaky Start",
        text:
          "The zipline squeaked like a rusty robot. Mango yelled, “Three… two… WHEEEE!”",
        note: "😂 Sound effect idea: add audio later!"
      }
    ]
  }
];

/* ------------------------------
   2) GRAB HTML ELEMENTS
   ------------------------------ */
const libraryView = document.getElementById("libraryView");
const readerView  = document.getElementById("readerView");

const bookGrid   = document.getElementById("bookGrid");
const flipbook   = document.getElementById("flipbook");

const bookTitle  = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");

const pageNumberEl = document.getElementById("pageNumber");
const totalPagesEl = document.getElementById("totalPages");

const backBtn   = document.getElementById("backBtn");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const randomBtn = document.getElementById("randomBtn");

/* ------------------------------
   3) READER STATE
   ------------------------------ */
/**
 * currentBook = the book object the user opened
 * currentPageIndex = which page the user is on (0-based)
 * isFlipping = prevents spam-clicking while animation runs
 */
let currentBook = null;
let currentPageIndex = 0;
let isFlipping = false;

/* ------------------------------
   4) RENDER THE LIBRARY (HOME)
   ------------------------------ */
function renderLibrary() {
  // Clear existing cards
  bookGrid.innerHTML = "";

  // For each book, make a clickable card
  BOOKS.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.tabIndex = 0; // allows keyboard focus
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open book: ${book.title}`);

    // Cover element (gradient + emoji)
    const cover = document.createElement("div");
    cover.className = "book-cover";
    cover.style.background = book.cover.gradient;
    cover.innerHTML = `<div style="font-size:42px">${book.cover.emoji}</div>`;

    // Title
    const title = document.createElement("h3");
    title.className = "book-title";
    title.textContent = book.title;

    // Meta (author + page count)
    const meta = document.createElement("p");
    meta.className = "book-meta";
    meta.textContent = `by ${book.author} • ${book.pages.length} pages`;

    // Add pieces into card
    card.appendChild(cover);
    card.appendChild(title);
    card.appendChild(meta);

    // Click opens the book
    card.addEventListener("click", () => openBook(book.id));

    // Press Enter also opens the book (keyboard accessibility!)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openBook(book.id);
    });

    bookGrid.appendChild(card);
  });
}

/* ------------------------------
   5) OPEN A BOOK
   ------------------------------ */
function openBook(bookId) {
  // Find the book
  currentBook = BOOKS.find((b) => b.id === bookId);

  if (!currentBook) return; // safety check

  // Start at page 0
  currentPageIndex = 0;

  // Update header UI
  bookTitle.textContent = currentBook.title;
  bookAuthor.textContent = `by ${currentBook.author}`;
  totalPagesEl.textContent = String(currentBook.pages.length);

  // Switch views: hide library, show reader
  libraryView.classList.add("hidden");
  readerView.classList.remove("hidden");
  backBtn.classList.remove("hidden");

  // Render the current spread (left + right)
  renderSpread();

  // Update buttons (disable prev on first page, etc.)
  updateControls();
}

/* ------------------------------
   6) GO BACK TO LIBRARY
   ------------------------------ */
function goBackToLibrary() {
  // Reset reader state
  currentBook = null;
  currentPageIndex = 0;
  isFlipping = false;

  // Clear flipbook
  flipbook.innerHTML = "";

  // Switch views
  readerView.classList.add("hidden");
  libraryView.classList.remove("hidden");
  backBtn.classList.add("hidden");
}

/* ------------------------------
   7) RENDER A SPREAD
   A spread is:
     - left page = previous page (or a "cover" / blank)
     - right page = current page
   ------------------------------ */
function renderSpread() {
  if (!currentBook) return;

  // Remove old spread
  flipbook.innerHTML = "";

  const spread = document.createElement("div");
  spread.className = "spread";

  // Build left page (previous page)
  const leftPage = buildPageElement("left", getPageData(currentPageIndex - 1));

  // Build right page (current page)
  const rightPage = buildPageElement("right", getPageData(currentPageIndex));

  spread.appendChild(leftPage);
  spread.appendChild(rightPage);

  flipbook.appendChild(spread);

  // Update page number UI (human-friendly: +1)
  pageNumberEl.textContent = String(currentPageIndex + 1);
}

/**
 * Gets page data safely. If index is out of bounds, return null.
 */
function getPageData(index) {
  if (!currentBook) return null;
  if (index < 0 || index >= currentBook.pages.length) return null;
  return currentBook.pages[index];
}

/**
 * Builds a DOM element for a page (left or right).
 * If pageData is null, we show a nice "blank" / "start" page.
 */
function buildPageElement(side, pageData) {
  const page = document.createElement("div");
  page.className = `page ${side}`;

  if (!pageData) {
    // When there is no page (like before page 1), show a cute message
    page.innerHTML = `
      <h3>${side === "left" ? "🪄 The Beginning" : "📖 Ready to Read?"}</h3>
      <p>
        ${side === "left"
          ? "This space shows the previous page."
          : "Use the buttons below to flip pages!"}
      </p>
      <div class="bubble">Tip: Try the arrow keys ⬅️➡️</div>
    `;
    return page;
  }

  // Normal page content
  page.innerHTML = `
    <h3>${escapeHTML(pageData.heading)}</h3>
    <p>${escapeHTML(pageData.text)}</p>
    <div class="bubble">${escapeHTML(pageData.note || "✨")}</div>
  `;

  return page;
}

/* ------------------------------
   8) PAGE FLIPPING (WITH ANIMATION)
   ------------------------------ */

/**
 * Flip forward: go to next page if possible.
 */
function nextPage() {
  if (!currentBook) return;
  if (isFlipping) return; // prevent double flips
  if (currentPageIndex >= currentBook.pages.length - 1) return;

  flipAnimation("forward");
}

/**
 * Flip backward: go to previous page if possible.
 */
function prevPage() {
  if (!currentBook) return;
  if (isFlipping) return;
  if (currentPageIndex <= 0) return;

  flipAnimation("backward");
}

/**
 * Does the visual flip animation using a "sheet" element.
 * direction:
 *  - "forward"  = page flips right -> left
 *  - "backward" = we fake it by flipping and then changing index
 */
function flipAnimation(direction) {
  isFlipping = true;

  // Build a sheet (a fake page that flips)
  const sheet = document.createElement("div");
  sheet.className = "sheet";

  // FRONT = what we currently see on the right page
  const front = document.createElement("div");
  front.className = "front";

  // BACK = what we will see after flipping
  const back = document.createElement("div");
  back.className = "back";

  // Decide which pages should appear on the sheet faces
  if (direction === "forward") {
    const current = getPageData(currentPageIndex);
    const next = getPageData(currentPageIndex + 1);

    front.innerHTML = renderPageHTML(current);
    back.innerHTML = renderPageHTML(next);
  } else {
    // BACKWARD flip:
    // We flip showing current page on front,
    // and previous page on back (so it looks like turning back)
    const current = getPageData(currentPageIndex);
    const prev = getPageData(currentPageIndex - 1);

    front.innerHTML = renderPageHTML(current);
    back.innerHTML = renderPageHTML(prev);
  }

  // Put faces into the sheet
  sheet.appendChild(front);
  sheet.appendChild(back);

  // Add sheet on top of the flipbook
  flipbook.appendChild(sheet);

  // Start animation
  requestAnimationFrame(() => {
    sheet.classList.add("flipping");
  });

  // After animation ends, update the page index and re-render
  sheet.addEventListener("animationend", () => {
    // Update index
    if (direction === "forward") currentPageIndex++;
    else currentPageIndex--;

    // Re-render the real spread
    renderSpread();
    updateControls();

    // Clean up
    sheet.remove();
    isFlipping = false;
  }, { once: true });
}

/**
 * Returns HTML for a page's content.
 * Used inside the flipping sheet faces.
 */
function renderPageHTML(pageData) {
  if (!pageData) {
    return `
      <h3>🫥 (Blank)</h3>
      <p>This page doesn't exist.</p>
      <div class="bubble">Try another page!</div>
    `;
  }

  return `
    <h3>${escapeHTML(pageData.heading)}</h3>
    <p>${escapeHTML(pageData.text)}</p>
    <div class="bubble">${escapeHTML(pageData.note || "✨")}</div>
  `;
}

/* ------------------------------
   9) CONTROLS + KEYBOARD
   ------------------------------ */
function updateControls() {
  if (!currentBook) return;

  // Disable prev if we're at the start
  prevBtn.disabled = (currentPageIndex <= 0);

  // Disable next if we're at the last page
  nextBtn.disabled = (currentPageIndex >= currentBook.pages.length - 1);

  // Update the page counter
  pageNumberEl.textContent = String(currentPageIndex + 1);
  totalPagesEl.textContent = String(currentBook.pages.length);
}

/**
 * Keyboard controls:
 *  - ArrowRight => next page
 *  - ArrowLeft  => prev page
 *  - Escape     => back to library
 */
document.addEventListener("keydown", (e) => {
  // Only do this if we're in the reader view
  const readerIsOpen = !readerView.classList.contains("hidden");
  if (!readerIsOpen) return;

  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
  if (e.key === "Escape") goBackToLibrary();
});

/* ------------------------------
   10) BUTTON EVENTS
   ------------------------------ */
backBtn.addEventListener("click", goBackToLibrary);
nextBtn.addEventListener("click", nextPage);
prevBtn.addEventListener("click", prevPage);

// Jump to a random page (fun!)
randomBtn.addEventListener("click", () => {
  if (!currentBook || isFlipping) return;

  const max = currentBook.pages.length - 1;
  const randomIndex = Math.floor(Math.random() * (max + 1));
  currentPageIndex = randomIndex;

  renderSpread();
  updateControls();
});

/* ------------------------------
   11) SECURITY HELPER
   Escape HTML so kids don't accidentally break the page
   (Example: if they type <h1> in a story, it won't become real HTML)
   ------------------------------ */
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ------------------------------
   12) START THE APP
   ------------------------------ */
renderLibrary();