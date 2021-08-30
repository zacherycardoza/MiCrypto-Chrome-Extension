(function ($) {
    $(document).ready(function () {
        $("#settingsButton")
            .hover(
                function () {
                    $("#settingsIcon").attr("src", "../Resources/IMG/settingsHover.png"); },
                function () {
                    $("#settingsIcon").attr("src", "../Resources/IMG/settings.png"); }
                )
            .click(
                function () {
                    location.href="../Pages/popup.html"; }
                );        
    });
})(jQuery);

(function ($) {
    var supportedCryptoCurrencies = ["Ethereum", "Bitcoin", "Stellar", "Cardano"];
    $(document).ready(function () {
        supportedCryptoCurrencies.forEach(element => {
            if ( localStorage.getItem(element) == "active" ) {
                var _ = document.getElementsByName(element)[0];
                $(_).addClass("active");
            }
        });
    });
})(jQuery);

(function ($) {
    $(document).ready(function () {
        $(".supportedCurrencyContainer").click(function () {
            if ( $(this).hasClass("active") ) {
                $(this).removeClass("active");
                localStorage.setItem($(this).attr("name"), "inactive");
            }
            else {
                $(this).addClass("active");
                localStorage.setItem($(this).attr("name"), "active");
            }
        });
    });
})(jQuery);