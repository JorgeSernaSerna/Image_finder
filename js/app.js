const form = document.querySelector('#formulario');
const result = document.querySelector('#resultado');
const pagebuttonsDiv = document.querySelector('#paginacion');
const registersPerPage = 40;
let totalPages;
let iterator;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', ()=>{
    form.addEventListener('submit', validateFrom);
});
function validateFrom(e)
{
    e.preventDefault();
    const inputSearch = document.querySelector('#termino').value;
    if(inputSearch == '')
    {
        showAlert("You ain't wrote anything yet. Please type what you want to find.")
        return
    }
    searchForResults();
}
async function searchForResults()
{
    const termToSearch = document.querySelector('#termino').value;
    const key = '40777312-0444a9089f6e8365618a78d1e';
    const url = `https://pixabay.com/api/?key=${key}&q=${termToSearch}&per_page=${registersPerPage}&page=${currentPage}`
    fetch(url)
    .then(response => {
        return response.json()})
    .then(response => {
        totalPages = calculatePages(response.totalHits);
        return bringImages(response.hits)});
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        totalPages = calculatePages(result.totalHits);
        bringImages(result.hits);

    } catch (error) {
        console.log(error)
    }
}
//  Generator => registra numero de paginas generadas en cada busqueda
function *registerPages(totalPages)
{
    for(let i = 1; i <= totalPages; i++)
    {
        yield i;
    }
}
function calculatePages(totalRegisters)
{
    // redondea valor siempre hacia arriba 5.1 será 6
    return parseInt(Math.ceil(totalRegisters/registersPerPage))
}
function bringImages(results)
{
    while(result.firstChild)
    {
        result.removeChild(result.firstChild);
    }
    results.forEach(element => {
        const {webformatURL, likes, views, largeImageURL} = element;
        const divImage = document.createElement('div');
        divImage.classList.add('w-1/2', 'md:w-1/3', 'lg:w-1/4', 'p-3', 'mb-4')
        divImage.innerHTML += `
        <div class="bg-white">
            <img class="w-full" src="${webformatURL}">
            <div class="px-4 pt-4" style="display:flex">
                <p>
                    <span class="material-symbols-outlined">
                    thumb_up
                    </span>
                </p>
                <div class="w-5"></div>
                <p>${likes}</p>
            </div>
            <div div class="px-4 pb-4" style="display:flex">
                <p>
                    <span class="material-symbols-outlined">
                    visibility
                    </span>
                </p>
                <div class="w-5"></div>   
                <p>${views}</p> 
            </div>
            <div class="px-4 pb-4">
                <a class="block w-full border-solid border-2 border-blue-500 hover:bg-blue-500 text-center rounded font-bold p-2"
                href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                View Image
                </a>
            </div>
        </div>
            
        `
        result.appendChild(divImage);
    });
    while(pagebuttonsDiv.firstChild)
    {
        pagebuttonsDiv.removeChild(pagebuttonsDiv.firstChild);
    }
    printPages();
}
function printPages()
{
    iterator = registerPages(totalPages);
    while(true)
    {
        const {done, value} = iterator.next();
        if(done) return
        const button = document.createElement('button');
        button.href = '#';
        button.dataset.page = value;
        button.textContent = value;
        button.classList.add('next', 'bg-yellow-500', 'font-bold', 'mr-3', 'px-6', 'py-2', 'rounded', 'mb-4');
        button.onclick = ()=>{
            currentPage = value;
            searchForResults();
        }

        pagebuttonsDiv.appendChild(button);
    }
}
function showAlert(message)
{
    const existAlert = document.querySelector('.alrt');
    if(!existAlert)
    {
        const divAlert = document.createElement('div');
        divAlert.classList.add('alrt', 'bg-red-100', 'border-red-400', 'text-red-700', 'mx-auto', 'mb-10',
        'rounded', 'py-4', 'px-3', 'text-xl');
        divAlert.innerHTML = `<p styles="width:40%; text-align:center; margin:auto">${message}</p>`
        result.appendChild(divAlert);
        setTimeout(()=>{
            divAlert.remove();
        }, 3000);
    }
    
}