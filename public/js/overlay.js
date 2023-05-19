

    
document.querySelector(".modal-btn").addEventListener("click" , function(){
    document.querySelector(".modal-overlay").classList.add("open-modal")
  })
  document.querySelector(".close-btn")
  .addEventListener("click" , function(){
    document.querySelector(".modal-overlay").classList.remove("open-modal")
  })
  
  
  
  
  
  
  $('#addItem').click(()=>{
  
  
      let iname = $(`#iname${Number(itemList.length) + 1}`).val()
      let iprice = $(`#iprice${Number(itemList.length) + 1}`).val()
      let iqty = $(`#iqty${Number(itemList.length) + 1}`).val()
      if(!iname){
          console.log("Add name")
      }
      else if(!iprice){
          console.log("Add price")
      }
      else if(!iqty){
          console.log("Add qty")
      }
      else{
          itemList.push({
              name:iname,
              price : iprice,
              qty : iqty
          })
          apendText (itemList)
      
      }
  
      
  
  })
  
  function apendText (arr){
      let text
      let total = 0
  for (Sno in arr){
      let sub = Number(arr[Sno].qty) * Number(arr[Sno].price) 
      text +=  `<tr>
  <td>${Number(Sno)+1}</td>
  <td><input type="text" class="form-control" id="iname${Number(Sno)+1}" value ="${arr[Sno].name}" disable></td>
  <td style="text-align: right; font-size: larger;" >Rs: </td>
  <td><input type="number" class="form-control" id="iprice${Number(Sno)+1}" value="${arr[Sno].price}"></td>
  <td><input type="number" class="form-control" id="iqty${Number(Sno)+1}" value="${arr[Sno].qty}"></td>
  
  <td class="text-danger" id="isub${Number(Sno)+1}" value="">${sub}</td>
  </tr>
  `
  total += sub
  }
  
  let appendText =`<tr>
  <td>${Number(arr.length)+1}</td>
  <td><input type="text" class="form-control" id="iname${Number(arr.length)+1}"></td>
  <td style="text-align: right; font-size: larger;" >Rs: </td>
  <td><input type="number" class="form-control" id="iprice${Number(arr.length)+1}"></td>
  <td><input type="number" class="form-control" id="iqty${Number(arr.length)+1}"></td>
  
  <td class="text-danger" id="isub${Number(arr.length)+1}"></td>
  </tr>
  <tr>
  <td></td>
  <td></td>
  <td style="text-align: center; font-size: larger;">Total :-</td>
  <td style=" font-size: larger;">${total}</td>
  <td></td>
  </tr>
  ` 
  $('#bill').html(text)
  $('#bill').append(appendText)
  
  }




