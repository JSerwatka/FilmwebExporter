function formatDate(dateNumber) {
    const dateStr = dateNumber?.toString();
    if (!dateStr) {
        return `-`
    }

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    return `${year}-${month}-${day}`;
}

async function fetchApi(endpoint) {
    const dataJSON = await fetch(`https://www.filmweb.pl/api/v1/${endpoint}`, {
        method: "GET",
        headers: {
            Cookie: document.cookie,
            'X-Locale': 'pl',
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw Error(`Błąd skryptu podczas fetchowania`, {
                    endpoint,
                    response: JSON.stringify(response)
                })
            }
            return response.json()
        })

    return dataJSON;
}

async function getAllRates() {
    let nextPage = 1
    const allVotes = []
    const allData = [];

    while (true) {
        // get rating, id, viewDate
        const dataJSON = await fetchApi(`logged/vote/title/film?page=${nextPage}`)
        if (dataJSON.length == 0) {
            break
        }

        allVotes.push(...dataJSON)
        nextPage += 1;
    }

    for (let i = 0; i < allVotes.length; i++) {
        const vote = allVotes[i]

        const id = vote["entity"];
        if (!id) {
            throw Error(`Film nie znaleziony: ${JSON.stringify(vote)}`)
        }
        // get title, year
        const descriptionData = await fetchApi(`title/${id}/info`);
        const title = descriptionData["title"] ? descriptionData["title"] : descriptionData["originalTitle"]

        // get rating, voteCount
        const ratingData = await fetchApi(`film/${id}/rating`)

        allData.push({
            movieId: id,
            title: title.includes(",") ? `"${title}"` : title,
            year: descriptionData.year,
            fullRating: ratingData.rate,
            voteCount: ratingData.count,
            voteDate: formatDate(vote.viewDate),
            userRating: vote.rate > 0 ? vote.rate : "-",
            favorite: vote["favorite"] ? "tak" : "nie"
        })

        console.log("pobrano " + (i + 1))
    }

    return allData;
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
    const csvRates = arrayToCsv(allRates);

    download(`Filmweb_watched_film.csv`, csvRates);
}

main();