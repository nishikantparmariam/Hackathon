var user_upvoted  = [];
var db = firebase.firestore();
function setUserInfo() 
            {
                    firebase.auth().onAuthStateChanged(function(user) {
                    if (user) 
                    {
                        var displayname=document.getElementById('displaynameask').value;
                        var batch=document.getElementById('batchask').value;
                        if (displayname!="" && batch!="")
                        {
                            
                            firebaseUserData = {"fullname":displayname, "batch":batch, "email":user.email, "upvoted":[]};
                            db.collection("users").doc(user.uid).set(firebaseUserData)
                            .then(function() {                                
                                document.getElementById('askFordisplayName').style.cssText="display:none !important;";   
                                fetch_posts();                             
                            })
                            .catch(function(error) {
                                document.getElementById('err_show_display_name').innerHTML="<div style='color:red;'>Please try again.</div>";
                            });

                            
                        }
                        else 
                        {
                           document.getElementById('err_show_display_name').innerHTML="<div style='color:red;'>Please try again.</div>";
                        }
                    }
                    else 
                    {
                        
                    }
                }
            );
        }


function count(){
    var l = document.getElementById("post_content").value.length;
    document.getElementById("post_length").innerHTML = l+""+"/500";
}

function post_submit(){
    var post_content = document.getElementById("post_content").value;
    var post_tag = document.getElementById("post_tag").value;
    var post_anonymous = document.getElementById("post_anonymous").checked;
    if(post_content.trim()!=""){
        if(post_content.length<=500){            
            var name_of_poster = firebaseUserData["fullname"];
            var email_of_poster = firebaseUserData["email"];
            if(post_anonymous){
                name_of_poster = "Anonymous";
                email_of_poster = " ";
            }            

            db.collection("posts").add({
                name:name_of_poster,
                email:email_of_poster,
                content:post_content,
                tag:post_tag,
                upvotes:[],
                timestamp:new Date().toLocaleString(),
            })
            .then(function() {
                document.getElementById("post_length").innerHTML = "<i class='fa fa-check'></i> Posted Successfully";
                document.getElementById("post_content").value = "";
            })
            .catch(function(error) {
                document.getElementById("post_length").innerHTML = "Please try again";
            });
        } else {
            document.getElementById("post_length").innerHTML = "Limit exceeded";
        }
    } else {
        document.getElementById("post_length").innerHTML = "Please write something";
    }
    console.log(post_content);
    console.log(post_tag);
    console.log(post_anonymous);   
}

function buildpost(data){
    var color;
    if(data.tag=="General"){
        color = "46019B";
    } else if(data.tag=="Academic Doubt"){
        color = "007EFE";

    } else if(data.tag =="Problem"){
        color = "00BB00";

    } else if(data.tag=="New Idea"){
        color = "7E359F";

    } else {
        color = "DD0000";

    }
    return '<br><div class="card"><div class="card-body"><div style="float:left;width:50px;height:50px;border-radius:100%;background:#eee;font-size:20pt;padding-left:15px;padding-top:5px;">'+data.name[0]+'</div><div style="float:left;margin-left:20px;"><b>'+data.name+'</b><br>'+data.email+'</div><div style="float:right;border-radius:15px;padding:5px 15px;background:#'+color+';color:#fff;">'+data.tag+'</div><br><br><hr>'+data.content+'<br><br><div style="text-align:right;">'+data.timestamp+'</div><hr><div style="text-align:left;float:left;"> <button class="btn btn-success btn-sm"><i class="fa fa-arrow-up"></i> Upvote  </button>&nbsp;&nbsp;<button class="btn btn-info btn-sm"><i class="fa fa-share"></i> Reply  </button></div><div style="text-align:right;"> <b>'+data.upvotes.length+' </b> Upvotes</div></div></div>';    
}
function fetch_posts(){    
    document.getElementById("post_display_load").innerHTML="<br><br>Loading...";
    db.collection("posts").orderBy("timestamp", "desc")
    .onSnapshot(function(querySnapshot) {     
        document.getElementById("post_display").innerHTML="";
        fetch_upvoted();
        console.log(firebaseUserData);        
        querySnapshot.forEach(function(doc) {
            //posts.push(doc.data());
            document.getElementById("post_display_load").innerHTML="";
            var iDiv = document.createElement('div');                        
            iDiv.innerHTML = buildpost(doc.data());
            document.getElementById("post_display").append(iDiv);
        });
        //console.log("Current cities in CA: ", cities.join(", "));
    });

}

function fetch_upvoted(){
    var docRef = db.collection("users").doc(firebaseUser.uid);    
    docRef.get().then(function(doc) {
        firebaseUserData["upvoted"] = doc.data()["upvoted"];        
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
}