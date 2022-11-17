# Clikr

## Overview
Clikr is a Google Chrome extension that aids users in navigating the web. On one side, contributors (technologically-savvy individuals) opt in to have the tool collect data their site navigation and input data so that common user click sequences and inputs are stored in a database. On the other, users (those who have difficulty navigating the web) choose a keyword relating to their site needs. This keyword is mapped to web elements and navigates the user to their desired site page automatically by outputting a common click sequence relating to the keyword.
Watch a demo of our application [here](https://www.youtube.com/watch?v=dv0IQs9yk1E)!
## Functionality
We successfully developed an automated clickthrough function that retrieves both IDs and InnerHTML elements to ensure a linked item could always be clicked despite HTML differences in webpages. Additionally, we developed a "learning" mode that teaches users how to navigate the web with ease by pinpointing where users need to click to find a specific feature or needed information with visual tooltips. The extension interfaces with a MongoDB database via a custom-built REST API.
## Future Work
We would like to further improve the “learning” mode for Clikr by developing a text-to-speech API that would narrate instructions to users for even greater ease of use. Furthermore, rather than pulling keywords directly from HTML elements, we would use Natural Language Processing techniques to analyze what user action a sequence may fall under based on common keywords to better accommodate to users and their needs.

![Guided Navigation](/images/guided_navigation.jpg)
![Tooltip](/images/tooltip.jpg)
