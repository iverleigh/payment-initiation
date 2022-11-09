InboxSDK.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');

InboxSDK.load(2, 'sdk_payment-nlp_0e9250b655').then(function(sdk){
    // your app code using 'sdk' goes in here

    sdk.Compose.registerComposeViewHandler(function(composeView){
        composeView.on('recipientsChanged', function(event) {
          console.log('Recipients have changed to: ' + event);
        });

        var composeContent;

        composeView.on('bodyChanged', function(event) {
            console.log('bodyChanged');

            let htmlContent = composeView.getHTMLContent();
            console.log(htmlContent);

            let textContent = composeView.getTextContent();
            console.log("text content: " + textContent);
            console.log("text content length: " + textContent.length);

            if(!!composeContent) {
                console.log("compose content: " + composeContent);
                console.log("compose content length: " + composeContent.length);
            }

            if(textContent == composeContent) // PREVENT THE INFINITE LOOP
                return;

            composeContent = textContent;

            let messageBody = $("div[aria-label='Message Body']");

            let words = textContent.match(/\S+/g) || [];
            console.log(words);

            words.forEach(element => {
                let targetWord = element;
                highlightElement(targetWord, messageBody[0], "purple");
            });
            

        });
    
        composeView.on('destroy', function(event) {
          console.log('compose view going away, time to clean up');
        });
      });
  });

