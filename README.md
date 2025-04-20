# Easy Learn
## Inspiration
People have busy lives and do not always have time to educate themselves. We needed a fast platform to help keep ourselves more broadly educated easily and flexibly. We also wanted to give people with less reading comprehension skills more educational resources.

## What it does
Easy Learn uses Letta AI as a research assistant. You type in the topic you want to discuss, and the program will generate a ready lesson plan. After interacting with the chatbot, you can take a quiz to assess your progress and make improvements. You can also voice chat with Easy Learn, and it will speak to the user with the generated output from Letta AI.

## How we built it
We built our backend using the Flask Framework in Python to connect to MongoDB.
The frontend was written in React.
The voice model is with Eleven Labs.

## Challenges we ran into
We encountered several challenges.
The main problem was linking the various components, such as the text-to-speech, the MongoDB, many React components, and the AI compatibility. These pieces had different interfaces and ways of exchanging state, and we struggled to figure out how each of these parts talked to one another.

The second challenge was sleep deprivation. We stayed up all night working, constantly making mistakes and getting set back because we couldn't concentrate. Twenty-four hours was a real time crunch for us to build all of these components together

A third challenge was organization. We did not have a virtual environment like a Docker container, costing us time exchanging API keys and setting libraries.

## Accomplishments that we're proud of
We built each component standalone: the MongoDB, the text-to-speech, the React frontend, and the Flask backend. We all sharpened our web development and teamwork skills, putting our limited knowledge to the test.  

## What we learned
This experience taught us tons. We learned more about how React works on the frontend, how to use API keys and manage environment variables, how to hook a database like MongoDB to the Flask backend, and how to set up routes between the three pieces of our program. We saw how frustrating it was to have different software versions and not have all the necessary libraries installed and ready to go out of the box. One system's backend server worked while the other one kept crashing. 

## What's next for Easy Learn
We want to address the challenges in our project, including fully linking all aspects together, dockerizing our project to ensure everyone has the same environment, and utilizing better coding practices. 
