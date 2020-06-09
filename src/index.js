
function renderQuotes(){


    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(json => json.forEach(e => {
            const ul =  document.querySelector('#quote-list');
            const li = document.createElement('li');
            li.className = 'quote-card';
            li.setAttribute('data-id', e.id);
            li.innerHTML = `
            <blockquote class="blockquote">
            <p class="mb-0">${e.quote}</p>
            <footer class="blockquote-footer"> ${e.author}</blockquote>
            <br>
            <button class='btn-success'>Likes: <span>0</span></button>
            <button class='btn-danger'>Delete</button>
            </blockquote>`;
            ul.append(li);
        }));
    
    }

    renderQuotes()

    document.addEventListener('click', (e)=>{
        let targetName = e.target;   
        if (e.target.className === 'btn-success'){
        let quoteValue = parseInt(e.target.childNodes[1].innerText)
        let id = parseInt(e.target.parentNode.dataset.id);
        e.target.childNodes[1].innerText++
         fetch('http://localhost:3000/likes', {
         method: "POST",
        headers: {
         "Content-Type": "application/json",
        "Accept": "application/json" },
        body: JSON.stringify({quoteId:id, createdAt: Date.now()})
         });
        }
    });