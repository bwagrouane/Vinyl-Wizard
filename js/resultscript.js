const url = window.location.href;
const albumInput = decodeURIComponent(url.substring(url.indexOf("=") + 1));

console.log(albumInput);


let albumRecs;

reccomendationAlgorithmn().then(async function(value){
    albumRecs = value;
    
    const firstAlbum = document.getElementById("1st").lastElementChild;
    firstAlbum.innerText =  albumRecs.at(1).at(1);



    const secondAlbum = document.getElementById("2nd").lastElementChild;
    secondAlbum.innerText =  albumRecs.at(2).at(1);


    const thirdAlbum = document.getElementById("3rd").lastElementChild;
    thirdAlbum.innerText =  albumRecs.at(3).at(1);


    const fourthAlbum = document.getElementById("4th").lastElementChild;
    fourthAlbum.innerText = albumRecs.at(4).at(1);


    const fifthAlbum = document.getElementById("5th").lastElementChild;
    fifthAlbum.innerText = albumRecs.at(5).at(1);


    const sixthAlbum = document.getElementById("6th").lastElementChild;
    sixthAlbum.innerText = albumRecs.at(6).at(1);


    const seventhAlbum = document.getElementById("7th").lastElementChild;
    seventhAlbum.innerText = albumRecs.at(7).at(1);



    const eighthAlbum = document.getElementById("8th").lastElementChild;
    eighthAlbum.innerText = albumRecs.at(8).at(1);


    const ninthAlbum = document.getElementById("9th").lastElementChild;
    ninthAlbum.innerText = albumRecs.at(9).at(1);






        const firstPromise =  musicBrainzAlbumSearch(albumRecs.at(1).at(1), albumRecs.at(1).at(2));
        const secondPromise =  musicBrainzAlbumSearch(albumRecs.at(2).at(1), albumRecs.at(2).at(2));
        const thirdPromise =  musicBrainzAlbumSearch(albumRecs.at(3).at(1), albumRecs.at(3).at(2));
        const fourthPromise =  musicBrainzAlbumSearch(albumRecs.at(4).at(1), albumRecs.at(4).at(2));
        const fifthPromise = musicBrainzAlbumSearch(albumRecs.at(5).at(1), albumRecs.at(5).at(2));
        const sixthPromise =  musicBrainzAlbumSearch(albumRecs.at(6).at(1), albumRecs.at(6).at(2));
        const seventhPromise =  musicBrainzAlbumSearch(albumRecs.at(7).at(1), albumRecs.at(7).at(2));
        const eigthPromise =  musicBrainzAlbumSearch(albumRecs.at(8).at(1), albumRecs.at(8).at(2));
        const ninthPromise =  musicBrainzAlbumSearch(albumRecs.at(9).at(1), albumRecs.at(9).at(2));


        const promises = [firstPromise, 
            secondPromise, 
            thirdPromise, 
            fourthPromise, 
            fifthPromise, 
            sixthPromise,
            seventhPromise,
            eigthPromise,
            ninthPromise];
        const promiseResults = await Promise.all(promises);

            
        
        document.getElementById("1st").firstElementChild.src =  "https://coverartarchive.org/release/" + promiseResults[0] + "/front";
        document.getElementById("2nd").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[1] + "/front";
        document.getElementById("3rd").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[2] + "/front";
        document.getElementById("4th").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[3] + "/front";
        document.getElementById("5th").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[4] + "/front";
        document.getElementById("6th").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[5] + "/front";
        document.getElementById("7th").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[6] + "/front";
        document.getElementById("8th").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[7] + "/front";
        document.getElementById("9th").firstElementChild.src  = "https://coverartarchive.org/release/" + promiseResults[8] + "/front";

        

})









async function reccomendationAlgorithmn() {
    const csv = await fetch("assets/aoty.csv");
    const csvText = await csv.text();

    const lines = csvText.split("\n");
    let linesTable = [];


    const albumInputInfo = findingSpecificLine(albumInput, lines);


    const inputDisplay = document.getElementById("othertitle").lastElementChild;
    inputDisplay.innerText =  albumInputInfo.at(1) + " - " + albumInputInfo.at(2);

    for (let line of lines) {
        let simScore;
        if (line === "")
            continue;
        const lineArray = line.match(/"((?:[^"]|"")*)"|([^,]+)/g);
        
        
        simScore = assignSimScore(lineArray, albumInputInfo);
        
        lineArray.push(simScore);
        linesTable.push(lineArray);
        
    }
    
    return linesTable.sort(compareArrays);
    
     
}



function findingSpecificLine(albumName, lines) {
    for (const line of lines) {
        if (line.match(/(".*?"|[^,]+)/g).at(1) == albumName)
            return line.match(/"((?:[^"]|"")*)"|([^,]+)/g);
    }
    console.log("findspecifcmessedup");
    return "Line Not Found";
}




function assignSimScore(lineArray, albumInputInfo) {
    
    
    
    
    let simScore = 0;
    
    let dateString = lineArray.at(3);
    dateString = dateString.slice(-5).replace("\"", "");
    dateString = parseInt(dateString);

    let inputdateString = albumInputInfo.at(3);
    inputdateString = inputdateString.slice(-5).replace("\"", "");
    inputdateString = parseInt(inputdateString);
    
    simScore -= Math.abs(inputdateString - dateString) *7;
    

    let genreArray = lineArray.at(4);
    genreArray = genreArray.replaceAll("\"", "").split(",");
        
    
    
    let inputgenreArray = albumInputInfo.at(4);
    inputgenreArray = inputgenreArray.replaceAll("\"", "").split(",");
    
    


    for (let i = 0; i < genreArray.length; i++) {
        genreArray[i] = genreArray[i].trim();
    }

    for (let i = 0; i < inputgenreArray.length; i++) {
        inputgenreArray[i] = inputgenreArray[i].trim();
    }

    for (const tag of genreArray) {
        if(inputgenreArray.includes(tag)){
            simScore += 100;
            
            
        }
            
    }
    


    let ratingNumber = lineArray.at(6);
    
    ratingNumber = ratingNumber.replaceAll("\"", "").replace("ratings", "").replace(",", "");
    

    ratingNumber = parseInt(ratingNumber);
    simScore += Math.floor(ratingNumber / 1000) * 3;
    
    let ratingOvr = lineArray.at(5);
    
    ratingOvr = parseInt(ratingOvr);
    
    simScore += Math.floor(ratingOvr / 10) * 2;

    if(ratingNumber < 500)
        simScore = 0;


    if(lineArray.at(0) == albumInputInfo.at(0)){
            simScore = 0;
        }

    if(lineArray.at(1) == "Unknown")
        simScore =0;

    return simScore;
    
    


}


function compareArrays(a , b) {
    



    return b.at(8) - a.at(8);
    



}


async function musicBrainzAlbumSearch(albumName, artistName) {
    
    
    

    try {

        albumName = albumName.replaceAll('"', '\\"')

        const query  = "release:"+ "\""+albumName+"\""+ " AND artist:" + "\""+artistName + "\"";
        const response  = await fetch("https://musicbrainz.org/ws/2/release/?fmt=json&inc=cover-art-archive&query=" + encodeURIComponent(query));
        const responsejson = await response.json();
        

        let id = responsejson["releases"][0]["id"];
        for (const release of responsejson["releases"]) {
            let currentID = release["id"];
            const checkResponse = await fetch("https://coverartarchive.org/release/" + currentID + "/front");
            if (checkResponse.ok){
                return currentID;
            }
                
        }

        
        return id;

    } catch (error) {
        console.error(error);
        
    }

}



