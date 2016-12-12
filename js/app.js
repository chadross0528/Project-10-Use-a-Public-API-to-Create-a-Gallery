  var searchLimit = 12; 
  var itemArray = [];
  var currItem;
  var defaultAPI= "spotify";



  $(document).ready(function() {

    //Form submit event handling
    initSubmitForm();

    //Init buttons functions
    initButtons();

  });

  function initSubmitForm()
  {
      $("#search-container").submit(function(event){
      
      //Prevents form from submitting
      event.preventDefault();
      
      //Captures the artist name, disables the form and runs the search
      var itemToSearch = $("#search").val();

      //Start the search from API
      itemSearchFromAPI(itemToSearch, searchLimit);
    });
  }


  //Initialize the onclick for buttons
  function initButtons() {

      $(".details").click(function(e){
        if (e.target.id == 'details') {
            hideDetails();
        } 
      });

      $(".prev").click(function(){
        var prev = currItem.prev();
        if (prev.length> 0) {
          updateDetialsforItem(prev);
        }
      });


      $(".next").click(function(){
        var next = currItem.next();
        if (next.length> 0) {
           updateDetialsforItem(next);
        }
      });

  }


  //Send an Ajax request to Spotify API and retrives the albums information
  function itemSearchFromAPI(itemToSearch, limit) {

    var url;
    var data;
    $(".sort").show();

    $(".sort-name").css("background", "#3399ff");
    $(".sort-date").css("background", "#3399ff");

    disableForm();

    if (defaultAPI) {
        url = "https://api.spotify.com/v1/search";
        data = {
          "q" : itemToSearch,
          "type" : "album",
          "limit" : limit
        };

        $.getJSON(url, data).done(function(response){
          itemArray = [];

          //Add all the data to the item Array
          $.each(response.albums.items, function(index, item){
            var albumItem = {
              "id" : item.id,
              "name" : item.name,
              "href" : item.href,
              "thumbnail" : item.images[0].url
            };

            itemArray.push(albumItem);
          });
          
          //Get the details from the API for each item in the array
          retrieveDetailsForItems();

          //Update the page with the dynamic content received from the API
          setTimeout(updatePageWithData, 3000, itemArray);
          
          
        });
    } 
  }

  //Update the page with the data retrived from the Spotify API
  function updatePageWithData(currArr) {


    var newHTML;
    var thumbnail;
    var href;

    $("#lightgallery").empty();

    //Iterate Through each item
    $.each(currArr, function(index, item){
      if(defaultAPI){
          //Build the HTML to append
          var id = item.id;
          var name = item.name;
          href = item.href;
          thumbnail = item.thumbnail;

          newHTML = '<a data-index="' + index + '" data-album-name="' + currArr[index].details.name + '" data-album-artist="' + currArr[index].details.artists[0].name + '" data-release-date="' + currArr[index].details.release_date + '" data-image="' + currArr[index].details.images[0].url + '"><img src="' + thumbnail + '" alt="' + name + '"/></a>';
      }


      //Append the HTML to the page
      $("#lightgallery").append(newHTML);

      $(".thumbnail").css("max-width", "200px");
      $(".thumbnail").css("max-height", "200px");

    });

      //Create onclick event for each item on the page
      appendEventForItems();

      //Enable the form when updating the gallery is finished
      enableForm();
  }


  //Retrieve the details for each album in the array
  function retrieveDetailsForItems() {
    $.each(itemArray, function(index, item){
      var url = item.href;
      $.getJSON(url)
        .done(function(response){
          itemArray[index].details = response;
        });
    });
  }


  //Append an onclick event for each item in the page
  function appendEventForItems(currArr) {
    $(".gallery").children().click(function() {
      $(".details").show();
      updateDetialsforItem(this);
    });
  }


  //Hide the details  lightbox
  function hideDetails(){
    $(".details").hide();
  }

  //Disable Form
  function disableForm(){
    $("#search").val("searching for your tune now...");
    $("#search-btn").prop("disabled", true);  
    $("#search-btn").css("background", "#cdcdcd");
    $("#search-btn").css("border", "2px solid #cdcdcd");
  }

  //Enable Form
  function enableForm(){
    $("#search").val("");
    $("#search-btn").prop("disabled", false);
    $("#search-btn").css("background", "#000");
  }


   function trackHTML(track) {
      var output;
      output  = '<tr><td>';
      output += track.track_number + '. ' + track.name;
      output += '</td></tr>';
      return output;
    }


  //Set the details of each item according to the data attribute received from the server
  function updateDetialsforItem(item) {
     var tracksArray = [];
     currItem = $(item);
     var date;
     var parts;
     var year;

      if (defaultAPI){
         var name=$(item).data("album-name");
         var image=$(item).data("image");
         date=$(item).data("release-date");
         var artist=$(item).data("album-artist");
         var index=$(item).data("index");
         
         parts = date.split('-');
         year = parts[0];
         
        tracksArray = itemArray[index].details.tracks.items;

         
         $(".details-artist").html("<h1>"+artist+"</h1>");
         $(".details-image").html("<img src="+image+">");
         $(".details-name").html("<h3>"+name+"</h3>");
         $(".details-release").html("<span>"+year+"</span>");

          var tracksHTML = "<table>";

          for (var i = 0; i < tracksArray.length && i < 12; i++) {
            tracksHTML += trackHTML(tracksArray[i]);
          }

        tracksHTML += "</table>";

        $(".track-info").html(tracksHTML);
        
        var mq = window.matchMedia("(min-width: 980px)");

        if (mq.matches) {
        
          //Change CSS to match alnum from spotify
          $(".track-info").css("display", "block");
          $(".track-info").css("flex", "1 50%");
          $(".album-info").css("text-align", "left");
          $(".details-image").css("max-width", "90%");
          } else{
          $(".track-info").css("display", "none");
          $(".album-info").css("text-align", "center");
          $(".details-image").css("max-width", "100%");
        }
      }
  }




