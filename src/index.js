document.addEventListener('DOMContentLoaded', function(e){
    const quoteWithLikes = "http://localhost:3000/quotes?_embed=likes"
    const baseUrl = "http://localhost:3000/quotes"
    const fetchData = () => {
        fetch(quoteWithLikes)
        .then(resp => resp.json())
        .then(json => {renderQuotes(json)})
    }
    const renderQuotes = quotes => {
        quotes.forEach(quote => {
            renderQuote(quote)
        })
    }
    const renderQuote = quote => {
        quote.likes = quote.likes || {}
        quote.likes.length = quote.likes.length || 0
        const quoteUl = document.getElementById('quote-list')
        const quoteLi = document.createElement('li')
        quoteLi.className = 'quote-card'
        quoteLi.id = quote.id
        quoteLi.innerHTML = `
        <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
        `
        quoteUl.appendChild(quoteLi)
    }
    // * find form
    // * collect form info into quote object
    // * post object to database
    // * pessimistically render quote withoru refresh
    const quoteForm = document.getElementById('new-quote-form')
    quoteForm.addEventListener('submit', function(e){
        e.preventDefault()
        const newQuote = document.getElementById('new-quote').value
        const newAuthor = document.getElementById('author').value
        const quoteObj = {
            quote: newQuote,
            author: newAuthor
        }
        const configObj = {
            method: "POST", 
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(quoteObj)
        }
        fetch(baseUrl, configObj)
        .then(resp => resp.json())
        .then(json =>  {renderQuote(json)})
        document.getElementById('new-quote').value = ''
        document.getElementById('author').value = ''
    })
    // * click on delete button
    // * delete form via delete request
    // * removes without having to refresh the page
    document.addEventListener('click', function(e){
        if(e.target.className === 'btn-danger'){
            const quoteParent = e.target.parentNode.parentNode
            const number = quoteParent.id
            fetch(`${baseUrl}/${number}`, {
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then(json => quoteParent.remove())
        } else if(e.target.className === 'btn-success') {
            const quoteParent = e.target.parentNode.parentNode
            const likesNumber = e.target.innerText.split(" ")[1]
            let likes = parseInt(likesNumber)
            const number = parseInt(quoteParent.id)
            fetch("http://localhost:3000/likes", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({quoteId: number})
            }) 
            .then(resp => resp.json())
            .then(json => {
                likes = likes + 1
                e.target.innerText = `Likes: ${likes}`
            })
        }
    })
    // * click on like button 
    // * POSt to update it 
    // * timestamp if possible
    fetchData()
})