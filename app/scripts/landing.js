console.log("hello!");

$(document).ready(function() {
  console.log("hello!");
});

$(document).ready(function() {
  
  $('.hero-content h3').click(function(){
    var subText = $(this).text();
    $(this).text(subText + "!");
  });
  
  /*
  $('.hero-content h3').hover(function(){
    $(this).css({'color', 'red'});
  });
  */

  var onHoverAction = function(event) {
    console.log('Hover action triggered.');
    $(this).animate({'margin-top': '10px'});
  };

  var offHoverAction = function(event) {
    console.log('Off-hover action triggered.');
    $(this).animate({'margin-top': '0px'});
  };

  $('.selling-points .point').hover(onHoverAction, offHoverAction);

  $('.selling-points .point').click(function() {
    $(this).animate({'font-size': '16px'});  
  });

  $('.navbar-header').click(function() {
    $('.navbar-header').fadeOut( "slow" ); 
  });


});
