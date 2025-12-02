const splashText =  document.getElementById("splash");
kanyeQuotes().then(function(quote){
    splashText.innerText = quote;
});

let awesompleteList;

generatingNamesArray().then(function(array){

    const inputty = document.getElementById("inputty");
    var awesomplete = new Awesomplete(inputty);
    awesomplete.list = array;
    awesompleteList = array;

 });




const inputty = document.getElementById("inputty");
const albumInputForm = document.getElementById("albumInputForm");

albumInputForm.addEventListener("submit",function(event){
    event.preventDefault();
    const albumSubmission = inputty.value;
    let inputVerified = false;
    
    for (const name of awesompleteList) {
        
        
        if(albumSubmission == name){
            inputVerified =true;
            console.log("made it this far");
        }
        
    }
    if (inputVerified == true){
        
        window.location.href = "results.html?albumSubmission=" + encodeURIComponent(albumSubmission);
    }
    else{
        const inputFail  = document.getElementById("inputFail");
        inputFail.innerText = "Error: please input an album that exists in the database";
    }


});

async function generatingAlbumNames() {
    const daResponse = await fetch("assets/aoty.csv");
    const textCSV =  await daResponse.text();
    const lines = textCSV.split("\n");
    let albumNames = "";
    for (let line of lines) {
        if(line == "")
            continue;
        line = line.match(/"((?:[^"]|"")*)"|([^,]+)/g);
        albumNames = albumNames.concat(line.at(1) + ",");
    }
    console.log(albumNames);
}

async function generatingNamesArray() {
    const daResponse = await fetch("assets/albumNamesV3.txt");
    const textNames =  await daResponse.text();
    const namesArray = textNames.match(/"((?:[^"]|"")*)"|([^,]+)/g);
    return namesArray;
}

async function kanyeQuotes() {
    try {
        const response  = await fetch("https://api.kanye.rest");
        const reponsejson = await response.json();
        const quote = reponsejson.quote;
        return quote;

    } catch (error) {
        console.error("couldnt load the kanye quote :(");
        return "Minecraft Splash Text";
    }
}


