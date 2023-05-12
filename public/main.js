let socket = io();
const chatMain = document.querySelector('#chatbox')
const loginMain = document.querySelector('#loginRoom')
const joinedUser = document.querySelector('#online-users')
const userCount = document.querySelector('#user-count')
const chatUl = document.querySelector('.main-ul')
const urlParams = new URLSearchParams(window.location.search) // create a URLSearchParams that searches for parameters in the searchbar
const username = urlParams.get('username') // get the username parameter
const createImage = document.createElement('img')
const pokImgCont = document.querySelector('.pokeBox')

socket.emit('user connected', username) // send the server socket the username of the client that has joined

if (chatMain) { // Makes sure if you're on the right HTML page so consts wont conflict.
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

      // Check wether someone is typing and send it to the server
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
        
        if (msg.username === username) { // Check is the one sending it is the same as ur client name
            messageLine.textContent = `${msg.username}: ` + msg.message
            messageLine.classList.add('me')            
        } else {
            messageLine.textContent = `${msg.username}: ` + msg.message
            messageLine.classList.add('other')       
        }
        chatUl.appendChild(messageLine)
        messages.scrollTop = messages.scrollHeight
      });


      // Someone is typing. This code shows the client who is typing
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
            if (users.username !== null) {
                joinedUser.innerHTML = ""
            

                let userAmount = Object.getOwnPropertyNames(users).length // Get list lenght to see how many users are online
            
            console.log(users)
            
            if (userAmount == 1) {
                userCount.innerHTML = `${userAmount} person online`
            } else {
                userCount.innerHTML = `${userAmount} people online`
            }

            Object.values(users).forEach((user)=>{ // Creates a list item for every person on the the website
                let userItem = document.createElement('li')
                
                userItem.textContent = user.username + `: ${user.points}`

                if (user.username === username) {
                    userItem.classList.add('joinedUser')
                }

                joinedUser.appendChild(userItem)
              })
            }
        })

        socket.on("user-connected", (results) => {
          // Fetches a new pokémon everytime someone new joins the server so that everyone can play along right away
            createImage.src = results.sprites.other.dream_world.front_default
            createImage.alt = "pokemon image" 
            pokImgCont.appendChild(createImage)
          });

          socket.on("random-pokemon", results => {
            createImage.src = ""
        
            createImage.src = results.sprites.other.dream_world.front_default
            createImage.alt = "pokemon image" 
            pokImgCont.appendChild(createImage)
        })
          

          socket.on("good-guess", msg => {
            let messageLine = document.createElement('li')
            
            messageLine.textContent = `${msg.username} guessed the pokémon! They get 1 point rewarded to them!`
            chatUl.appendChild(messageLine)
            messageLine.classList.add('correct-banner')
            messages.scrollTop = messages.scrollHeight
            // getNewPokemon()
          })

        //   function getNewPokemon() {
        //     setTimeout(function () {
        //       socket.emit("new-pokemon");
        //     }, 200);
        //   }

          socket.on('update-scoreBoard', users => {
            joinedUser.innerHTML = ""

            Object.values(users).forEach((user)=>{
                let userItem = document.createElement('li')
                
                userItem.textContent = user.username + `: ${user.points}`

                if (user.username === username) {
                    userItem.classList.add('joinedUser')
                }

                joinedUser.appendChild(userItem)
              })
          }) 


}

if (loginMain) { // Makes sure if you're on the right HTML page so consts wont conflict.
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