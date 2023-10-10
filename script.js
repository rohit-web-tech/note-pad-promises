const colorsBtn = document.querySelector("#color");
const increaseFontSize = document.querySelector(".increase-font-size");
const boldBtn = document.querySelector(".bold");
const italicBtn = document.querySelector(".italic");
const underlineBtn = document.querySelector(".underline");
const leftAlignBtn = document.querySelector(".left-align");
const centerAlignBtn = document.querySelector(".center-align");
const rightAlignBtn = document.querySelector(".right-align");
const justifyTextBtn = document.querySelector(".justify");
const editor = document.querySelector(".editor");
const saveBtn = document.querySelector(".save-file");
const clearAllBtn = document.querySelector(".clear-all");
const openFileBtn = document.querySelector(".open-files");
const openFiles = document.querySelector("#files");
const closeBtn = document.querySelector(".close");
const filesBar = document.querySelector(".files-bar");
const alertInterface = document.querySelector("#alert");
const confirmInterface = document.querySelector("#confirm");
const promptInterface = document.querySelector("#prompt");
let saveHtml = saveBtn.innerHTML;
let index = null;
let array = [];
let files = '';
let filesArray = localStorage.getItem('files');
if (filesArray != null && filesArray != 'undefined') {
    array = JSON.parse(filesArray);
    display();
}

function saveFile() {
    if (index != null) {
        let fileName = array[index].file.title;
        array.splice(index, 1, { 'file': { 'title': fileName, 'content': editor.value } });
        save(array);
        myAlert(`File saved as ${fileName}`, "check");
        closeFile();
        display();
    }
    else {
        if (editor.value != '') {
            myPrompt("Enter file name to save current file.").then((fileName)=>{
                array.push({ 'file': { 'title': fileName, 'content': editor.value } });
                save(array);
                myAlert(`File saved as ${fileName}`, "check");
                display();
                closeFile();
            }).catch(err=>console.error(err));
        } else {
            myAlert("There is nothing to save .", "exclamation");
        }
    }
}

function save(array1) {
    let string = JSON.stringify(array1);
    localStorage.setItem('files', string);
}


function display() {
    array.forEach((element, index) => {
        files += `
           <div class="files" id="${index}">
               <div class="file-name">${index + 1}. ${element.file.title}</div>
               <div class="edit"><i class="fa-solid fa-edit"></i></div>
               <div class="delete"><i class="fa-solid fa-trash"></i></div>
           </div>   `;
    });
    filesBar.innerHTML = files;
    const editBtn = document.querySelectorAll(".edit");
    const deleteBtn = document.querySelectorAll(".delete");
    console.log(editBtn);
    editBtn.forEach((btn) => {
        btn.onclick = () => {
            if (editor.value != '') {
                myConfirm("Do you want to save current file?").then((result)=>{
                    if (result) {
                        let content = editor.value;
                        if (index != null) {
                            let fileName = array[index].file.title;
                            array.splice(index, 1, { 'file': { 'title': fileName, 'content': content } });
                            save(array);
                            myAlert(`File saved as ${fileName}`, "check");
                            index=null;
                            display();
                        }
                        else {
                                myPrompt("Enter file name to save current file.").then((fileName)=>{
                                    array.push({ 'file': { 'title': fileName, 'content': content } });
                                    save(array);
                                    myAlert(`File saved as ${fileName}`, "check");
                                    display();
                                }).catch(err=>console.error(err));    
                        }
                        index = btn.parentElement.getAttribute("id");
                        editFile(index);
                    }
                });
            }
            else {
                index = btn.parentElement.getAttribute("id");
                editFile(index);
            }
        }
    })
    deleteBtn.forEach((btn) => {
        btn.onclick = () => {
            deleteFile(btn.parentElement.getAttribute("id"));
        }
    })
    files = '';
}

function editFile(index) {
    editor.value = array[index].file.content;
    let fileName = array[index].file.title;
    saveBtn.innerHTML = `<i class="fa-solid fa-save"></i> Save As`;
    openFiles.style.display = "none";
    myAlert(`${fileName} file has been opened.`, "check");
}

function deleteFile(index1) {
    let fileName = array[index1].file.title;
    myConfirm(`Do you really want to delete ${fileName} file?`).then((result)=>{
        if (result) {
            array.splice(index1, 1);
            save(array);
            display();
            myAlert(`${fileName} file has been deleted successfully!!`, 'trash');
            closeFile();
        }
    }).catch(err=>console.error(err));
}

function closeFile() {
    index = null;
    editor.value = '';
    saveBtn.innerHTML = saveHtml;
}

function isFileAlreadyExist(nameOfFile) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (array[i].file.title == nameOfFile)
            return true;
    }
    return false;
}

function myAlert(content, status) {
    alertInterface.style.display = "flex";
    document.querySelector("#alert .alert-box .logo").innerHTML = `
    <div class="${status} message-logo"><i class="fa-solid fa-${status}"></i></div>`;
    document.querySelector("#alert .alert-box .text p").innerText = content;
    document.querySelector("#alert .alert-box .ok-btn").onclick = () => {
        alertInterface.style.display = "none";
    }
}

async function myConfirm(content) {
    let p1 = new Promise((resolve,reject)=>{
        confirmInterface.style.display = "flex";
        document.querySelector("#confirm .confirm-box .text p").innerText = content;
        resolve ("done");
    })
    let p2 = new Promise((resolve,reject)=>{
        document.querySelector("#confirm .confirm-box .confirm-btns .Yes-btn").onclick = () => {
            confirmInterface.style.display = "none";
            resolve(true);
        }
        document.querySelector("#confirm .confirm-box .confirm-btns .No-btn").onclick = () => {
            confirmInterface.style.display = "none";
            resolve(false);
        }
    })
    await p1
    let flag = await p2
    return (flag)
}

async function myPrompt(content) {
    let p1 = new Promise((resolve,reject)=>{
        document.querySelector("#prompt .prompt-box .text").classList.remove("err-text");
        promptInterface.style.display = "flex";
        document.querySelector("#prompt .prompt-box .text p").innerText = content;
        resolve ("Done");
    })
    let p2 = new Promise((resolve,reject)=>{
        document.querySelector("#prompt .prompt-box .confirm-btns .Yes-btn").onclick = () => {
            let fileName = document.querySelector("#prompt .prompt-box #file-name").value;
            if (fileName == '') {
                document.querySelector("#prompt .prompt-box .text").classList.add("err-text");
                document.querySelector("#prompt .prompt-box .text p").innerText = "Please Enter a file Name!!";
            }
            else if (isFileAlreadyExist(fileName)) {
                document.querySelector("#prompt .prompt-box .text").classList.add("err-text");
                document.querySelector("#prompt .prompt-box .text p").innerText = "A file already exist with same name!!";
            }
            else {
                promptInterface.style.display = "none";
                resolve(fileName);
            }
        }
        document.querySelector("#prompt .prompt-box .confirm-btns .No-btn").onclick = () => {
            promptInterface.style.display = "none";
            reject("File saving cancelled!!");
        }
    })
    await p1;
    let fileName = await p2;
    return (fileName) ;
}

colorsBtn.oninput = () => {
    editor.style.color = colorsBtn.value;
}
italicBtn.onclick = () => {
    editor.classList.toggle("italics");
    italicBtn.classList.toggle("click");
}
underlineBtn.onclick = () => {
    editor.classList.toggle("underlines");
    underlineBtn.classList.toggle("click");
}
leftAlignBtn.onclick = () => {
    editor.classList.toggle("left");
    editor.classList.remove("center");
    editor.classList.remove("right");
    editor.classList.remove("justify");
    leftAlignBtn.classList.toggle("click");
    centerAlignBtn.classList.remove("click");
    rightAlignBtn.classList.remove("click");
    justifyTextBtn.classList.remove("click");
}
centerAlignBtn.onclick = () => {
    editor.classList.remove("left");
    editor.classList.toggle("center");
    editor.classList.remove("right");
    editor.classList.remove("justify");
    centerAlignBtn.classList.toggle("click");
    leftAlignBtn.classList.remove("click");
    rightAlignBtn.classList.remove("click");
    justifyTextBtn.classList.remove("click");
}
rightAlignBtn.onclick = () => {
    editor.classList.remove("left");
    editor.classList.remove("center");
    editor.classList.toggle("right");
    editor.classList.remove("justify");
    rightAlignBtn.classList.toggle("click");
    leftAlignBtn.classList.remove("click");
    centerAlignBtn.classList.remove("click");
    justifyTextBtn.classList.remove("click");
}
justifyTextBtn.onclick = () => {
    editor.classList.remove("left");
    editor.classList.remove("center");
    editor.classList.remove("right");
    editor.classList.toggle("justify");
    justifyTextBtn.classList.toggle("click");
    leftAlignBtn.classList.remove("click");
    rightAlignBtn.classList.remove("click");
    centerAlignBtn.classList.remove("click");
}
boldBtn.onclick = () => {
    editor.classList.toggle("bolder");
    boldBtn.classList.toggle("click");
}
openFileBtn.onclick = () => {
    openFiles.style.display = "block";
}
closeBtn.onclick = () => {
    openFiles.style.display = "none";
}
saveBtn.onclick = () => {
    saveFile();
}
clearAllBtn.onclick = () => {
    myConfirm("Do you really want to close file ?").then((result)=>{
        if (result) {
            closeFile();
        }
    }).catch(err=>console.error(err));
}