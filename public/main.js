// Lets code some main.js file to toggle between lists

// document.querySelectorAll("ul .thisClass")[0].click(function()
// {
//     console.log("clicked");
// })

function toggleTable()
{
   if (document.querySelectorAll("ul .thisClass")[0].style.display == "table" ) {
      document.querySelectorAll("ul .thisClass")[0].style.display="none";

   } else {
    document.querySelectorAll("ul .thisClass")[0].style.display="table";
   }

}

console.log("something is better than nothing")