InboxSDK.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');

InboxSDK.load(2, 'sdk_payment-nlp_0e9250b655').then(function(sdk){
    // your app code using 'sdk' goes in here
    $( document ).ready(function() {
        sdk.Conversations.registerMessageViewHandler(function(messageView){
    
            messageView.on('load', function(event) {
                // console.log('message view loaded');
    
                // let targetWord = "you";
    
                // let elements = $("div[data-message-id]");
    
                // if(!!elements && !!elements.array) {
                //     elements.array.forEach(element => {
                //         // console.log("calling highlighter loop array");
                //         highlightElement(targetWord, element, "rgb(149, 183, 237)");
    
                //         //openPaymentWidget();
                //     });
                // }
    
                // else if(!!elements && !!elements[0]) {
                //     // console.log("calling highlighter individual element");
                //     highlightElement(targetWord, elements[0], "rgb(149, 183, 237)");
    
                //     //openPaymentWidget();
                // }
            });
        
            messageView.on('destroy', function(event) {
                // console.log('message view going away, time to clean up');
            });
        });


        sdk.Conversations.registerThreadViewHandler(threadView => {
            const el = document.createElement("div");
            el.innerHTML = 'Hello world!';
    
            threadView.addSidebarContentPanel({
                title: 'Sidebar Example',
                el: el,
                iconUrl: "https://ci5.googleusercontent.com/proxy/FQhGIUcBML3N2vjtotwLisLrXT4zHG2i0RG-FekcaDCxFpzNPefPZVxXsmZ_N9iuCTk-eztTm6zjXV0D09mxG7A1R9fLhj_FID5mbDbOkuOFAJ_Xig=s48"
            });
        });
    });
});