
let socket = io();
const chatMain = document.querySelector('#chatbox')
const loginMain = document.querySelector('#loginRoom')
const joinedUser = document.querySelector('#online-users')
const userCount = document.querySelector('#user-count')
const chatUl = document.querySelector('.main-ul')
const urlParams = new URLSearchParams(window.location.search) // create a URLSearchParams that searches for parameters in the searchbar
const username = urlParams.get('username') // get the username parameter
console.log('username')

socket.emit('user connected', username) // send the server socket the username of the client that has joined

if (chatMain) {
    let messages = document.querySelector('section section:nth-of-type(3) ul')
    let input = document.querySelector('#message-input')

    document.querySelector('#chatroom').addEventListener('submit', event => {
        event.preventDefault()
        if (input.value) {
            let message = input.value
          socket.emit('message', {
            username: username,
            message: message
          })
          input.value = ''
        }
      });

      document.querySelector('#chatroom').addEventListener('keypress', e => {
        if(e.which!=13) {
            typing = true
            socket.emit('typing', {typing:true, username: username})
            setTimeout(typingTimeout, 1500)
        } else {
            setTimeout(typingTimeout, 50)
            typingTimeout()
        }
    })

    socket.on('message', msg => {
        let messageLine = document.createElement('li')
        
        if (msg.username === username) {
            messageLine.textContent = `${msg.username}: ` + msg.message
            messageLine.classList.add('me')            
        } else {
            messageLine.textContent = `${msg.username}: ` + msg.message
            messageLine.classList.add('other')       
        }
        chatUl.appendChild(messageLine)
        messages.scrollTop = messages.scrollHeight
      });
      
      socket.on('display', (data)=>{
          if(data.typing==true)
          if (data.username === username) {
            document.querySelector('.typing').innerHTML = ""
          } else {
            document.querySelector('.typing').innerHTML = ` ${data.username} is aan het typen ...`
          }
          else
          document.querySelector('.typing').innerHTML = ""
        })

        socket.on('new user', users => {
            joinedUser.innerHTML = ""
            

            let userAmount = users.length

            if (userAmount == 1) {
                userCount.innerHTML = `${userAmount} person online`
            } else {
                userCount.innerHTML = `${userAmount} people online`
            }

            users.forEach(user => {
                let userItem = document.createElement('li')
                
                userItem.textContent = user.username + `: ${user.points}`

                if (user.username === username) {
                    userItem.classList.add('joinedUser')
                }

                joinedUser.appendChild(userItem)
            });
        })
}

if (loginMain) {
    let username = document.querySelector('#username')

document.querySelector('#name-form').addEventListener('submit', event => {
    if (username.value) {
        const username = username
        socket.emit('new user', username)
    }
})
}

function typingTimeout() {
    console.log('notyping')
    typing = false
    socket.emit('typing', {typing: false})
}