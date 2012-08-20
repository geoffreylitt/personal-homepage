---
kind: project
title: Sendquest.in
live: true
link: http://sendquest.in
priority: 2
tools: "Ruby on Rails, Javascript, Twilio API"
image_path: images/sendquest.png
---

Sendquest.in is a live polling service that allows a group to vote on a question over SMS, with the results appearing in real time on a graph. Built in 24 hours for the Yale Hackathon 2012, and won second place.

##Tech Stack
The site uses the Twilio API to interface with users over SMS, and some custom JS -- the available libraries weren't pretty enough :) -- to update graphs in realtime. Deployed on Heroku.

##Collaboration
Built with <a href="http://seth.fm" target="_blank">Seth Thompson</a>. I wrote the backend.