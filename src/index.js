document.addEventListener("DOMContentLoaded", () => {

    const quoteUl = document.getElementById('quote-list')
    const newQuoteForm = document.getElementById("new-quote-form")

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes))

    function renderQuotes(quotes){ 
        quotes.forEach(quote => renderQuote(quote))
    }

    function renderQuote(quote){ 
        let numOfLikes

        if (quote.likes){
            numOfLikes = quote.likes.length
        } else {
            numOfLikes = 0
        }
       
       console.log(numOfLikes) 

       quoteLi = document.createElement('li')
       quoteLi.className = "quote-card"
       quoteLi.dataset.quoteId = quote.id
       quoteLi.innerHTML = `
       <blockquote class="blockquote">
       <p class="mb-0">${quote.quote}</p>
       <footer class="blockquote-footer">${quote.author}</footer>
       <br>
       <button class='btn-success'>Likes: <span>
        ${numOfLikes}</span></button>
       <button class='btn-danger'>Delete</button>
     </blockquote>
       `
       quoteUl.append(quoteLi)
    }// end of renderQuote function 

   document.addEventListener('click', e => {
       e.preventDefault()

        if (e.target.className === "btn btn-primary") {
            createQuote()
        }//end if

        if (e.target.className === "btn-danger") {
            const liId = e.target.parentNode.parentNode.dataset.quoteId
            console.log(liId)
            fetch(`http://localhost:3000/quotes/${liId}`,{
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            })//end of fetch

            e.target.parentNode.parentNode.remove()
            //this removes the li from the page
        }//end if

        if (e.target.className === "btn-success"){
            const liId = e.target.parentNode.parentNode.dataset.quoteId
            const newLike = {
                quoteId: parseInt(liId)
            }
            fetch('http://localhost:3000/likes', {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(newLike)
        })
        .then(resp => resp.json())
        .then(like => console.log(like))
            
            let innerText = e.target.innerText.split(" ")
            let likesNum = parseInt(innerText[1])
            likesNum++
            e.target.innerText = `Likes: ${likesNum}`

        }//end if
        
    })

    function createQuote() {
        newQuoteObject = {
            quote: newQuoteForm.quote.value,
            author: newQuoteForm.author.value
        }
        fetch('http://localhost:3000/quotes', {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(newQuoteObject)
        })//end of fetch POST 
        .then(resp => resp.json())
        .then(newQuote => {
            console.log(newQuote)
            renderQuote(newQuote)
        })
    }//end getform function



})//end of DOMLoaded 