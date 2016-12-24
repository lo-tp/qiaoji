---
title: temp
tags:
---

### Features
------
1. ES6 Support
   Enjoy the juice of ES6 on both client and server side.
1. Hot Reloading Without Page Refreshing
   Hot reload not only the traditional React components but also the stateless ones on the fly.
1. Minimum
   No redundant dependencies.


### Quick Start
------
1. Clone this repo using `git clone --depth=1 https://github.com/mxstbr/react-boilerplate.git`
1. Run `npm install` to install dependencies.
1. Run `npm run webpack-dev-server` to start the webpack dev server.
1. Visit `http://localhost:3200/`.
1. Change `Hello World` in client/greeting.js to other thing you want.
1. Watch the page change without reloading.

### Run Backend
------
1. Run `npm run webpack-server` to build server side code.
1. Run `npm run webpack-client` to build client side code.
1. Run `npm run nodemon` start server.
1. Visit `http://localhost:3000/`.
1. Now changes can only take effect when you refresh the page.

Actually it's better to write a separate webpack file to compile the client side js for production purpose.
