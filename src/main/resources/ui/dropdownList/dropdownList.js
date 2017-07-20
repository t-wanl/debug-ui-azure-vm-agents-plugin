function updateDropdownListView (e, url, config) {

    if (url == null) return;
    config = config || {};
    config = object(config);
    var originalOnSuccess = config.onSuccess;
    var l = $(e);
//    console.log("url = ", url);
//    console.log("updateDropdownListView e = ", e);
//    console.log("updateDropdownListView l = ", l);

    config.onSuccess = function (rsp) {
//        console.log("select children length from e = ", e.childNodes.length);
//        console.log("select children length from l = ", l.childNodes.length);
//        console.log("select children from l = ", l.childNodes);
//        console.log("success rsp = ", rsp);
        var selectedOption = rsp.responseText;

        for (i=0; i<l.childNodes.length; i++) {
            if (selectedOption == l.childNodes[i].value) {
                l.selectedIndex = i;
                break;
            }
        }
//        l.selectedIndex = ;
        if (originalOnSuccess!=undefined)
            originalOnSuccess(rsp);
        l.removeClassName("select-ajax-pending");
    };

    config.onFailure = function (rsp) {
//        console.log("failure rsp = ", rsp);
        l.removeClassName("select-ajax-pending");
    };

    l.addClassName("select-ajax-pending");
    new Ajax.Request(url, config);
}


Behaviour.specify("SELECT.dropdownList", 'select', 1, function(e) {
//    console.log("SELECT.dropdownList e = ", e);

    refillOnChange(e,function(params) {
//        console.log("params = ", params);
        updateDropdownListView(e,e.getAttribute("fillUrl"),{
            parameters: params,
            onSuccess: function() {
//                console.log("updateDropdownListView onSuccess");
                fireEvent(e,"change");
            }
        });
    });


});
