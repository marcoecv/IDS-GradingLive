$(document).ready(function() {
	alert("hola");
	$("#separator").click(function(){
		toggleSlide();
	});
});
function toggleSlide(){
	$("#scheduleTree").slideToggle("slow");
	$("#scheduleLines").slideToggle("slow");
}
