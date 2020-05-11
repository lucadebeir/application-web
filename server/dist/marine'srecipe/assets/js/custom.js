$(function() {

    // Mark list item complete
    $(document).on("click", ".check", function(e) {
        e.preventDefault();
        $(this).closest("li").toggleClass("complete");
    });
});