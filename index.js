const login = document.querySelector('#login');
const register = document.querySelector('#register');
const logout = document.querySelector('#logout');
const repository = document.querySelector('#repository');
const history = document.querySelector('#history');

window.addEventListener('load', () => {
    fetch('https://retocambasoft.herokuapp.com/api/lenguages')
        .then(res => res.json())
        .then(data => {
            const { lenguages } = data.payload;
            lenguages.map(e => {
                const select = document.querySelector('#lenguages');
                const repoLen = document.querySelector('#repoLeng');
                const history = document.querySelector('#historyType');
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                const option3 = document.createElement('option');
                const text1 = document.createTextNode(e.lenguage);
                const text2 = document.createTextNode(e.lenguage);
                const text3 = document.createTextNode(e.lenguage);
                option1.setAttribute('value', e.id);
                option2.setAttribute('value', e.id);
                option3.setAttribute('value', e.id);
                option1.appendChild(text1);
                option2.appendChild(text2);
                option3.appendChild(text3);
                repoLen.appendChild(option1);
                select.appendChild(option2);
                history.appendChild(option3);
            })
        })
})



/*LOGIN*/
const response = document.querySelector('#response');
const formLoginUser = document.querySelector('#form_loginUser');
formLoginUser.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formLoginUser);
    const data = {
        email: formData.get('email'),
        pass: formData.get('pass')
    }
    fetch('https://retocambasoft.herokuapp.com/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', }
    }).then(res => res.json())
        .then(data => {
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            const { token, id } = data.payload.user;
            response.textContent = JSON.stringify(data, null, 2);
            localStorage.setItem('Authorization', token);
            localStorage.setItem('uid', id);
            console.log(localStorage.getItem('uid'))
            if (localStorage.getItem('uid') === "1") {
                showElements([
                    history
                ]);
            }
            hideElements([
                login,
                register
            ]);
            showElements([
                logout,
                repository
            ]);
        })
})

/*REGISTER*/
const formRegisterUser = document.querySelector('#form_registerUser');
formRegisterUser.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formRegisterUser);
    
     const data = {
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        email: formData.get('emailRegister'),
        birthday: formData.get('birthday'),
        lenguage_id: formData.get('lenguages'),
        pass: formData.get('passRegister')
    }

    fetch('https://retocambasoft.herokuapp.com/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            const { token, id } = data.payload;
            response.textContent = JSON.stringify(data, null, 2);
            localStorage.setItem('Authorization', token);
            localStorage.setItem('uid', id);
            hideElements([
                login,
                register
            ]);
            showElements([
                logout,
                repository,
                history
            ])
        }) 
})

/*LOGOUT*/
const formLogout = document.querySelector('#form_logout');
formLogout.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.removeItem('Authorization');
    localStorage.removeItem('uid');
    location.reload();
})

/*REPO*/
//GET
const btnRepos = document.querySelector('#ver_repos');
btnRepos.addEventListener('click', () => {
    const id = localStorage.getItem('uid');
    fetch(`https://retocambasoft.herokuapp.com/api/repo/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            response.textContent = JSON.stringify(data, null, 2);
        })
})
//ADD
const formRepository = document.querySelector('#form_repo');
formRepository.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formRepository);
    const data = {
        repo_name: formData.get('repoName'),
        repo_description: formData.get('repoDesc'),
        repo_creation: timestamp(),
        lenguage_id: formData.get('repoLeng'),
        user_id: localStorage.getItem('uid')
    }   

    fetch(`https://retocambasoft.herokuapp.com/api/repo/add`,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', }
    })
        .then(res => res.json())
        .then(data => {
            const repoName = document.querySelector('#repoName');
            const repoDesc = document.querySelector('#repoDesc');
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            response.textContent = JSON.stringify(data, null, 2);
            repoName.value = '';
            repoDesc.value = '';
        })
})

//DELETE
const formRepoDelete = document.querySelector('#form_repoDelete');
formRepoDelete.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formRepoDelete);
    const data = {
        id: formData.get('idRepo')
    }
    fetch(`https://retocambasoft.herokuapp.com/api/repo/${data.id}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(data => {
            const repoDel = document.querySelector('#idRepo');
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            response.textContent = JSON.stringify(data, null, 2);
            repoDel.value = '';
        })
})


/*LENGUAGES*/
const btnLenguages = document.querySelector('#ver_lenguages');
btnLenguages.addEventListener('click', () => {
    fetch(`https://retocambasoft.herokuapp.com/api/lenguages`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            response.textContent = JSON.stringify(data, null, 2);
        })
})


/*HISTORY*/
const btnHistory = document.querySelector('#ver_historial');
btnHistory.addEventListener('click', () => {
    fetch(`https://retocambasoft.herokuapp.com/api/history`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('Authorization')}`}
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.status === 'Error') return response.textContent = JSON.stringify(data, null, 2);
            response.textContent = JSON.stringify(data, null, 2);
        })
})

/*FUNCTIONS*/
function hideElements(el) {
    const element = el
    if (localStorage.getItem('Authorization')) {
        element.map(e => e.classList.add('is-hidden'));
    }
}

function showElements(el) {
    const element = el
    if (localStorage.getItem('Authorization')) {
        element.map(e => e.classList.remove('is-hidden'));
    }
}

function timestamp() {
    const dateTime = new Date();
    const date = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1 < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1}-${dateTime.getDate()}`;
    return date;
}