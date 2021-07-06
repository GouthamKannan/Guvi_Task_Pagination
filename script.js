let refData = {
    pageData: [],
    page: 1,
    rows: 10
}

let table = createElement("table");
table.classList.add("table");
let thead = createElement("thead");
thead.classList.add("thead-light");
let tr = createElement("tr");
let th1 = createElement("th","ID");
let th2 = createElement("th","NAME");
let th3 = createElement("th","EMAIL");
tr.append(th1,th2,th3);
thead.append(tr);
table.append(thead);
document.getElementById("mainSection").append(table);

let jsonData = new XMLHttpRequest();

try {
    jsonData.open("GET","https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json",true);
    jsonData.send();
    let pageData = [];
    jsonData.onload = function(){
        let data = JSON.parse(this.response);
        for(let value of data){
            let curDetails = {};
            curDetails.id = value.id;
            curDetails.name = value.name;
            curDetails.email = value.email;
            pageData.push(curDetails);
        }
        refData.pageData = pageData;
        loadPagination(refData.pageData,refData.page,refData.rows,true);
    };
} 
catch (error) {
    console.log(error);
}

function loadPagination(pageData,page,rows,isLoadButton){
    let firstRecord = (page - 1) * rows;
    let lastRecord = page * rows;
    let curData = pageData.slice(firstRecord,lastRecord);
    loadTable(curData);
    if(isLoadButton){
        let buttonCount = Math.ceil(pageData.length/rows);
        loadButton(buttonCount);
    }
}

function loadTable(data){
    let tbody = createElement("tbody");
    tbody.setAttribute("id","tablebody");
    for(value of data){
        let tr = createElement("tr");
        let tdID = createElement("td",value.id);
        let tdName = createElement("td",value.name);
        let tdEmail = createElement("td",value.email);
        tr.append(tdID,tdName,tdEmail);
        tbody.append(tr);
    }
    table.append(tbody);
}

function loadButton(counts){
    let buttondiv = createElement("div");
    buttondiv.setAttribute("id","button");

    let firstButton = createElement("button","First");
    firstButton.setAttribute("class","btn btn-primary");
    firstButton.addEventListener("click",()=>reload(1)); 
    buttondiv.append(firstButton);

    let prevButton = createElement("button","Previous");
    prevButton.setAttribute("class","btn btn-primary");
    prevButton.addEventListener("click",()=>{
        if (refData.page === 1)
            reload(1);
        else
            reload(refData.page - 1);
    });
    buttondiv.append(prevButton);

    for(let count = 1; count<= counts; count++){
        let button = createElement("button",count);
        button.setAttribute("class","btn btn-primary");
        button.addEventListener('click',()=>reload(count));
        buttondiv.append(button);
    } 

    let nextButton = createElement("button","Next")
    nextButton.setAttribute("class","btn btn-primary");
    nextButton.addEventListener("click",()=>{
        if (refData.page === Math.ceil(refData.pageData.length/refData.rows))
            reload(refData.page);
        else
            reload(refData.page + 1);
    });
    buttondiv.append(nextButton);
    
    let lastButton = createElement("button","Last")
    lastButton.setAttribute("class","btn btn-primary");
    lastButton.addEventListener("click",()=>reload(Math.ceil(refData.pageData.length/refData.rows))); 
    buttondiv.append(lastButton);

    document.getElementById("mainSection").append(buttondiv);  
}

function createElement(elementName,value = ""){
    var element = document.createElement(elementName);
    element.innerHTML = value;
    return element;
}

function reload(count){
    refData.page = count;
    let tableBody = document.getElementById("tablebody");
    tableBody.remove();
    loadPagination(refData.pageData,refData.page,refData.rows,false);
}
