$(document).ready(function() {

// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyDosvtDIVtVcw0oBDaP6i2n2AY6vcR9gRY",
  authDomain: "metroschedule-ff586.firebaseapp.com",
  databaseURL: "https://metroschedule-ff586.firebaseio.com",
  projectId: "metroschedule-ff586",
  storageBucket: "",
  messagingSenderId: "737625116451",
  appId: "1:737625116451:web:376ca2ce457e8184"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

var metroData = firebase.database();

// Shows user the current time
$("#currentTime").append(moment().format("HH:mm"));

    // Collect Metro Input and Variables
    $("#submitInput").on("click", function (event) {
    event.preventDefault();
    // console.log("this works");
    
    var metrolineInput = $("#metroLine-input")
      .val()
      .trim();
    var destinationInput = $("#dest-input")
      .val()
      .trim();
    var metrotimeInput = $("#metrotime-input")
      .val()
      .trim();
    var frequencyInput = $("#freqmin-input")
      .val()
      .trim();

    // Creates local temporary
      var newMetro = {
        line: metrolineInput,
        destination: destinationInput,
        metroTime: metrotimeInput,
        frequency: frequencyInput,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      };

      // Code for the push
      metroData.ref().push({
      newMetro
    });
});

// Adds to Firebase database and a row in the html when a user adds an entry
metroData.ref().on("child_added", function(childSnapshot) {
 // console.log(childSnapshot.val().newMetro.line);

  // Store everything into a variable.
  var metrolineInput = childSnapshot.val().newMetro.line;
  var destinationInput = childSnapshot.val().newMetro.destination;
  var metrotimeInput = childSnapshot.val().newMetro.metroTime;
  var frequencyInput = childSnapshot.val().newMetro.frequency;
  // console.log(metrolineInput);

  // Calculate the minutes until arrival
  var tRemainder = moment().diff(moment.unix(metrotimeInput), "minutes") % frequencyInput;
  var Minutes = frequencyInput - tRemainder;

  // Add the Minutes to the currrent time
  var Arrival = moment().add(Minutes, "m").format("HH:mm");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(metrolineInput),
    $("<td>").text(destinationInput),
    $("<td>").text(frequencyInput),
    $("<td>").text(Arrival),
    $("<td>").text(Minutes)
  );
  // console.log(newRow)

  // Append the new row to the table
  $("#inputMetroTable").append(newRow);
});

 // Reset button
 $("#resetInput").on("click", function(event){
  location.reload()
 });

 // Auto refresh 1 minute timer
	setInterval("window.location.reload()", 60000)

});
