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