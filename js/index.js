//https://api.github.com/search/repositories?q=${'redux'}&per_page=5
(function () {
    const url = 'https://api.github.com/search/repositories?q=';

    const listRepo = document.querySelector('.list');
    const helpsList = document.querySelector('.autocomplete-list');
    const input = document.querySelector('.search');

    let repoData = [];

    async function getData(name) {
        const searchName = name.trim()
        if (searchName) {
            try {
                const data = await fetch(`${url}${searchName}&per_page=5`)
                const response = await data.json();
                repoData = response.items
                autocomplete(repoData);
            } catch (err) {
                throw new Error(err)
            }
        } else {
            document.querySelector('.autocomplete-list').innerHTML = '';
        }
    };

    function renderListRepo(item) {
        listRepo.innerHTML += `<li id='${item.id}' class='list__item'>
            <p>Name: ${item.name}</p>
            <p>Owner: ${item.owner.login}</p>
            <p>Stars: ${item.stargazers_count}</p>
            <button class='btn-close' type='button'></button>
        </li>`;
        document.querySelector('.search').value = '';
        helpsList.innerHTML = '';
    };

    function autocomplete(data) {
        let template = '';
        data.forEach(el => {
            template += `<li class='autocomplete-list__item'>${el.name}</li>`
        });
        helpsList.innerHTML = template;
    };

    const debounce = (fn, inputValue, debounceTime) => {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(inputValue.value)
            }, debounceTime)
        }
    };

    input.addEventListener('input', debounce(getData, input, 1000));

    helpsList.addEventListener('click', ({ target }) => {
        const itemName = target.textContent;
        const itemObj = repoData.filter(item => {
            return item.name === itemName
        });
        renderListRepo(itemObj[0])
    });

    listRepo.addEventListener('click', (e) => {
        const listItem = listRepo.querySelectorAll('.list__item');
        if (e.target.classList.contains('btn-close')) {
            listItem.forEach(el => {
                if (el.id === e.target.parentNode.id) {
                    el.remove()
                }
            })
        }
    });

}())

