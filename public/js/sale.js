$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/api/employe",
    success: function (data) {
      pageData = create(data)
      processData()
      itemPrint(searchData)
    }
  
  });
  
 })

 let dataList
  let pageData
  let searchData

  
  
  function processData() {
    let from = Number(new Date($('#from').val()).getTime())
    let to = Number(new Date($('#to').val()).getTime())
    let output = [];
    for (let key in pageData) {
      const date = Number(new Date(pageData[key].date).getTime());
      if ((from < date && date <= to) || pageData[key].payBy == 'credit') {
        output.push(pageData[key]);
      }
    }

    
output.sort((a,b) => Number(new Date(a.date).getTime())-  Number(new Date(b.date).getTime())).reverse()
    searchData = output
  
  }
  
  $("#submit").click(() => {
    processData()
    itemPrint(searchData)
  })
  
  
  
  function create(list) {
    let arr = []
    count = 1
    for (let names in list) {
  
      let name = list[names].name
      let sales = list[names].sales
  
      for (let item in sales) {
        let data = sales[item]
        let amount = Number(sales[item].amount);
        let date = sales[item].buyDate;
        let payBy = sales[item].payBy;
        let itemDetail = sales[item].items;
        let itemArr = ''
  
        for (let items in itemDetail) {
          itemArr += itemDetail[items].name + ', '
        }
        arr.push({
          Sno: count,
          date: date,
          name: name,
          payBy: payBy,
          amount: amount,
          items: itemArr.substring(0, itemArr.length - 2)
        })
        count++
      }
  
    }
  
    return arr
  }
  
  
  function itemPrint(list) {
    let text = ''
    let total = 0
    for (let names in list) {
      let name = list[names].name
      let date = list[names].date
      let payBy = list[names].payBy
      let amount = list[names].amount
      let items = list[names].items
      total += amount
      if(name !== 'Office use' && name !== 'Spoiled'){

        let tr = `<tr class="${payBy == 'credit' ? 'bg-danger' : ''}">
        <td>${Number(names) + 1}</td>
        <td>${date}</td>
        <td>${name}</td>
        <td>${items}</td>
        <td>${amount}</td>
       <td class="">  <div class="d-flex col" id="paymentMethod">
          <div class="">
            <input class="" type="radio" name="sno${names}" id="sno${names}_1" value="cash"  ${payBy == 'cash' ? 'checked' : payBy == 'paytm' ? 'disabled' : name == 'Spoiles' ? 'disabled' : 'checked'}>
            <label class="" for="cash">Cash</label>
          </div>
          <div class="">
            <input class="" type="radio" name="sno${names}" id="sno${names}_2" value="paytm" ${payBy == 'cash' ? 'disabled' : payBy == 'paytm' ? 'checked' : name == 'Spoiles' ? 'disabled' : ''}>
            <label class="" for="paytm">Paytm</label>
          </div>
        </div></td>
      <td>
      <button class="btn btn-primary" onClick = "sendData(${names})" ${payBy == 'cash' ? 'disabled' : payBy == 'paytm' ? 'disabled' : name == 'Spoiles' ? 'disabled' : ''}>save</button>
      </td>
      </tr>
      `
          text += tr
      }


    
    }
    let lasttr = `
  <tr>
          <td></td>
          <td ></td>
          <td ></td>
          <td style="text-align: center; font-size: larger;">Total :-</td>
          <td style=" font-size: larger;">${total}</td>
          <td></td>
          <td></td>
        </tr>`
    text += lasttr;
    $('#tBody').html(text)
  }
  
  $('#cr').click(function () {
  
    let result = searchData.filter((item) => {
      return item.payBy == 'credit';
    })
    itemPrint(result)
  })
  
  $('#cash').click(function () {
  
    let result = searchData.filter((item) => {
      return item.payBy == 'cash';
    })
    itemPrint(result)
  })
  
  $('#paytm').click(function () {
  
    let result = searchData.filter((item) => {
      return item.payBy == 'paytm';
    })
    itemPrint(result)
  })
  
  function sendData(id) {
    const paymentMethod = document.querySelector(`input[name="sno${id}"]:checked`).value;
  
    var date = new Date().toLocaleDateString();
    let sendData = {
      ...searchData[id],
      payBy: paymentMethod,
      datePay: date
    }
    $.post('/api/crRec', sendData)
    location.reload();
   }
  
  
  function ExportData() {
    filename = 'reports.xlsx';
    var ws = XLSX.utils.json_to_sheet(searchData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, filename);
  }  

