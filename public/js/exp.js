$(document).ready(function () {

  $.ajax({
    type: "GET",
    url: "/api/exp",
    success: function (data) {
      data.reverse()
      pageData = data
      processData()
    }
   
  });

  
})


let dataList 
let pageData 
let searchData
let itemList = [] 



function processData(){
  let from =Number (new Date ($('#from').val()).getTime())
  let to = Number (new Date( $('#to').val()).getTime())
  let output = [];
for(let key in pageData){
  const date =Number (new Date(pageData[key].date).getTime());
  if ((from < date && date<= to)) {
    output.push(pageData[key]);
  }
}
searchData = output
itemPrint(searchData)
} 

$("#submit").click(()=>{
  processData()
})



function itemPrint(list){
  let text =''
  for (let names in list){
    let name = list[names].name
    let amount = list[names].amount
    let payby = list[names].payBy
     let date = list[names].date
     let items = list[names].items
    let inames = ''
    for (let item in items){
        inames += items[item].name + ', '
    }
    inames = inames.substring(0, inames.length-2)
let tr =  `<tr>
  <td>${Number(names) + 1}</td>
  <td >${date}</td>
  <td>${name}</td>
  <td class="text-success">${inames}</td>
  <td>${amount}</td>
  <td>
  ${payby}
  </td>
  
`
text += tr
}
     $('#tBody').html(text)
}


$('#save').click(()=>{
  let name = $("#firstName").val()
  let paymentMethod = document.querySelector('input[name="payBy"]:checked').value;
  let amount = $("#amount").val()
  if(!name){
   console.log('Add name')
  }
  else if(!amount){
   console.log("Add amount")
  }
  else{
   let sendData = {
       
       name : name,
        type: 'Expences',
           date : new Date().toLocaleDateString(),
           items : itemList,
           payBy : paymentMethod,
           amount: amount}
       $.post('/api/exp',sendData)
   location.reload();
}
})




function ExportData()
{
        filename='reports.xlsx';
    var ws = XLSX.utils.json_to_sheet(searchData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb,filename);
 }