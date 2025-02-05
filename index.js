const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const fetch = require('node-fetch');
const port = process.env.PORT || 3000;

// set templating engine
app.set('view engine', 'ejs');
//where the templates are stored
app.set('views', 'views');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

let users = {}
let usercount = 0

let sortedData

app.get('/', (req, res) => {
    res.render('index')
})

const randomPokemon = async () => {
  // Fetches a random pokémon from the first Generation (151 pokémon)
  let pokeNummer = Math.floor(Math.random() * 151);
  const endpoint = `https://pokeapi.co/api/v2/pokemon/`
  const url = `${endpoint}` + pokeNummer
  const pokeData = await fetchData(url)
  sortedData = pokeData
  return sortedData
}

async function fetchData(url){
  const apiData = await fetch(url)
      .then(response => response.json())
      // if the request fails the error message will be shown in the console
      .catch(err => console.log(err))
  // returns the fetched data
  return apiData
};

app.get('/chat', (req, res) => {
    res.render('chat')
})

io.on("connection", (socket) => {
  usercount++

  socket.on('new user', username => {
    io.emit('new user', username)
  })

    socket.on('user connected', username => {
        users[socket.id] = {
            username: username,
            points: 0,
            id: socket.id
        }
        randomPokemon()
        .then(results  => {
          io.emit("random-pokemon", results)
          io.emit("update-scoreBoard", users)
          // console.log(results.forms[0].name)
      })
        io.emit('new user', (users))
    })

  console.log("a user connected");

//   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));

  socket.on('typing', (data) => {
    // Check if someone if typing to broadcast this to the other users
    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })

  socket.on("message", msg => {
    io.emit("message", {
      username: msg.username,
      message: msg.message
    });

    // Changes string to lowercase to check if the name is correct
    if(msg.message.toLowerCase() === sortedData.forms[0].name) {
      console.log('antwoord is correct')
      io.emit("good-guess", {
        username: msg.username
      })
      
      console.log(users[socket.id])
      users[socket.id].points++
      console.log(users)
      randomPokemon()
        .then(results  => {
          io.emit("random-pokemon", results)
          io.emit("update-scoreBoard", users)
          // console.log(results.forms[0].name)
        })
}
  });

  socket.on('disconnect', username => {
    usercount--
    console.log(usercount)

    delete users[socket.id]

    io.emit('new user', (users))
})
})

http.listen(port, () => {
  console.log("listening on port ", port);
});