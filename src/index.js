document.addEventListener("DOMContentLoaded", () => {

    //Render quotes
    const quoteUl = document.getElementById("quote-list")

    function fetchQuotes(sort = false) {
        if (sort) {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp => resp.json())
        .then(json => renderQuotes(json, sort))}
        else {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp => resp.json())
        .then(json => renderQuotes(json))}
        }

    function sortByAuthor(x,y) {
        return ((x.author == y.author) ? 0 : ((x.author > y.author) ? 1 : -1 ))
    }

    function renderQuotes(quotes, sort = false) {
        if (sort) {
            quotes.sort(sortByAuthor).forEach(quote => renderQuote(quote))
        }
        else {
            quotes.forEach(quote => renderQuote(quote))
        }
    }

    function renderQuote(quote) {
        const quoteLi = document.createElement("li")
        quoteLi.className = "quote-card"
        quoteLi.dataset.id = quote.id
        quoteLi.innerHTML = `<blockquote class="blockquote"> 
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
            </blockquote>`
        quoteUl.append(quoteLi)
    }

    fetchQuotes()

    //Create a new quote and append it to the DOM using pessimistic rendering
    const form = document.getElementById("new-quote-form")

    document.addEventListener("submit", (e) => {
        e.preventDefault();

        if (e.target === form) {
            const text = e.target.quote.value
            const author = e.target.author.value
            const quote = {
                quote: text,
                author: author,
                likes: []
            }

            fetch("http://localhost:3000/quotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(quote)
            })
            .then(resp => resp.json())
            .then(json => renderQuote(json))
        }  
    })

    //Delete quote and remove it from the DOM using pessimistic rendering
    document.addEventListener("click", (e) => {
        const quoteLi = e.target.parentNode.parentNode
        const id = quoteLi.dataset.id
        
        if (e.target.textContent === "Delete") {
            fetch(`http://localhost:3000/quotes/${id}`, {
                method: "DELETE"
            })
            .then(quoteLi.remove())
        }

        else if (e.target.className === "btn-success") {
            const span = e.target.querySelector("span")
            let likes = parseInt(span.textContent)
            
            const configObj = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quoteId: parseInt(id),
                    createdAt: Date.now()
                })
            }

            fetch("http://localhost:3000/likes", configObj)
            .then(likes++)
            .then(span.textContent = likes)
        }
    })

    //Sort alphabetically
    const div = document.querySelector("div")
    const sortButton = document.createElement("button")
    sortButton.textContent = "Sort: Off"
    sortButton.dataset.status = "off"
    div.prepend(sortButton)

    document.addEventListener("click", (e) => {
        if (e.target === sortButton) {
            if (e.target.dataset.status === "off") {
                sortButton.dataset.status = "on"
                sortButton.textContent = "Sort: On!"
                const sort = true
                removeQuotes()
                fetchQuotes(sort)
            }

            else if (e.target.dataset.status === "on") {
                sortButton.textContent = "Sort: Off"
                sortButton.dataset.status = "off"
                removeQuotes()
                fetchQuotes()
            }
        }
    })

    function removeQuotes(){
        quoteUl.innerHTML = ``
    }

})