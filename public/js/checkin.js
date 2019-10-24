$(document).ready(function(){

//----------Checkin Patient Validation-----
$('#cardnumber').keydown(function (e) { 
  if (e.keyCode === 13){
    const cardnumber = $('#cardnumber').val().trim(); 
    if (!cardnumber){
     return alert("Kindly input card number");
    }

    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/patients?cardnumber=${cardnumber}`,
      success: function (res) {
        
        if (res.length === 0){
          return alert("Patient not registered. Kindly register patient before checkin")
        }
        
        
        $("#prefill").find('input[name="surname"]').val(res[0].surname);
        $("#prefill").find('input[name="othername"]').val(res[0].othername);
      }
        
  });
}
});
  



  //-----------Checkin Patient------------------

$('.addCheckinBtn').click(function (event) {
    event.preventDefault();

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    const cardnumber = $('#cardnumber').val().trim(); 
    const surname = $('#surname').val().trim();
    const othername = $('#othername').val().trim();
    const reasonforvisit = $('#reasonVisit').val().trim();
    const doctorassigned = $('#doctorAssigned').val().trim();
    const dateandtime = dateTime;
    const checkouttime = ''
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
    dateandtime,
    checkouttime
    
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
        if (element.checkouttime === '') {
          $(".outputTableCheckedin").prepend(`<tr>        
        <td>${element.cardnumber}</td>
        <td>${element.surname}</td>
         <td>${element.othername}</td>
         <td>${element.dateandtime}</td>
         <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#checkoutPatient" data-cardNumber=${element.cardnumber}  id=${element.id}><span class="glyphicon glyphicon-trash">Checkout</span></button></p></td>

         </tr>
         `);
        } // To show data in checkin/checkout history
        else{
          
          $(".outputTableCheckinOut").prepend(`<tr>        
        <td>${element.cardnumber}</td>
        <td>${element.surname}</td>
         <td>${element.othername}</td>
         <td>${element.dateandtime}</td>
         <td>${element.checkouttime}</td>      
         </tr>
         `);

        }
        
      });
    },
  });

  //---End of Show Checkedin Patient Function---------

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
          $(".outputTableCheckedin").empty();
          userList.forEach(element => {
            
            $(".outputTableCheckedin").prepend(`<tr>               
            <td>${element.cardnumber}</td>
            <td>${element.surname}</td>
             <td>${element.othername}</td>
             <td>${element.dateandtime}</td>
             <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#checkoutPatient"  data-cardNumber=${element.cardnumber} id=${element.id}><span class="glyphicon glyphicon-trash">Checkout</span></button></p></td>
           </tr>
           `);

            
           
           $(".outputTableCheckedin").html(searchHtml); //Used so that it won't be appending same search output multiple times.
          });
        }
      },
    });
  });

    //-----End of Search Function For Checkedin Patient---------
//-----Checkout Button----
$(document).on('click', "td button", function (e) {
  e.preventDefault();
  if ($(this).data('target') == '#checkoutPatient') {

    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/checkin?cardnumber=${$(this).data('cardnumber')}`,
      success: function (res) {

       checkout(res[0]);
       
        
      }
    });
  }
})
function checkout(res){

$(".checkoutBtn").click(function (e) {
  console.log("here")
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
    const cardnumber = res.cardnumber; 
    const surname = res.surname;
    const othername = res.othername;
    const reasonforvisit = res.reasonforvisit;
    const doctorassigned = res.doctorassigned;
    const dateandtime = res.dateandtime;
    const checkouttime = dateTime;
  $.ajax({
    url: `http://localhost:3000/checkin/${res.id}`,
    method: 'PATCH',
    data: {
      cardnumber,
      surname,
      othername,
      reasonforvisit,
      doctorassigned,
      dateandtime,
      checkouttime
      
    },
    success: function () {
      alert("Patient has been checked out");
      window.location.reload();
    }
  });
});
}


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

  //----Show Checkin and Checkout History
  // $.ajax({
  //   method: 'GET',
  //   url: `http://localhost:3000/checkin`,

  //   success: function (response) {

  //     response.forEach(element => {

        
  //     });
  //   },
  // });



});