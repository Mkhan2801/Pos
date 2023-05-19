$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/api/tally",
    success: function (data) {
      let obj = {}
      for (let id in data) {
        let key = data[id]._id
        obj[data[id]._id] = data[id][key]
      }
      pageData = obj
      itemPrint(pageData)
      searchData = pageData
    }

  });


})





document.getElementById("searchQuery").disabled = true;

document.querySelector(".modal-btn").addEventListener("click", function () {
  document.querySelector(".modal-overlay").classList.add("open-modal")
})
document.querySelector(".close-btn")
  .addEventListener("click", function () {
    document.querySelector(".modal-overlay").classList.remove("open-modal")
  })


//page output const

const re = $('#re');
const reCash = $('#reCash');
const reCashd = $('#reCashd');
const rePaytm = $('#rePaytm');
const rePaytmd = $('#rePaytmd');

const exp = $('#exp');
const expCash = $('#expCash');
const expCashd = $('#expCashd');
const expPaytm = $('#expPaytm');
const expPaytmd = $('#expPaytmd');

const rem = $('#rem');
const remCash = $('#remCash');
const remPaytm = $('#remPaytm');

const op = $('#opBal');
const opCash = $('#opCash');
const opPaytm = $('#opPaytm');







$("#submit").click(() => {
  itemPrint(searchData)
})








function itemPrint(data) {
  remCash.text(data.cash)
  remPaytm.text(data.paytm)
  rem.text(data.cash + data.paytm)
  cal(data.cr.cash, expCash, expCashd)
  cal(data.cr.paytm, expPaytm, expPaytmd)
  cal(data.dr.cash, reCash, reCashd)
  cal(data.dr.paytm, rePaytm, rePaytmd)

  exp.text(Number(expCash.text()) + Number(expPaytm.text()))
  re.text(Number(reCash.text()) + Number(rePaytm.text()))

  let opC = Number(remCash.text()) - Number(reCash.text()) + Number(expCash.text())
  opCash.text(opC)

  let opP = Number(remPaytm.text()) - Number(rePaytm.text()) + Number(expPaytm.text())
  opPaytm.text(opP)

  op.text(opC + opP)
  $("#drTotal").text(Number(op.text()) + Number(re.text()))
  $("#crTotal").text(Number(exp.text()) + Number(rem.text()))

}


// calculate amount and print details
function cal(arr, out, dit) {
  let from = new Date($('#from').val()).toLocaleDateString()
  let to = new Date($('#to').val()).toLocaleDateString()
 
  let text = ''
  let output = []
  let amount = 0
  if (arr !== undefined) {
    for (const key of Object.keys(arr)) {

      const date =arr[key].date
      if (from < date && date <= to) {
        if (!output.find(o => o.name == arr[key].name && o.date == arr[key].date)) {

          let data = {
            name: arr[key].name,
            date: arr[key].date,
            amount: arr[key].amount
          }
          output.push(data);
        } else {
          for (const item of output) {
            if (item.name == arr[key].name && item.date == arr[key].date) {
              item.amount += arr[key].amount
            }
          }
        }
      }
    }
    for (const key of Object.keys(output)) {

      text += ` <li class="list-group-item d-flex justify-content-between lh-sm">
  <div>
    <h6 class="my-0">${output[key].date}</h6>
  </div>
  <span class="text-body-secondary">${output[key].name}</span>
  <span class="text-body-secondary">${output[key].amount}</span>
</li>`

      amount += output[key].amount
    }
  }

  out.text(amount)
  dit.html(text)
}





//to add money 
$('#save').click(() => {
  let name = $("#firstName").val()
  let paymentMethod = document.querySelector('input[name="payBy"]:checked').value;
  let amount = $("#amount").val()
  if (!name) {
    console.log('Add name')
  }
  else if (!amount) {
    console.log("Add amount")
  }
  else {
    let sendData = {

      name: name,
      date: new Date().toLocaleDateString(),
      payBy: paymentMethod,
      amount: amount
    }


    console.log(sendData)
    $.post('/api/tally', sendData)
    location.reload();
  }
})



const questions = document.querySelectorAll(".question");

questions.forEach(function (question) {
  const btn = question.querySelector(".question-btn");
  btn.addEventListener("click", function () {
    question.classList.toggle("show-text")
  })
})


