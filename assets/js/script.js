'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// quotes loader
const quotesContainer = document.querySelector("[data-quotes-container]");

if (quotesContainer) {
  const quotesError = document.querySelector("[data-quotes-error]");

  const parseCsv = (text) => {
    const rows = [];
    let current = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '"') {
        if (insideQuotes && text[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        current.push(value);
        value = "";
      } else if ((char === "\n" || char === "\r") && !insideQuotes) {
        if (char === "\r" && text[i + 1] === "\n") i++;
        if (value.length || current.length) {
          current.push(value);
          rows.push(current);
          current = [];
          value = "";
        }
      } else {
        value += char;
      }
    }

    if (value.length || current.length) {
      current.push(value);
      rows.push(current);
    }

    return rows;
  };

  const renderQuotes = (rows) => {
    const dl = document.createElement("dl");
    dl.className = "quotes-list";

    rows.forEach((row, index) => {
      if (index === 0 && row[0]?.toLowerCase() === "quote") return;
      const quote = row[0]?.trim();
      const attribution = row[1]?.trim();
      if (!quote) return;

      const dt = document.createElement("dt");
      dt.textContent = quote;

      const dd = document.createElement("dd");
      dd.textContent = attribution || "";

      dl.appendChild(dt);
      dl.appendChild(dd);
    });

    return dl;
  };

  fetch("./assets/data/quotes.csv")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((text) => {
      const rows = parseCsv(text);
      if (rows.length <= 1) throw new Error("No quotes found");
      const list = renderQuotes(rows);
      quotesContainer.innerHTML = "";
      quotesContainer.appendChild(list);
    })
    .catch((error) => {
      console.error("Failed to load quotes", error);
      quotesContainer.innerHTML = "";
      if (quotesError) quotesError.hidden = false;
    });
}
