var composeContent;
var wordCount = 0;
var currentCaretPosition = 0;
var trueCaretPosition = 0;
var caretData = null;
var globalComposeView = null;
var globalMoleView = null;
var predictionStack = [];
var latestContentChange = Math.floor(Date.now() / 1000);

var accountA = null;
var accountB = null;
var amount = null;

InboxSDK.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');

InboxSDK.load(2, 'sdk_payment-nlp_0e9250b655').then(function(sdk){
    // your app code using 'sdk' goes in here
    $( document ).ready(function() {
    
        sdk.Compose.registerComposeViewHandler(function(composeView){
            globalComposeView = composeView;

            console.log("icon url: " + chrome.extension.getURL('finastra-icon.png'));
            composeView.addButton({
                title: 'test',
                // iconUrl: chrome.extension.getURL('finastra-icon.png'),
                onClick: handleComposeButtonClick,
                iconUrl: "https://ci5.googleusercontent.com/proxy/FQhGIUcBML3N2vjtotwLisLrXT4zHG2i0RG-FekcaDCxFpzNPefPZVxXsmZ_N9iuCTk-eztTm6zjXV0D09mxG7A1R9fLhj_FID5mbDbOkuOFAJ_Xig=s48"
            });

            composeView.on('bodyChanged', function(event) {
                console.log('bodyChanged');
                var el = $("div[aria-label='Message Body']");
                var element = el[0];

                let textContent = composeView.getTextContent();
    
                // let newCaretData = getCaretData(element, currentCaretPosition);

                // if(!!newCaretData.node)
                //     setCaretPosition(newCaretData);

                if(textContent == composeContent) // PREVENT THE INFINITE LOOP
                    return;


                if(!!textContent && !!composeContent)
                {
                    let diffPosition = findFirstDiffPos(textContent, composeContent);
                    currentCaretPosition = (diffPosition >= 0 ? diffPosition : currentCaretPosition) + 1;
                }
                    
                composeContent = textContent;

                let currentTimestamp = Math.floor(Date.now() / 1000);
                latestContentChange = currentTimestamp; 
                         
                checkAndMakePrediction(composeView, textContent);
            });
        
            composeView.on('destroy', function(event) {
                // console.log('compose view going away, time to clean up');
                currentCaretPosition = 0;
                caretData = null;

                globalComposeView = null;
            });

            setInterval(function() {
                if(predictionStack.length == 0)
                    return;

                let currentTimestamp = Math.floor(Date.now() / 1000);
                let timeDifference = currentTimestamp - latestContentChange;
                console.log("TIME DIFFERENCE: " + timeDifference);
                
                let textContent = composeView.getTextContent();
                let words = textContent.match(/\S+/g) || [];

                if(timeDifference > 2 && words.length > 1)
                {
                    processPrediction(composeView, textContent);
                }
            }, 500);
        });
    });

    function handleComposeButtonClick(event) {
        // globalMoleView = sdk.Widgets.showMoleView(
        //     {
        //         title: 'Test Mole',
        //         el: createElementFromHTML(`<div>tessssst</div`),
        //         chrome: true
        //     }
        // );

        let htmlString = createPaymentContent(
            !!latestPrediction.amount ? latestPrediction.amount : "Not Found",
            !!latestPrediction.accountA ? latestPrediction.accountA : "Not Found",
            !!latestPrediction.accountB ? latestPrediction.accountB : "Not Found");

        try {
            sdk.Widgets.showDrawerView(
                {
                    title: 'Finastra Payment',
                    el: createElementFromHTML(htmlString),
                    chrome: true,
                    composeView: globalComposeView,
                    closeWithCompose: true
                }
            );
        }
        catch {
            sdk.Widgets.showDrawerView(
                {
                    title: 'Finastra Payment',
                    el: createElementFromHTML(htmlString),
                    chrome: true,
                }
            );
        }

        mdlTest();     
    }
});


function mdlTest() {    
    let grids = document.getElementsByClassName("mdl-grid");
    let textFields = document.getElementsByClassName("mdl-textfield");
    let buttons = document.getElementsByClassName("mdl-button");

    Array.from(grids).forEach((element) => {
        componentHandler.upgradeElement(element);
    });
    Array.from(textFields).forEach((element) => {
        componentHandler.upgradeElement(element);
    });
    Array.from(buttons).forEach((element) => {
        componentHandler.upgradeElement(element);
    })
}

function checkAndMakePrediction(composeView, textContent) {
    let whitespace = textContent.substring(textContent.trim().length, textContent.length);

    let words = textContent.match(/\S+/g) || [];
    
    console.log("CHECK TO PREDICT");

    if(wordCount != words.length || predictionStack.length == 0) {
        console.log("MAKE PREDICTION FOR: " + textContent);
        makePrediction(composeView, textContent);
    }
}

function processPrediction(composeView, textContent) {
    console.log("PROCESS PREDICTION");

    var el = $("div[aria-label='Message Body']");
    var element = el[0];

    prediction = predictionStack[predictionStack.length - 1];
    
    updateComposeWindow(composeView, textContent, prediction);

    let newCaretData = getCaretData(element, currentCaretPosition);

    if(!!newCaretData.node)
        setCaretPosition(newCaretData);

    latestPrediction = prediction;
    predictionStack = [];
}


function updateComposeWindow(composeView, textContent, prediction) {
    console.log("UPDATE COMPOSE WINDOW");
    
    let whitespace = textContent.substring(textContent.trim().length, textContent.length);

    let words = textContent.match(/\S+/g) || [];

    wordCount = words.length;

    console.log(words);

    let newContent = "";
    for(i = 0; i < words.length; i++) {
        let current = words[i];
        let optionalSpace = true;

        if(i == 0)
            optionalSpace = false;
        
        let createdElement = null;
        if(!!prediction.accountA && current.includes(prediction.accountA))
            createdElement = createHighlightedElement(current, "rgb(149, 183, 237)");
        else if(!!prediction.accountB && current.includes(prediction.accountB))
            createdElement = createHighlightedElement(current, "rgb(245, 247, 150)");
        else if(!!prediction.amount && current.includes(prediction.amount))
            createdElement = createHighlightedElement(current, "rgb(158, 247, 159)");
        else
            createdElement = createHighlightedElement(current, null);

        newContent = newContent + (optionalSpace ? " " : "") + createdElement;
    }

    newContent = newContent + whitespace;

    composeView.setBodyHTML(newContent);
    //openPaymentWidget();
}