
$( document ).ready(function() {
    $("#addProduct").submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            success: function(data) {
                alert("Add successfully.");
                $("#addProduct")[0].reset();
                $("#exampleModal").modal("hide");
                location.reload();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText);
            }
        });
    });
});