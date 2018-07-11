(function ($) {
    $.widget("ui.peoplepicker", {

        // These options will be used as defaults
        options: {
            server: '',
        },
        
        // Set up the widget
        _create: function () {
      
            var $ctrl1 = $('<img/>').attr({ src: this.options.server + '/_layouts/images/blogabout96.PNG', id: this.element[0].id + 'people-icon', style: 'float: left;height: 35px;width: 32px;' }).addClass('ui-state-default');

            var $ctrl2 = $('<input/>').attr({ type: 'text', id: this.element[0].id + 'people', style: 'height:35px;font-size: large; width: 240px;' }).addClass('text ui-widget-content ui-corner-all');
            var $ctrl3 = $('<input/>').attr({ type: 'hidden', id: this.element[0].id + 'people-id' }).addClass("text");
            var $ctrl4 = $('<input/>').attr({ type: 'hidden', id: this.element[0].id + 'people-server' }).addClass("text");
        
            this.element.append($ctrl1);
            //this.element.append($ctrl1_1);
            this.element.append($ctrl2);
            this.element.append($ctrl3);
            this.element.append($ctrl4);
            $("#" + this.element[0].id + "people-server").val(this.options.server);
            $("#" + this.element[0].id + "people").autocomplete({
                source: function (request, response) {

                    jQuery.support.cors = true;
                    var queryXML =
                    "<QueryPacket xmlns='urn:Microsoft.Search.Query' Revision='1000'> \
                    <Query domain='QDomain'> \
                    <Properties>\
                        <Property name=\"userprofile_guid\" />\
                        <Property name=\"accountname\" /> \
                        <Property name=\"title\" /> \
                        <Property name=\"path\" /> \
                        <Property name=\"pictureurl\" /> \
                        <Property name=\"jobtitle\" /> \
                     </Properties>\
                     <SupportedFormats><Format>urn:Microsoft.Search.Response.Document.Document</Format></SupportedFormats> \
                     <Context> \
                      <QueryText language='en-US' type='STRING' >*" + request.term + "* SCOPE:\"People\"</QueryText> \
                     </Context> \
                    </Query></QueryPacket>";

                    var soapEnv =
                  "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'> \
                  <soap:Body> \
                    <Query xmlns='urn:Microsoft.Search'> \
                      <queryXml>" + queryXML.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</queryXml> \
                    </Query> \
                  </soap:Body> \
                </soap:Envelope>";
                    //alert("#" + this.element[0].parentElement.id + "people-server");
                    //debugger;
                    $.ajax({
                        url: $("#" + this.element[0].parentElement.id + "people-server").val() + "/_vti_bin/search.asmx",
                        type: "POST",
                        dataType: "xml",
                        data: soapEnv,
                        async: false,
                        contentType: "text/xml; charset=\"utf-8\"",
                        complete: processSearch
                    });



                    function processSearch(xData, status) {
                        // alert(this.element[0].parentElement.id);
                        //alert($(xData.responseXML).text());
                        var jsonObj = [];
                        $(xData.responseXML).find("QueryResult").each(function () {

                            var title = "";
                            var pictureurl = "";
                            var accountname = "";
                            var jobtitle = "";
                            var userprofile_guid = "";
                            var x = $("" + $(this).text() + "");
                            x.find("Document").each(function () {

                                $(this).find("Property").each(function () {

                                    if ($(this).find("Name").text() == "title") {
                                        title = $(this).find("Value").text();

                                    }
                                    if ($(this).find("Name").text() == "pictureurl") {
                                        pictureurl = $(this).find("Value").text();
                                    }
                                    if ($(this).find("Name").text() == "accountname") {
                                        accountname = $(this).find("Value").text();
                                    }
                                    if ($(this).find("Name").text() == "jobtitle") {
                                        jobtitle = $(this).find("Value").text();
                                    }
                                    if ($(this).find("Name").text() == "userprofile_guid") {
                                        userprofile_guid = $(this).find("Value").text();
                                    }
                                });
                                jsonObj.push({ label: title, value: accountname, icon: pictureurl, jobtitle: jobtitle });
                            });
                            response(jsonObj, function (item) {

                                return {
                                    label: item.label,
                                    value: item.value,
                                    icon: item.pictureurl,
                                    jobtitle: item.userprofile_guid
                                }
                            });
                        });
                    }







                }
        , minLength: 2
        , select: function (event, ui) {
   
            
            $("#" + this.parentElement.id + "people").val(ui.item.label);
            $("#" + this.parentElement.id + "people-icon").attr("src", ui.item.icon);
            $("#" + this.parentElement.id + "people-icon").attr("title", ui.item.jobtitle);
            $("#" + this.parentElement.id + "people-id").val(ui.item.value);
            $("#" + this.parentElement.id).val(ui.item.value);

            return false;
        }
            });
        },

        // Use the _setOption method to respond to changes to options
        _setOption: function (key, value) {

            switch (key) {
                case "clear":

                    // handle changes to clear option
                    break;
                case "showimage":

                    break;
            }

            // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
            // In jQuery UI 1.9 and above, you use the _super method instead
            this._super("_setOption", key, value);
        },

        // Use the destroy method to clean up any modifications your widget has made to the DOM
        destroy: function () {
            // In jQuery UI 1.8, you must invoke the destroy method from the base widget
            $.Widget.prototype.destroy.call(this);
            // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
        }
    });
} (jQuery));