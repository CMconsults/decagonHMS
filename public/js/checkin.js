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

  //---Endo fo Show Checkedin Patient Function---------

  //-------Search Checkedin Patient---------------

  $('.searchForm').submit(function () {
    event.preventDefault();
    const searchInput = $('#searchInput').val().trim();
    $('.searchMessageCheckedin').html(''); //Done so that it removes the error message of the invalid card number


    if (!searchInput) {
      $('.searchMessageCheckedin').html('Kindly a valid card number');
      return;
    }

    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/checkin`,

      success: function (response) {

        if (response.length) {
          const userList = response.filter(function (res) {
            return res.cardnumber === searchInput;
          });
          if (userList.length === 0) {
            return $('.searchMessageCheckedin').html('patient not checked in');
          }
          userList.forEach(element => {
            const searchHtml = `<tr>               
            <td>${element.cardnumber}</td>
            <td>${element.surname}</td>
             <td>${element.othername}</td>
             <td>${element.dateandtime}</td>
             <td><p data-placement="top" data-toggle="tooltip" title="View"><button class="btn btn-success btn-xs" data-title="view" data-toggle="" data-target="" data-cardNumber=${element.cardnumber} id=${element.id}><span class="glyphicon glyphicon-pencil">Checkout</span></button></p></td>
           </tr>
           `;


           $("outputTableCheckedin").html(searchHtml) //Used so that it won't be appending same search output multiple times.
          });
        }
      },
    });
  });


  //-----End of Search Function For Checkedin Patient---------


  //-----Show Patient History
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/checkin`,

    success: function (response) {

      response.forEach(element => {
        $(".outputTablePatientHistory").prepend(`<tr>        
        <td>${element.cardnumber}</td>
        <td>${element.surname}</td>
         <td>${element.othername}</td>
         <td>${element.reasonforvisit}</td>
         <td>${element.doctorassigned}</td>      
         </tr>
         `);
      });
    },
  });



});