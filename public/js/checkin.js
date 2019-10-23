$(document).ready(function(){

//-----------Checkin Patient------------------

$('.addCheckinBtn').click(function (event) {
    event.preventDefault();
    const cardnumber = $('#cardnumber').val().trim(); 
    const surname = $('#surname').val().trim();
    const othername = $('#othername').val().trim();
    const reasonforvisit = $('#reasonVisit').val().trim();
    const doctorassigned = $('#doctorAssigned').val().trim();
    const dateandtime = $('#checkinDateTime').val().trim();
    //Trim is added to ensure that empty space cannot be submitted


    //Check if user input is empty

    if (!cardnumber|| !surname || !othername || !reasonforvisit || !doctorassigned || !dateandtime) {
      $('.addMessage').html('Kindly fill in all fields');
      return;
    }
//Submit the user data if the user does not exist
$.ajax({
  method: 'POST',
  url: 'http://localhost:3000/checkin',
  data: {
    cardnumber,
    surname,
    othername,
    reasonforvisit,
    doctorassigned,
    dateandtime
    
  },
  beforeSend: function () {
    $('.addMessageCheckin').html('Checking in....');
  },
  success: function () {
    $('.addMessageCheckin').html('Patient Checkedin Successfully');
    $('#cardnumber').val("");
    $('#surname').val("");
   $('#othername').val("");
    $('#reasonVisit').val("");
     $('#doctorAssigned').val("");
    $('#checkinDateTime').val("");
   
      //This is done to ensure that the form returns empty after successfull submission
  },
});

});
//-----------End of Chekin--------------------------------------

//-------Show Patient Checked in---------------
// Show all the data in the database
$.ajax({
    method: 'GET',
    url: `http://localhost:3000/checkin`,

    success: function (response) {

      response.forEach(element => {
        $(".outputTableCheckedin").prepend(`<tr>        
        <td>${element.cardnumber}</td>
        <td>${element.surname}</td>
         <td>${element.othername}</td>
         <td>${element.dateandtime}</td>
         <td><p data-placement="top" data-toggle="tooltip" title="View"><button class="btn btn-success btn-xs" data-title="view" data-toggle="" data-target="" data-cardNumber=${element.cardnumber} id=${element.id}><span class="glyphicon glyphicon-pencil">Checkout</span></button></p></td>

         </tr>
         `);
      });




    },


  });





});