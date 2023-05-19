$(document).ready(function () {


  $.ajax({
    type: "GET",
    url: "/api/items",
    success: function (data) {
      pageData = data
      itemPrint(pageData)
   
   searchData = pageData
    }
   
  });
  
})





let dataList 
let pageData 
let searchData
let itemList = [] 




  
$("#submit").click(()=>{
  itemPrint(searchData)
})

function itemPrint(list){
  let text =''
  for (let names in list){
    let name = list[names].name
    let price = list[names].price
    let reming = list[names].qty
    let buy = count(list[names].itemData.buy)
    let sell = count(list[names].itemData.sell)
let open = reming - buy + sell
if(name !== 'Milk'){
  let tr =  `<tr>
  <td>${Number(names) + 1}</td>
  <td>${name}</td>
  <td>Rs. ${price}/-</td>
  <td>
  ${open}
  </td>
  <td class="text-danger">
  ${sell}
  </td>
 <td class="text-success">
 ${buy}
 </td>
<td>${reming}</td>
</tr>
`
text += tr
}

}
     $('#tBody').html(text)
}


function count(arr){
  let from = new Date($('#from').val()).toLocaleDateString()
  let to = new Date($('#to').val()).toLocaleDateString()
  
  let total = 0;
  if(arr !== undefined){
    for (let count in arr){
      let date = arr[count].date; 
    
          if (from < date && date<= to) {
  total += arr[count].qty
  }
  
  }
  }
  return total
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
        type: 'Sales & Office use',
           date : new Date().toLocaleDateString(),
           items : itemList,
           payBy : paymentMethod,
           amount: amount}
           
       
       console.log(sendData)
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