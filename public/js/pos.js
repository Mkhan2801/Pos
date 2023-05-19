$(document).ready(function () {
  
$.ajax({
  type: "get",
  url: "/api/items",
  success: function (data) {
   pageData = data.filter(function (el) {
      return el.qty > 0 
    });
    itemPrint(pageData);
    recPrint(recData);
 searchData = pageData 
  }
});


$.ajax({
  type: "GET",
  url: "/api/employe",
  success: function (data) {
    for (const key of Object.keys(data)) {
empName.push(data[key].name)
    }
    addName(empName);
    return empName
  }
 
});

})





const chackout = document.querySelector("#chackout");
const itemsBox = document.querySelector("#itemBox");
const recList = document.querySelector("#rec");
const recCount = document.querySelector("#count");
let pageData  //data for this page sales item 
let recData = [];//arr for recipt
let total
let empName = []
let searchData 


function addName (list) {
let text = ''
  for (let name in list)
{
text += `<li><button class="dropdown-item " type="button" id="name${name}" onclick="selectName(name${name})">${list[name]}</button></li>`
}
$('.dropdown-menu').html(text)

}

function selectName(id){
  let name =empName[id.id.slice(4)] 
  $('#name').val(name)
}



function filterFunction() {
 let  input = $('#name').val()

  a = $(".dropdown-item");
  for (let i in a) {
    if (!a[i].innerHTML.toLowerCase().match(input.toLowerCase())) {
      a[i].style.display = "none"
    } else {a[i].style.display = "" }
 
   
  }
}

function itemPrint(data) {

  let totalItems = ''
  let count = 0
  for (const key of Object.keys(data)) {
if( data[key].name !=='Milk'){
  if (data[key].qty > 0) {

    totalItems +=
      `
<div class="col-2 m-2" style="width: 10rem;">
      <div class="card mb-4 ">
        <div class="card-header py-3">
          <h4 class="my-0 fw-normal">${data[key].name} </h4>
          
        </div>
        <div class="card-body">
        <h1 class="card-title pricing-card-title">RS :<small class="text-body-secondary fw-light">${data[key].price}</small></h1>
       
        <button type="button" class=" btn  btn-primary"onclick="addrec(${key})">+</button>
        <button type="button" class=" btn btn-light btn-sm" id='${key}'>${data[key].qty}</button>
        
        <button type="button" class=" btn  btn-primary" onclick="subrec(${key})">-</button>
         

        </div>
      </div>
    </div>`
    count++


  } else {
    totalItems +=
      `
<div class="col-2 m-2 opacity-25" style="width: 10rem;">
      <div class="card mb-4 ">
        <div class="card-header py-3">
          <h4 class="my-0 fw-normal">${data[key].name} </h4>
          
        </div>
        <div class="card-body">
        <h1 class="card-title pricing-card-title">RS :<small class="text-body-secondary fw-light">${data[key].price}</small></h1>
       
         
        <button type="button" class=" btn  btn-primary" >+</button>
        <button type="button" class=" btn btn-light btn-sm" id='${key}'>${data[key].qty}</button>
        
        <button type="button" class=" btn  btn-primary" onclick="subrec(${key})" >-</button>
        </div>
      </div>
    </div>`
    count++

  }
}
    
  }
  itemsBox.innerHTML = totalItems;


};

//print recipt from recipt data arr
function recPrint(data) {
  let rec = '';
  total = 0;
let cart = 0
  for (const key of Object.keys(data)) {


    rec +=

      `
      <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 class="my-0">${data[key].name}  <span class="badge bg-primary rounded-pill">${data[key].qty}</span></h6>
                  
                </div>
                <span class="text-body-secondary" >Rs: ${data[key].price * data[key].qty}</span>
              </li>
  `
    total += data[key].price * data[key].qty
    cart += data[key].qty

  }

  recList.innerHTML = rec +
    `<li class="list-group-item d-flex justify-content-between">
              <div class="text-primary">           
              <h5 class="my-0">Total</h5>
              </div>
                <strong id='totalAmount'>Rs: ${total}</strong>
                        
                          </li>`;

  recCount.innerHTML = cart;


};

//add  item in recipt
function addrec(id) {
 
  if(!recData.find(o => o.name === searchData[id].name)){
    let data = {
      name:searchData[id].name,
      price:searchData[id].price,
      qty: 1
    }
    recData.push(data); 
    
  }else{

    for (const key of recData) {
      if (key.name == searchData[id].name && key.price == searchData[id].price) {

        key.qty++
      }
    }
  }
  
  
  
  recPrint(recData)
  searchData[id].qty--
  itemPrint(searchData)

};

//remove item from recipt
function subrec(id) {
  for (const key of recData) {

    if (key.name == searchData[id].name && key.price == searchData[id].price) {

      if(key.qty == 1){recData.splice(recData.indexOf(key), 1);
        searchData[id].qty++
        break;}
        key.qty --
        searchData[id].qty++
    }
  }

  recPrint(recData)

  itemPrint(searchData)
};

//send  data to server
chackout.addEventListener("click", function () {
  let today = new Date().toLocaleDateString();
  const paymentMethod = document.querySelector('input[name="payBy"]:checked').value;
  
  let payDate = paymentMethod == 'credit' ? '' : today;
  const ename = document.querySelector('#name').value;
let add = empName.includes(ename);


  if (!ename) {
   alert('no name')
  } else if (recData.length == 0) {
   alert('no item')
  }
  else {

    sendData = {
      amount: total,
      name : ename,
      payBy: paymentMethod,
      buyDate: today,
      payDate,
      items: recData}
 

    $.post('/api/sale',sendData)
    location.reload();
  }
})