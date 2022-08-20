const button = document.getElementById('submit');
const toggle = document.querySelector('.hide');
const password = document.getElementById('password');
const confirmPwd = document.getElementById('confirm')


button.addEventListener('click',switchPage)
function switchPage(){
console.log('clicked')
}


toggle.addEventListener('click', function (){
    const type = password.getAttribute('type')
    if(type == 'password'){
        password.setAttribute('type','text')
        toggle.innerHTML = 'visibility'
    }else{
        password.setAttribute('type','password')
        toggle.innerHTML = 'visibility_off'
    } 
})

