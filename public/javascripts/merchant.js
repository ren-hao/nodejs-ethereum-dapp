$( document ).ready(function() {
    $("#addProduct").submit(function(e) {
        $("#addbtn").
        e.preventDefault();
        var formData = new FormData(document.getElementById("addProduct"));
        $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: formData,
            success: function(data) {
                alert("Add successfully.");
                $("#addProduct")[0].reset();
                $("#exampleModal").modal("hide");
                $(document).scrollTop($(document).height());
                location.reload();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText);
            },
            processData: false,
            contentType : false
        });
    });

    $(".deleteProduct").click(function() {
        var id = $(this).attr('id');
        $.ajax({
            type: "DELETE",
            url: "/api/products",
            data: {"id" : id},
            dataType: 'json',
            success: function(data) {
                $("#confirmModal").modal("hide");
                location.reload();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText);
            }
        });
        
    });

    $(".pass-product-id").click(function() {
        var id = $(this).data('id');
        $(".deleteProduct").attr("id", id);
    });
});