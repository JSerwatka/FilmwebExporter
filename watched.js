function loadAllInfiniteScrollChildren(allMoviesContainer, expectedChildCount) {
  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  return new Promise((resolve, reject) => {
    if (!allMoviesContainer) {
      reject("Błąd skryptu: Target element not found.");
      return;
    }

    if (!expectedChildCount) {
      reject("Błąd skryptu: No children found");
      return;
    }

    const currentChildCount = allMoviesContainer.children.length;
    if (currentChildCount >= expectedChildCount) {
      resolve(allMoviesContainer.children);
    }

    const checkAndScroll = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          scrollToBottom();
          const currentChildCount = allMoviesContainer.children.length;

          if (currentChildCount >= expectedChildCount) {
            // All expected children are now visible, scrolling is done
            observer.disconnect();
            resolve(allMoviesContainer.children);
          }
        }
      }
    };

    const observer = new MutationObserver(checkAndScroll);

    observer.observe(allMoviesContainer, { childList: true, subtree: true });

    // Initialize creating new children
    scrollToBottom();
  });
}

function formatDate(dateNumber) {
  const dateStr = dateNumber.toString();

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${year}-${month}-${day}`;
}

async function getMovieData(movieUrl) {
  const parser = new DOMParser();

  const DOMContent = await fetch(movieUrl, {
    method: "GET",
    headers: {
      Cookie: document.cookie,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Bład skryptu podczas ściągania danych filmu`);
      }
      return response.text();
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });

  if (!DOMContent) {
    return undefined;
  }

  const htmlDocument = parser.parseFromString(DOMContent, "text/html");
  let title = htmlDocument.querySelector(
    ".filmCoverSection__titleDetails > .filmCoverSection__title"
  )?.textContent;

  if (!title) {
    title = htmlDocument.querySelector(
      ".filmCoverSection__titleDetails > .filmCoverSection__originalTitle"
    )?.textContent;
  }

  let year = htmlDocument.querySelector(
    ".filmCoverSection__titleDetails > .filmCoverSection__year"
  )?.textContent;
  year = year.split(" - ")[0]; // handle serial dates

  const movieId = htmlDocument.querySelector("a[data-filmid]")?.dataset?.filmid;

  const fullRating =
    htmlDocument
      .querySelector("[itemprop='aggregateRating'] > [itemprop='ratingValue']")
      ?.textContent.replace(",", ".")
      .trim() ?? "";
  const voteCount =
    htmlDocument.querySelector(
      "[itemprop='aggregateRating'] > [itemprop='ratingCount']"
    )?.textContent ?? "";

  return {
    movieId,
    title: title.includes(",") ? `"${title}"` : title,
    year,
    fullRating,
    voteCount: voteCount,
  };
}

async function getRatingData(movieId, contentType) {
  const movieUrl = `https://www.filmweb.pl/api/v1/logged/vote/${contentType}/${movieId}/details`;
  const ratingJSON = await fetch(movieUrl, {
    method: "GET",
    headers: {
      Cookie: document.cookie,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Bład skryptu podczas ściągania oceny filmu`);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });

  if (!ratingJSON) {
    return undefined;
  }

  return {
    voteDate: formatDate(ratingJSON.viewDate),
    userRating: ratingJSON.rate,
  };
}

async function getAllRates() {
  const contentType = window.location.href.split("/").pop();

  const allMoviesContainer = document.querySelector(
    'div[data-group="userPage"]  section > div:nth-child(2)'
  );
  const expectedChildCount = Number(
    document.querySelector(
      'div[data-group="userPage"] li > a.active[data-counter]'
    ).dataset.counter ?? ""
  );
  let allMoviesElements;

  try {
    allMoviesElements = await loadAllInfiniteScrollChildren(
      allMoviesContainer,
      expectedChildCount
    );
  } catch (error) {
    throw new Error(error);
  }

  const allRates = [];

  for (let i = 0; i <= expectedChildCount - 1; i++) {
    const movieLink = allMoviesElements[i].querySelector("a").href;

    try {
      const { movieId, ...movieData } = await getMovieData(movieLink);
      if (!movieId || !movieData) {
        continue;
      }
      const ratingData = await getRatingData(movieId, contentType);

      allRates.push({ ...movieData, ...ratingData });
    } catch (e) {
      console.log(e);
      return allRates;
    }
    console.log("pobrano " + (i + 1) + " z " + expectedChildCount);
  }
  return allRates;
}

function download(filename, text) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function arrayToCsv(allRates) {
  let csvRates = Object.keys(allRates[0]).join(",") + "\n";

  allRates.forEach((dict) => {
    csvRates += Object.values(dict).join(",");
    csvRates += "\n";
  });

  return csvRates;
}

async function main() {
  console.log("Rozpoczynam pobieranie, cierpliwości...");
  console.log("Proszę nie zamykać, przełączać, ani minimalizować tego okna!");
  let allRates = await getAllRates();
  console.log("rozpoczynam ściąganie pliku csv");
  let csvRates = arrayToCsv(allRates);

  download(`Filmweb_watched.csv`, csvRates);
}

main();
