function parseDom(dom) {
    let iterator_card = dom.evaluate('//div[contains(@class, "voteBoxes__box")]',
        dom, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    let iterator_votes = dom.evaluate('//span[contains(@data-source, "userVotes")]/script[contains(@type, "application/json")]',
        dom, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    let arr = [];
    try {
        let ratingBoxNode = iterator_card.iterateNext();
        let ratingJsonNode = iterator_votes.iterateNext();
        while (ratingBoxNode) {
            // Get movie's title -> str
            let title = dom.evaluate('.//div[contains(@class, "filmPreview__originalTitle")]',
                ratingBoxNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (title == null)
                title = dom.evaluate('.//h2[contains(@class, "filmPreview__title")]',
                    ratingBoxNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            title = `\"${title.textContent}\"` 

            // Get movie's release year -> str
            let year = dom.evaluate('.//div[contains(@class, "filmPreview__extraYear")]',
                ratingBoxNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;

            // Get user's rating   
            let ratingJsonNodeInner = JSON.parse(ratingJsonNode.innerText);
            let user_vote = `${ratingJsonNodeInner["r"]}`;

            if (user_vote === "0") {
                user_vote = "";
            }

            // Get user's vote date (rating date is sometimes absent -> user timestamp)
            let vote_year = "";
            let vote_month = "";
            let vote_day = "";

            if ("d" in ratingJsonNodeInner) {
                vote_year = ratingJsonNodeInner["d"]["y"].toString();
                vote_month = ratingJsonNodeInner["d"]["m"].toString().padStart(2, "0");
                vote_day = ratingJsonNodeInner["d"]["d"].toString().padStart(2, "0");
            }
            else {
                date = new Date(ratingJsonNodeInner["t"] * 1000);
                vote_year = date.getFullYear()
                vote_month = date.getMonth().toString().padStart(2, "0");
                vote_day = date.getDate().toString().padStart(2, "0");
            }
            let vote_date = `${vote_year}-${vote_month}-${vote_day}`;

            // --- Additional fields ---
            // Get user's rating date - as timestamp
            let timestamp  = `${ratingJsonNodeInner["t"]}`;
            // Get movie's id
            let movie_id  = `${ratingJsonNodeInner["eId"]}`;
            // Get filmweb's community rating
            let full_rate = dom.evaluate('.//span[@class="rateBox__rate" and @itemprop="ratingValue"]',
                ratingBoxNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
            full_rate = full_rate.replace(",", ".")
            
            // Get movie's rating count
            let vote_count = dom.evaluate('.//span[contains(@class,"rateBox__votes--count")]',
                ratingBoxNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.getAttribute("content");

            arr.push({
                title: title,
                movie_id: movie_id,
                year: year,
                full_rate: full_rate,
                vote_count: vote_count,
                user_vote: user_vote,
                timestamp: timestamp,
                iso_date: vote_date
            });

            ratingBoxNode = iterator_card.iterateNext();
            ratingJsonNode = iterator_votes.iterateNext();
        }
        return arr;
    } catch (e) {
        console.log('Wyst??pi?? problem z parsowaniem strony ' + e);
        return [];
    }
}

function getSourceAsDOM(url) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    let parser = new DOMParser();
    return parser.parseFromString(xmlhttp.responseText, "text/html");
}

function getAllRates() {
    let ratesNum = document.evaluate('//span[contains(@class, "blockHeader__titleInfoCount")]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    let pages = Math.ceil(ratesNum / 25);
    let url = window.location.href;

    console.log("Rozpoczynam pobieranie, cierpliwo??ci...");
    let allRates = parseDom(document);
    for (let i = 2; i <= pages; i++) {
        let dom = getSourceAsDOM(url + "?page=" + i);
        allRates = allRates.concat(parseDom(dom));
        console.log("pobrano " + Math.min(25 * i, ratesNum) + " z " + ratesNum);
    }

    return allRates;
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
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
    

function main () {
    let allRates = getAllRates();
    let csvRates = arrayToCsv(allRates);
    download('filmweb_export_watched.csv', csvRates)
}

main();