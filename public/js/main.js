document.querySelector('#clickMe').addEventListener('click', makeReq)

async function makeReq(){

  const playerNumber = document.querySelector("#playerNumber").value;

  try{
    const response = await fetch(`https://war-ii.onrender.com/api/${playerNumber}`)
    const data = await response.json()

    console.log(data)
    document.querySelector("#winningPlayer").textContent = data.result
  }catch(error){
      console.log(error)
  }
}