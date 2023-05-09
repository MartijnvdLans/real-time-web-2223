# RTW 

## About Who's That Pokémon

Who's that pokemon is a real-time-app created in Socket.io. The app is a chatroom where you and your friends can talk as well as guess pokémon names. Through the leaderboard, you can keep tabs on who's pokémon knowledge is the greatest!

## Live Demo

[https://rtw-real-time-chat.onrender.com/](https://rtw-real-time-chat.onrender.com/)

## 3 < 1 concept

For this course the idea was to think of (at least) 3 different app ideas these were my ideas!

### Tipsy Tales

<img src="./wiki-images/tipsyTales.png" WIDTH="100%">

My first idea was a game made for friends to play. Everyone gets a question they have to answer, once everyone has done this, 1 of the answers gets displated anonymously. Everyone has to guess who they think gave the answer. When everyone answers right, the person who answered it gets -1 point. Otherwise the people who answer wrong get -1 point. The first one who hits 0 drinks.

### Bussen

<img src="./wiki-images/bussen.png" WIDTH="100%">

The 2nd idea I had was inspired by a dutch drinking game. In essential you have to guess higher or lower than the previous card shown.

### Who's That Pokémon

<img src="./wiki-images/wtp.png" WIDTH="100%">

The last idea I had was a game inspired by an API I found. the pokémon API. Every episode of Pokémon asks 'Who's that pokémon' while showing a greyscaled picture of a pokémon. I wanted to try to recreate this by making it a real-time-app.

I really wanted to make Tipsy Tales but because I spent a long time looking for an API with random questions and didn't find any, I decided to try my luck with the Pokémon API.

## Install

Clone the repository to your local files with:

```
git clone https://rtw-real-time-chat.onrender.com/
```

Install the needed packages with:

```
npm install
```

run the applaction with:

```
npm start  
```

### Used Dependencies

* Express
* Node
* Nodemon
* Node-Fetch
* Socket.io

## Data Model

<img src="./wiki-images/data-model.png" WIDTH="100%">

## Real Time Events

### Connect

This is the main event from Socket. It check if there is a connection to socket.

### User Connect

This is an event that lets you know a new user has joined the server, cuasing the leaderboard to update and add them onto it.

### Message

This event gets triggered when a user sends a message into the chat. It send 1 message and shows it on all open clients.

### Answer

This event gets triggered when someone answers the name of a pokémon correctly.

### Random Pokémon

This event gets fired on 2 occaisions. Firstly when a new user joins so they can start playing with the group straight away and when someone answers the question correctly.

### Update Scoreboard

This event gets fired when someone answers the pokémon correctly. It updates the amount of points all users have.

### User Disconnect

this event gets fired when a user leaves the server, causing the server to reload the leaderboard deleting them.

## Data Life Cycle

<img src="./wiki-images/datalifecycle.png" WIDTH="100%">

## Lisence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)