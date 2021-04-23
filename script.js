var availableCoins = [];
var toTrack = [];

var svg = `<svg id="delete_black_24dp" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
           <path id="Path_9" data-name="Path 9" d="M0,0H24V24H0Z" fill="none"/>
           <path id="Path_10" data-name="Path 10" d="M6,19a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V7H6ZM19,4H15.5l-1-1h-5l-1,1H5V6H19Z"/>
           </svg>`




fetch('http://localhost:3000/onStart')
.then(response => response.json())
.then(res => {
  toTrack = res.data;
  console.log(toTrack);
})


fetch('https://api.wazirx.com/api/v2/market-status')
.then(response=>response.json())
.then(data => {
  let market = data.markets;

  market.forEach(element => {
      if(!availableCoins.includes(element.baseMarket)){
        availableCoins.push(element.baseMarket);
      }
  });
console.log(availableCoins);

return availableCoins;
})
.then(data =>{
  let innerTemp = "";
  data.forEach(coin =>{

      innerTemp += `<div class="listItem" onclick="changeInput(this)">`+coin+"</div>";

  });

  document.getElementById("availableList").innerHTML = innerTemp;

})


const changeInput = (elm) =>{
  document.getElementById("inputBox").value = elm.innerHTML;
}

const del = (elm) =>{
  console.log("delete", elm.value);
  let i = toTrack.indexOf(elm.value);
  toTrack.splice(i,1);


  fetch('http://localhost:3000/delete',{
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({data:elm.value})
  })
  .then(response =>response.json())
  .then(data=>{
    console.log(data.message);
  })

}

document.getElementById("inputBox").addEventListener('keyup',(e)=>{
  let filterlist = [];
  let inpval = document.getElementById("inputBox").value.toLowerCase();

  console.log(inpval);


  if(inpval !== ""){
    availableCoins.forEach(coin =>{
      if(coin.startsWith(inpval)){
        filterlist.push(coin);
      }
    })

    let innerTemp = "";
    filterlist.forEach(coin =>{
        innerTemp += `<div class="listItem" onclick="changeInput(this)">`+coin+"</div>";
    });
  document.getElementById("availableList").innerHTML = innerTemp;
  }
  else if(inpval ===""){
    let innerTemp = "";
    availableCoins.forEach(coin =>{
  
        innerTemp += `<div class="listItem" onclick="changeInput(this)">`+coin+"</div>";
  
    });
    document.getElementById("availableList").innerHTML = innerTemp;
  }
  console.log("filter:",filterlist);
})



document.getElementById("addCoin").addEventListener('click',()=>{
  let inpval = document.getElementById("inputBox").value.toLowerCase();
  if(inpval){

    if(availableCoins.includes(inpval)){
      if(!toTrack.includes(inpval)){
        toTrack.push(inpval)


        fetch('http://localhost:3000/addToTrack',{
          method:'POST',
          headers:{
            'Content-type':'application/json'
          },
          body:JSON.stringify({data:inpval})
        })
        .then(response =>response.json())
        .then(data=>{
          console.log(data.message);
        })



      }
      console.log("to track:",toTrack);
    }

  }
  document.getElementById("inputBox").value=""

  let innerTemp = "";
  availableCoins.forEach(coin =>{

      innerTemp += `<div class="listItem" onclick="changeInput(this)">`+coin+"</div>";

  });

  document.getElementById("availableList").innerHTML = innerTemp;


})



setInterval(()=>{

  fetch('https://api.wazirx.com/api/v2/market-status')
  .then(response=>response.json())
  .then(data=>{
    let marketArray = data.markets;
    let inner = ""


    if(toTrack.length>0){
      toTrack.forEach(coin =>{
        for(let i = 0;i<marketArray.length;i++){
          let element = marketArray[i];
          if(element.baseMarket == coin && element.quoteMarket == "inr"){
              console.log(element.last);
               inner += `<div class="coinCard"><b style="color: rgb(91, 91, 247)">`+element.baseMarket.toUpperCase()+"</b> : &#8377 "+element.last+`<button style="float: right" value= "${element.baseMarket}" onClick="del(this)" class="del">${svg}</button></div>`;
              break;
          }
        }
        
      });
    }
    else{
      inner = `<h3 style="color:skyblue;">no coins are being tracked!</h3>`;
    }

    document.getElementById("name").innerHTML = inner
  });

},4000);



const showAdd = () =>{
  document.getElementById("addPrompt").style.display = "flex";
}


const goBack = () =>{
  document.getElementById("addPrompt").style.display = "none";
}



