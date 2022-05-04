const monthMapper = {
    "stycznia": "01",
    "lutego": "02",
    "marca": "03",
    "kwietnia": "04",
    "maja": "05",
    "czerwca": "06",
    "lipca": "07",
    "sierpnia": "08",
    "września": "09",
    "października": "10",
    "listopada": "11",
    "grudnia": "12"
};

const mapDate = (date) => {
    const [day, monthName, year] = date.split(" ");

    if (!year || !monthName || !day) {
        return "";
    }

    return `${year}-${monthMapper[monthName]}-${day.padStart(2, "0")}`;
};

const parseDom = (dom) => {
    const moviesNodes = dom.querySelectorAll("div.voteBoxes__box");
    let arr = [];

    try {
        for (movie of moviesNodes) {
            let title = movie.querySelector("div.preview__originalTitle")?.textContent;
            if (!title) {
                title = movie.querySelector("h2.preview__title").textContent;
            }

            const movieId = movie.getAttribute("data-id");
            const year = movie.querySelector("div.preview__year").textContent;
            const userVote = movie.querySelector("span.userRate__rate").textContent;
            const voteDate = mapDate(movie.querySelector(".voteCommentBox__date").textContent);
            const fullRate = movie.querySelector(".communityRatings__value").textContent.replace(",", ".");
            const voteCount = movie.querySelector(".communityRatings__description").firstElementChild.textContent.replace(" ", "");

            arr.push({
                movieId,
                title: title.includes(",") ? `"${title}"` : title,
                year,
                fullRate,
                voteCount,
                userVote,
                voteDate
            });
        }

        return arr;
    }
    catch (e) {
        console.log('Wystąpił problem z parsowaniem strony ' + e);
        return [];
    }
};

const waitForCommentSectionToLoad = async (iframe, i) => {
    return new Promise((resolve) => {
        const waitForDateInterval = setInterval(() => {
            const childDocument = (iframe.contentDocument || iframe.contentWindow.document).documentElement;
            const commentSections = childDocument.querySelectorAll(".voteCommentBox");
        
            commentSections[i].scrollIntoView(false);
        
            if (commentSections[i].querySelector(".voteCommentBox__date").textContent) {
                clearInterval(waitForDateInterval);
                resolve();
            }
        }, 100)
    })

};

const getIframeDom = async (url) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("height", 200);
    iframe.setAttribute("width", 200);
    document.body.appendChild(iframe);

    return new Promise(resolve => iframe.addEventListener("load", async () => {
        const childDocument = (iframe.contentDocument || iframe.contentWindow.document).documentElement;
        const commentSections = childDocument.querySelectorAll(".voteCommentBox");

        for (let i = 0; i < commentSections.length; i++) {
            await waitForCommentSectionToLoad(iframe, i);
        }

        const dom = (iframe.contentDocument || iframe.contentWindow.document).documentElement;
        iframe.remove()
        resolve(dom);
    }))
};

const getAllRates = async () => {
    const ratesNum = Number(document.querySelector(".blockHeader__titleInfoCount").textContent)
    const numOfPages = Math.ceil(ratesNum / 25);
    const userFilmwebUrl = window.location.href;
    let allRates = []

    console.log("Rozpoczynam pobieranie, cierpliwości...");
    for (let i = 1; i <= numOfPages; i++) {
        const dom = await getIframeDom(userFilmwebUrl + "?page=" + i);
        allRates = allRates.concat(parseDom(dom));
        console.log("pobrano " + Math.min(25 * i, ratesNum) + " z " + ratesNum);
    }

    return allRates;
};

const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


const arrayToCsv = (allRates) => {
    let csvRates = Object.keys(allRates[0]).join(",") + "\n";
    allRates.forEach((dict) => {
        csvRates += Object.values(dict).join(",");
        csvRates += "\n";
    });

    return csvRates;
};

const main = async () => {
    let allRates = await getAllRates();
    let csvRates = arrayToCsv(allRates);
    download('Filmweb2Letterboxd_watched.csv', csvRates)
};

main();