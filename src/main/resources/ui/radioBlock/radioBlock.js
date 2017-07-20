// prototype object to be duplicated for each radio button group

var radioBlockSupport = {
    buttons : null, // set of functions, one for updating one radio block each

    updateButtons : function() {
        for( var i=0; i<this.buttons.length; i++ )
            this.buttons[i]();
    },

    // update one block based on the status of the given radio button
    updateSingleButton : function(radio, blockStart, blockEnd) {
//        console.log("updateSingleButton");
//        console.log("radio = ", radio);
//        console.log("blockStart = ", blockStart);
//        console.log("blockEnd = ", blockEnd);
        var show = radio.checked;
        if (radio.getAttribute("checked") == true && (radio.getAttribute("radioblock-inited") == undefined || radio.getAttribute("radioblock-inited") == "false")) {
            show = radio.getAttribute("checked");
            radio.setAttribute("radioblock-inited", "true");
        }

        if (show == false) {
            // find the end node
            var e = (function() {
                var e = blockStart;
                var cnt=1;
                while(cnt>0) {
                    e = $(e).next();
                    if (Element.hasClassName(e,"radio-block-start")) {
                        console.log("find end node e = ", e);
                        var eles = e.getElementsByClassName("radio-block-control");
                        console.log("ele", eles);
                        for(i = 0; i < eles.length; i++) {
                            eles[i].setAttribute("radioblock-inited", "true");
                        }
                        cnt++;
                    }
                    if (Element.hasClassName(e,"radio-block-end"))
                        cnt--;
                }
                return e;
            })();
        }

        blockStart = $(blockStart);
//        console.log("show = ", show);
        if (blockStart.getAttribute('hasHelp') == 'true') {
            n = blockStart.next();
        } else {
            n = blockStart;
        }
//        console.log("n = ", n);
        while((n = n.next()) != blockEnd) {
//            console.log("n = ", n);
            n.style.display = show ? "" : "none";
        }
//        console.log("layoutUpdateCallback", layoutUpdateCallback);
        layoutUpdateCallback.call();
    }
};

// this needs to happen before TR.row-set-end rule kicks in.
Behaviour.specify("INPUT.radio-block-control", 'radioBlock', -100, function(r) {

//        console.log("iota = ", iota);
//        console.log("r = ", r);
        r.id = "radio-block-"+(iota++);
//        console.log("r.id = ", r.id);
        // when one radio button is clicked, we need to update foldable block for
        // other radio buttons with the same name. To do this, group all the
        // radio buttons with the same name together and hang it under the form object
        var f = r.form;
        var radios = f.radios;
        if (radios == null)
            f.radios = radios = {};

        var g = radios[r.name];
//        console.log("g = ", g);
        if (g == null) {
            radios[r.name] = g = object(radioBlockSupport);
            g.buttons = [];
        }

        var s = findAncestorClass(r,"radio-block-start");
        s.setAttribute("ref", r.id);

        // find the end node
        var e = (function() {
            var e = s;
            var cnt=1;
            while(cnt>0) {
                e = $(e).next();
                if (Element.hasClassName(e,"radio-block-start"))
                    cnt++;
                if (Element.hasClassName(e,"radio-block-end"))
                    cnt--;
            }
            return e;
        })();

        var u = function() {
//            console.log("in u function, r = ", r);
//            console.log("in u function, s = ", s);
//            console.log("in u function, e = ", e);
            g.updateSingleButton(r,s,e);
        };
        g.buttons.push(u);

        // apply the initial visibility
        u();

        // install event handlers to update visibility.
        // needs to use onclick and onchange for Safari compatibility
        r.onclick = r.onchange = function() { g.updateButtons(); };
});
