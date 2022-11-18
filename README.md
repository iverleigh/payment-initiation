# payment-initiation
Natural Language Processing model implemented through a Google Chrome browser extension that extracts required data from unstructured text and submits a request to a banking API for a payment transfer. <br>
<strong>Check out our published articles of this Proof-of-Concept <a href="https://medium.com/finastra-fintechs-devs/a-practical-proof-of-concept-using-natural-language-processing-to-parse-unstructured-text-62fa94852708">here</a> and one of the ways we deployed the model <a href="https://medium.com/finastra-fintechs-devs/deploying-a-machine-learning-model-using-a-flask-application-api-9b851a2e7866">here</a>!<br></strong><br>
<i>Project Contributors: Adam Lieberman & I worked on the ML, and Pierre Quemard & Josh Abelman worked on the development side.</i>

- Run payment-nlp-flask
    1. create conda environment from the environment.yml file
    2. activate the new environment
    3. enter directory and run "python app.py"
    4. if errors occur and the console output suggests downloading new nltk modules,
        run python in terminal and enter these commands one by one:

            import nltk
            <suggested command from console output>

        - you might need to do this multiple times
    


- run payment-nlp-browser-extension
    1. open chrome and navigate to the menu
    2. choose "More tools" then choose "Extensions"
    3. in the extensions page, click "Load unpacked"
    4. then choose the "payment-nlp-browser-extension" folder
        - you should now see a finastra logo in the extensions bar next to the address bar
    5. navigate to gmail
    6. try composing an email
    7. you should also see a finastra logo inside of the compose window
        - this will open the sidebar

---Notes
    1. sidebar payment submission is not functional yet; however, that will change when I add new endpoints to the flask application
    2. the extension expects the flask application to be accessible on port 5000,
        if something goes wrong there and flask uses a different port, this should be changed in 
        utilities.js within the browser extension folder on line 70.
