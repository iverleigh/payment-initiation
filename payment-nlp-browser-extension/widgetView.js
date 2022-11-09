function createPaymentContent(amount, accountA, accountB) { 
    var myString = `
    <div id = "container">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--12-col">
                <!-- Amount: ${amount} -->

                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="amount" value="${amount}">
                    <label class="mdl-textfield__label" for="amount">AMOUNT</label>
                </div>
            </div>
        </div>

        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--12-col">
                <!-- Account A: ${accountA} -->

                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="accountA" value="${accountA}">
                    <label class="mdl-textfield__label" for="accountA">ACCOUNT A</label>
                </div>
            </div>
        </div>

        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--12-col">
                <!-- Account B: ${accountB} -->

                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="accountB" value="${accountB}">
                    <label class="mdl-textfield__label" for="accountB">ACCOUNT B</label>
                </div>
            </div>
        </div>

        <div class="mdl-grid" class="button-container">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect">
                SUBMIT
            </button>
        </div>
    </div>
    `

    return myString;
}