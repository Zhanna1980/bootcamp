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
    [8, 0, "file3", "content3"],
    [9, 0, "a-subfolder6"],
    [10, 0, "b-subfolder6"]
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

/**
 * app's loop
 * */
while (!shouldQuit) {
    const selectedMenuOption = printMenu();
    onMenuOptionSelected(selectedMenuOption);
}

/**
 * Searches element in fsStorage by given id. Binary search. fsStorage needs to be sorted by id.
 * @param elementId - id of the element specified at index 0 of the element.
 * @return the index in fsStorage of the element with given id or -1 if the element has not been found.
 * */
function findElementById(elementId){
    var minIndex = 0;
    var maxIndex = fsStorage.length - 1;
    var currentIndex;
    var currentId;

    while (minIndex <= maxIndex) {
        currentIndex = Math.floor((minIndex + maxIndex) / 2);
        currentId = (fsStorage[currentIndex])[0];

        if (currentId < elementId) {
            minIndex = currentIndex + 1;
        }
        else if (currentId > elementId) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }

    return -1;
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
            createFileOrFolder();
            break;
        //Delete file or folder
        case 3:
            deleteFileOrFolder();
            break;
        //Open file
        case 4:
            openFile();
            break;
        //Quit Program
        case 5:
            quitProgram();
            break;
        default:
            break;
    }
}

/**
 * Prints the content of the folder after sorting by type(first folders then files) and alphabetically.
 * */
function printCurrentFolder(folderId){
    console.log(fsStorage[findElementById(folderId)][2]);
    var folderContent = getElementsWithIndexes(getDirectoryContentIndexes(folderId));
    //sorting by folder/file and alphabetically
    var sortedFolderContent = folderContent.sort(function(a,b){
        return (a.length == b.length) ? (a[2] > b[2]) : (a.length > b.length) });
    for(var i = 0; i < sortedFolderContent.length; i++){
        console.log("\t" + (sortedFolderContent[i])[2]);
    }
}

/**
 * @return Array of indexes of subdirectories and files.
 * If given directoryId is an id of a file the function returns null.
 * */
function getDirectoryContentIndexes(directoryId){
    var indexes = [];
    if(isFolder(directoryId)){
        for(var i = 1; i < fsStorage.length; i++){
            if ((fsStorage[i])[1] == directoryId){
                indexes.push(i);
            }
        }
        return indexes;
    }
    else{
        return null;
    }
}

/**
 * @param Array of indexes of elements in fsStorage.
 * @return Array of elements.
 * */
function getElementsWithIndexes(indexes){
    if(indexes == null){
        return null;
    }
    var elements = [];
    for(var i = 0; i < indexes.length; i++){
        elements.push(fsStorage[indexes[i]]);
    }
    return elements;
}

/**
 * Asks to which folder to go and navigates there
 * */
function changeCurrentFolder(){
    const folderName = readlineSync.question("Change folder to: ");
    if(folderName.length == 0){
        console.log("You didn't enter folder name.")
        return;
    }
    if(folderName == ".."){
        goUp();
    }
    else{
       goDown(folderName);
    }
}

/**
 * Changes current folder to one level up.
 * */
function goUp(){
    var parentId = (fsStorage[findElementById(currentFolderId)])[1];
    currentFolderId = parentId;
    printCurrentFolder(currentFolderId);
}

/**
 * Changes current folder to a specified folder one level down.
 * */
function goDown(folderName){
    const indexInFsStorage = indexOfElementByName(folderName);
    if ( indexInFsStorage == -1){
        console.log("Not found");
        return;
    }
    if (isFolder(indexInFsStorage)){
        currentFolderId = (fsStorage[indexInFsStorage])[0];
        printCurrentFolder(currentFolderId);
    } else{
        console.log(folderName + " is not a folder");
    }
}

/**
 * Creates new file or folder.
 */
function createFileOrFolder(){
    const newFileOrFolderName = readlineSync.question("Please type file/folder name: ");
    if(newFileOrFolderName.length == 0){
        console.log("You didn't enter file/folder name.");
        return;
    }
    if(indexOfElementByName(newFileOrFolderName) != -1){
        console.log("Such file/folder already exists.");
        return;
    }
    const fileContent = readlineSync.question("Please write your content: ");
    const lastId = (fsStorage[fsStorage.length - 1])[0];
    var newElement = [lastId + 1, currentFolderId, newFileOrFolderName];
    if(fileContent.length > 0){
        newElement.push(fileContent);
    }
    fsStorage.push(newElement);
    printCurrentFolder(currentFolderId);
}

/**
 * Checks if current folder contains file or folder with a specified name.
 * @param name - file or folder name to search for in the current folder.
 * @return index in fsStorage. If there is no such file or folder returns -1.
 * */
function indexOfElementByName(name){
    for(var i = 0; i < fsStorage.length; i++){
        if ((fsStorage[i])[1] == currentFolderId && (fsStorage[i])[2] === name) {
            return i;
        }
    }
    return -1;
}

/**
 * Deletes file or folder.
 * */
function deleteFileOrFolder() {
    const toBeDeletedName = readlineSync.question("Please type file/folder name to be deleted: ");
    if(toBeDeletedName.length == 0){
        console.log("You didn't enter file/folder name.");
        return;
    }
    if (toBeDeletedName == "root"){
        console.log("This folder can not be deleted.");
        return;
    }
    const indexToBeDeleted = indexOfElementByName(toBeDeletedName);
    if(indexToBeDeleted == -1){
        console.log("There is no such file/folder in the current directory.");
        return;
    }
    if (readlineSync.keyInYN("Are you sure?")) {
        // 'Y' key was pressed.
        if(fsStorage[indexToBeDeleted].length == 3){
            var allSubdirAndFiles = (findAllSubdirAndFiles(indexToBeDeleted)).sort();
            for(var i = allSubdirAndFiles.length - 1; i >= 0; i--){
                fsStorage.splice(allSubdirAndFiles[i], 1);
            }
        }
        fsStorage.splice(indexToBeDeleted,1);
        console.log(toBeDeletedName, "was deleted.");
        printCurrentFolder(currentFolderId);
    }
}

/**
 * Searches recursively for all subdirectories and files in specified directory.
 * @param indexInFsStorage - index of the directory in fsStorage.
 * @return Array of indexes of all subdirectories and files.
 * */
function findAllSubdirAndFiles(indexInFsStorage) {
    var folderContent = getDirectoryContentIndexes((fsStorage[indexInFsStorage])[0]);
    var results = [].concat(folderContent);
    for (var i = 0; i < folderContent.length; i++){
        if(fsStorage[folderContent[i]].length == 3){
            results = results.concat(findAllSubdirAndFiles(folderContent[i]));
        }
    }
    return results;
}

/**
 * Displays file content.
 */
function openFile(){
    const fileName = readlineSync.question("Which file to open? ");
    if(fileName.length == 0){
        "You didn't enter file name."
        return;
    }
    const indexInFsStorage = indexOfElementByName(fileName);
    if ( indexInFsStorage == -1){
        console.log("Not found");
        return;
    }
    if (!isFolder(fsStorage[indexInFsStorage][0])){
        var hasContent = (fsStorage[indexInFsStorage])[3] != null;
        console.log((fsStorage[indexInFsStorage])[2], hasContent ? ("\n\t" + (fsStorage[indexInFsStorage])[3]) : " is empty");
    }
    else{
        console.log(fileName, "is not a file");
    }
}

/**
 * Asks user for confirmation and quits the program
 * */
function quitProgram() {
    if (readlineSync.keyInYN("Do you want to quit?")) {
        // 'Y' key was pressed.
        shouldQuit = true;
        process.exit(0);
    } else {
        return;
    }
}

/**
 * Checks that the element is a folder.
 * Returns true if it is a folder and false if it is a file
 * */
function isFolder(id){
    if(fsStorage[findElementById(id)].length == 3){
        return true;
    }
    else{
        return false;
    }
}