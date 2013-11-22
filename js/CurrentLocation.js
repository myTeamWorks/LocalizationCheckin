//Entry point of plugin -> method is configured on the plugin.xml file
function GetCurrentPosition() {

    //get reference to the post container and clean it
    var container = getPostDataContainer();
    $(container).html('');

    //create the map object
    var map = new Microsoft.Maps.Map($(container)[0], { 
        credentials: 'BING MAPS KEY',
        width: 600,
        height: 250
    });

    map.entities.clear();
    var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);
    geoLocationProvider.getCurrentPosition({
        successCallback: function (object) {
            //map has obtained the coordinates

            //store coordinates on the AttachedContent variable
            AttachedContent = object.center;
            //Store the type on the AttachedContentType variable
            AttachedContentType = 'Location Checkin';
            
            //Lool for the post Type inside the PluginDictionary and 
            //store it on the AttachedPostTye variable
            AttachedPostType = PluginDictionary['Location Checkin'];
        }
    });
}



//method called after the wall is loaded. 
//Receives all additional content for the loaded posts


function DisplayLocationForPost(additionalContent) {
    
    //get reference to the post type for the current plugin
    var postType = PluginDictionary['Location Checkin'];
    

    //go through all the additional content entries
    $.each(additionalContent, function (index, content) {
        
        //check if additional content belongs to the current plugin
        if (content.PostType == postType) {
            
            //get reference to the specific post on the DOM, using the postID
            var container = $("#" + content.PostId).find(".post-text");
            
            //create a container for the map after the post text
            $(container).after('<div id="aditional-content-' + content.PostId + '"></div>');
            
            //parse the content to obtain the coordinates stored before
            var coordinates = JSON.parse(content.Content);
            
            //create the map object
            var postMap = new Microsoft.Maps.Map(document.getElementById('aditional-content-' + content.PostId),
			{
			    width: 700,
			    height: 250,
			    credentials: 'BING MAPS KEY',
			    center: new Microsoft.Maps.Location(coordinates.latitude, co-ordinates.longitude),
			    mapTypeId: Microsoft.Maps.MapTypeId.birdseye,
			    zoom: 18
			});
            
            //add a pushpin to the center of the map
            var pushpin = new Microsoft.Maps.Pushpin(postMap.getCenter(), null);
            postMap.entities.push(pushpin);
        } 
    });
}

//add the previous method to the collection of methods 
//reponsible for processing adittional data forEach posts
AddAdditionalContentWallCallback(DisplayLocationForPost);

