function hospital(){
	location.href = "#maps";
	alert(1)
}



function test(disease){
	console.log(disease)

$.ajax({
	type : "GET",
	url : "http://localhost:8080/disease/"+disease,
	error:function(request,status,error){
		alert("통신실패")

        console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

       },
	dataType: "json",
	success : function(data){	
		//category_id++;
		alert("success")
		successing(data) ;	
	}
});
}




function successing(data){

console.log(data.d_id+" "+data.d_name+" "+data.d_symptom+" "+data.d_prevent+" "+data.d_cure+" "+data.h_effect)
	//$("").innerHTML()
	$("#symptom").append(data.d_symptom)
    $("#cure").append(data.d_cure)


    location.href = "#disease";

}