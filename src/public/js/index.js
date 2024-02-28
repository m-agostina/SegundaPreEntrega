let socket = io()

socket.on('message-all', (data)=>{
    console.log(data)
    render(data)
    let chat = document.getElementById('caja')
    chat.scrollTop = chat.scrollHeight
})

const render = (data) =>{
    const html = data.map(e => {
        return(
            `<div>
                <strong>${e.author}</strong>
                <em>${e.message}</em>
            </div>`
        )
    }).join('')
    document.getElementById('caja').innerHTML = html

}

// Manejar el evento submit del formulario
document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault()
    addMessage()
})

const addMessage = () =>{
    const msg = {
        user: document.getElementById('name').value,
        message: document.getElementById('text').value
    }
    socket.emit('new-message', msg)
    return false
}
