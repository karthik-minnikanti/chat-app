const socket = io()
const $messageForm = document.querySelector('#msgform')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#message')

//Templates
const messageTemplate = document.querySelector('#template').innerHTML
const locationTemplate = document.querySelector('#locationtemplate').innerHTML
socket.on('msg', (message) => {


    const html = Mustache.render(messageTemplate,{
        message
    })
    $messages.insertAdjacentHTML('beforeend',html)
    //$messages.insertAdjacentElement('beforeend',html)
})

socket.on('location', (location) => {
    const html = Mustache.render(locationTemplate,{
        location
    })
    console.log('location:', location)
    $messages.insertAdjacentHTML('beforeend',html)
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = document.querySelector('input').value
    socket.emit('msg', msg, (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('msg was delivered')
    })
}
)
$locationButton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert(" Your browser is not supported ")
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('location', position.coords.latitude, position.coords.longitude, () => {
            $locationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})