import React, { useEffect, useContext, useState } from 'react'
import Sticky from 'react-stickynode';
import Nav from './components/nav'
import './app.scss'
// import socketClient from "socket.io-client";
// const SERVER = "http://localhost:5000";
import { socket } from './context/socket';
const App = () => {
  let username = ''

  // Run when the UI has loaded
  useEffect(() => {
    // Get Dom Elements
    const chat = document.getElementById('chat-submit')
    const chatEnter = document.getElementById('chat_enter')
    const changeusername = document.getElementById('username-submit')
    const Input = document.getElementById('chat-input')
    const chatwindow = document.getElementById('chat-window')
    const userList = document.getElementById('user-list')


    // ------------------------------------------------ Sending chat message
    const sendMessage = (event) => {
      socket.emit('chat', Input.value, (ack) => {
        username = ack.username;
      })
      console.log(Input.value)
      Input.value = ''
    }
    // Send chat if enter was pressed
    Input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage()
      }
    });

    // ------------------------------------------------ Display list of users
    const usersList = (usernames) => {
      userList.innerHTML = `<h2 class='has-text-white is-size-3'> Connected Users </h2> <hr/>`
      usernames.forEach(element => {
        if (element === username) {
          userList.innerHTML += `<p class='has-text-white'> ≪${element}≫ </p>`

        } else {
          userList.innerHTML += `<p class='has-text-grey-light'> ${element} </p>`
        }

      });
    }

    chat.addEventListener('click', sendMessage)
    chatEnter.addEventListener('click', sendMessage)

    // ------------------------------------------------- Change username
    changeusername.addEventListener('click', event => {
      event.preventDefault();
      if (Input.value !== '' || Input.value !== null) {
        socket.emit('change username', Input.value, (ack) => {
          if (ack.status === 'ok') {
            username = ack.username
            Input.value = ''
          }
          else {
            alert('failed to change username')
          }
        })
      } else {
        alert('Please fill out form')
      }

    })
    // ------------------------------------------------- Display name changes
    socket.on('your username', message => {
      username = message;
    })
    // ------------------------------------------------- Display name changes
    socket.on('change username report', (message, users) => {
      let usersArray = JSON.parse(users);
      usersList(usersArray);
      chatwindow.innerHTML += `
          <div class="is-flex is-align-content-center is-justify-content-center my-1">
          <div class="is-align-center">
            <p>From Server: ${message} </p>
          </div>
        </div>`
    })
    // ------------------------------------------------- TEll users of new connections
    socket.on('connection to chat', (username, users) => {
      let usersArray = JSON.parse(users);
      usersList(usersArray);
      chatwindow.innerHTML += `
      <div class="is-flex is-align-content-center is-justify-content-center my-1">
      <div class="is-align-center">
        <p>From Server: ${username} Connected </p>
      </div>
    </div>`
    })
    // ------------------------------------------------- TEll users of disconnections
    socket.on('disconnection from chat', (username, users) => {
      let usersArray = JSON.parse(users);
      usersList(usersArray);
      chatwindow.innerHTML += `
          <div class="is-flex is-align-content-center is-justify-content-center my-1">
          <div class="is-align-center">
            <p>From Server: ${username} disconnected </p>
          </div>
        </div>`
    })
    // ------------------------------------------------- Display chat message
    socket.on('chat', (msg, user) => {
      console.log(user)
      console.log(username)
      if (username === user) {
        chatwindow.innerHTML += `
        <div class="is-flex is-align-content-flex-end is-justify-content-flex-end my-1">
          <div class="is-align-content-end box">
            <p>From Me: ${msg} </p>
          </div>
        </div>
        `
      } else {
        chatwindow.innerHTML += `
        <div class="is-flex is-align-content-flex-start is-justify-content-flex-start my-1">
        <div class="is-align-content-start box has-background-info">
          <p class="has-text-white">From ${user}: ${msg} </p>
        </div>
      </div>`

      }
    });

  },

    [])
  //In my school we had hardly any tech related courses but I found a lot of joy in creating things with programming so I taught 
  return (
    <div id="container full-height">
      <Nav />
      <div className='my-3 full-height' id="chatSection">
        <div class="columns is-centered full-height is-mobile mb-6">
          <div class="column has-background-info is-hidden-touch is-one-quarter">

          </div>
          <div class="column mx-4 mb-6">
            <div class="container is-fullhd mb-6" id="chat-window">
              {/*OUR CHAT WILL POPULATE  */}
            </div>
          </div>

          <div class="column is-one-quarter has-background-info ">
            <Sticky>
              <div className="mx-6 site-content content-window" id="user-list"></div>
            </Sticky>
          </div>
        </div>

        {/* ---------------------Chat footer------------------------------- */}
        <div className='footer1'>
          <div className="field is-horizontal  mt-4 ">
            <div className="field-label is-normal">
              <label className="label">Enter message</label>
            </div>
            <div className="field-body">
              <div className="field  has-addons">
                <div className="control">
                  <input className="input" type="text" placeholder="Enter your message here" id='chat-input' />
                  <input type="submit" className='hidden-button' id='chat_enter' />
                </div>
                <div className="control">
                  <input className='button is-info' type="submit " id="chat-submit" value="enter" />
                  <input className='button' type="submit" id="username-submit" value="change Username" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
