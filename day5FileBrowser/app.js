/**
 * Created by zhannalibman on 19/01/2017.
 */

const readlineSync = require('readline-sync');
var shouldQuit = false;
var currentFolderId = 0;

var fsStorage = [
    //[id, parentId, name, content == null]
    [0, 0, "root"],
    [1, 0, "subfolder1"],
    [2, 0, "subfolder2"],
    [3, 0, "subfolder3"],
    [4, 1, "subfolder4"],
    [5, 4, "subfolder5"],
    [6, 5, "file1", "content1"],
    [7, 5, "file2", "content2"],
];

var menu = [
    "Print current folder",
    "Change current folder",
    "Create file or folder",
    "Delete file or folder",
    // "Search in file or folder",
    "Open file",
    "Quit Program"
];

printCurrentFolder(0);
while (!shouldQuit) {
    const selectedMenuOption = printMenu();
    onMenuOptionSelected(selectedMenuOption);
}

function printMenu(){
    const selectedMenuOption = readlineSync.keyInSelect(menu, "Please make your choice",{"cancel" : false});
    return selectedMenuOption;
}

function onMenuOptionSelected(selectedMenuOption){
    switch (selectedMenuOption){
        //Print current folder
        case 0:
            printCurrentFolder(currentFolderId);
            break;
        //Change current folder
        case 1:
            changeCurrentFolder();
            break;
        //Create file or folder
        case 2:
            break;
        //Delete file or folder
        case 3:
            break;
        //Open file
        case 4:
            break;
        //Quit Program
        case 5:
            shouldQuit = true;
            process.exit(0);
            break;
        default:
            break;
    }
}

function printCurrentFolder(folderId){
    //checks that index is valid
    if (fsStorage.length <= folderId){
        return;
    }
    //checks that at this index there is something
    if(fsStorage[folderId] == null){
        return;
    }
    if(isFolder(folderId)){
        for(var i = 0; i < fsStorage.length; i++){
            if((fsStorage[i])[0] == folderId){
                console.log((fsStorage[i])[2]);
            }
            else if ((fsStorage[i])[1] == folderId){
             console.log("\t" + (fsStorage[i])[2]);
            }
        }
    }
}

function changeCurrentFolder(){
    const folderName = readlineSync.question("Change folder to: ");
    if(folderName.length == 0){
        return;
    }
    if(folderName == ".."){
        goUp();
    }
    else{
       goDown(folderName);
    }
}

//changes folder to one level up
function goUp(){
    var parentId = (fsStorage[currentFolderId])[1];
    currentFolderId = parentId;
    printCurrentFolder(currentFolderId);
}

//changes folder to a specified folder one level down
function goDown(folderName){
    var folderFound = false;
    for(var i = 0; i < fsStorage.length; i++){
        if ((fsStorage[i])[1] == currentFolderId && (fsStorage[i])[2] === folderName){
            if (isFolder(i)){
                folderFound = true;
                currentFolderId = i;
                printCurrentFolder(currentFolderId);
            }
            else{
                folderFound = true;
                console.log(folderName + " is not a folder");
            }
        }
    }
    if(!folderFound){
        console.log("Not found");
    }

}

//checks that it is a folder
function isFolder(id){
    if(fsStorage[id].length == 3){
        return true;
    }
    else{
        return false;
    }
}