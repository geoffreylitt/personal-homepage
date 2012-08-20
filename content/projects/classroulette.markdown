---
kind: project
title: Yale Classroulette
live: true
link: http://yaleclassroulette.com
priority: 1
tools: "Javascript, Ruby/Sinatra"
image_path: images/classroulette.png
---

Classroulette is a simple online interface to explore the Yale course catalog. It's designed to mimic the experience of flipping through a physical coursebook and help students find random courses.

##Tech Stack
The frontend uses the jQuery Isotope layout plugin with some custom sorting logic. The backend is a light Sinatra app serving course info scraped from the Yale site. Deployed on Heroku.