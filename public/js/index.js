$(document).ready(function () {

  const search = $("#search");




  //search from data
  search.click(function () {
    const searchQuery = document.querySelector("#searchQuery").value;
    searchData = pageData;
    let newItemList = [];
    if (searchQuery.length > 0) {
      pageData.find((o) => {
        if (o.name.toLowerCase().match(searchQuery.toLowerCase())) {
          newItemList.push(o)
        }
        searchData = newItemList;
      });
    }
    itemPrint(searchData)
  })
  
  
  
})



