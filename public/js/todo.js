$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/api/todo",
    success: function (data) {
      
      pageData = data
      itemPrint(pageData)
   
   searchData = pageData
    }
   
  });

})

let pageData 
let searchData



  function itemPrint(list){
    let text =''
    
    for (let names in list){



      let name = list[names].name
      let date = list[names].date
      let doneDate = list[names].doneDate
      let done = list[names].done === 'true'
      let remark= list[names].remark
  
  let tr =  `<tr class="${done ? '':'bg-danger'} ">
    <td>${Number(names) + 1}</td>
    <td>${date}</td>
    <td>${name}</td>
    <td>
    <button id="${names}" class="btn btn-primary" ${done ? 'disabled':''} onclick="done(${names})" >Done</button>
    </td>
    <td>${doneDate}</td>
    <td>${remark}</td>
    
  </tr>
  `
  text += tr
  }
        $('#tBody').html(text)
  }

$("#addTask").click(()=>{
    let task = $('#task').val();
    let remark = $('#remark').val();

    if(!task){
        console.log("Add task")
    } else {
        let sendData = 
            {
                name : task,
                date :new Date().toLocaleDateString(),
                doneDate:'',
                done : false,
                remark : remark
            }
            $.post('/api/todo',sendData)
            location.reload();
          }
})


function done(id){
  let remark = searchData[id].remark
    if($('#remark').val()){remark = $('#remark').val();}

let sendData = {
    name: searchData[id].name,
    date: searchData[id].date ,
      doneDate: new Date().toLocaleDateString(),
       done: true,
        remark: remark
} 
    console.log(sendData)
    $.post('/api/todo',sendData)
    location.reload();

}


function ExportData()
{
        filename='reports.xlsx';
    var ws = XLSX.utils.json_to_sheet(searchData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb,filename);
 }


