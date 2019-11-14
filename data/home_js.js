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
                            
                            firebaseUserData = {"fullname":displayname, "batch":batch, "email":user.email};
                            db.collection("users").doc(user.uid).set(firebaseUserData)
                            .then(function() {                                
                                document.getElementById('askFordisplayName').style.cssText="display:none !important;";   
                                fetch_posts(0);                             
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
            
            var toAdd = {
                name:name_of_poster,
                email:email_of_poster,
                content:post_content,
                tag:post_tag,
                upvotes:[],
                timestamp:new Date().toLocaleString(),
                timestamp2:new Date()
            };

            post_project_link

            if(post_tag=="Project"){
                toAdd[content]="<a href='"+document.getElementById("post_project_link").value+"'></a><br><br>"+post_content
            }

            db.collection("posts").add(toAdd)
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


function upvote_post(post_id, action){    
    var docRef = db.collection("posts").doc(post_id);    
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var upvote_array_now = doc.data()["upvotes"];
            if(action==1){
                if(!upvote_array_now.includes(firebaseUser.uid)){
                    upvote_array_now.push(firebaseUser.uid);
                    docRef.update({
                        upvotes: upvote_array_now,
                    })
                    .then(function() {
                        
                    })
                    .catch(function(error) {
                        //document.getElementById("post_length").innerHTML = "Please try again";
                    });
                }
            }   else {
                if(upvote_array_now.includes(firebaseUser.uid)){
                    for( var i = 0; i < upvote_array_now.length; i++){ 
                        if ( upvote_array_now[i] === firebaseUser.uid) {
                            upvote_array_now.splice(i, 1); 
                          i--;
                        }
                     }                    
                    docRef.update({
                        upvotes: upvote_array_now,
                    })
                    .then(function() {
                        
                    })
                    .catch(function(error) {
                        //document.getElementById("post_length").innerHTML = "Please try again";
                    });
                }
            }                    
            


        } else {              
            console.log("Error");            
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
}

function give_reply_ui(data){
    return '<div style="background:#f5f5f5;border-radius:5px;padding:10px;margin-bottom:5px;"><div style="float:left;width:50px;height:50px;border-radius:100%;background:#fff;font-size:20pt;padding-left:15px;padding-top:5px;">'+data.fullname[0]+'</div><div style="float:left;margin-left:20px;"><b>'+data.fullname+'</b><br>'+data.reply+'</div><br><br></div>';
}

function load_replies(post_id){    
    console.log(post_id);
    db.collection("replies").where("for_post","==",post_id)
    .onSnapshot(function(querySnapshot) {
        var shower = document.getElementById("replies_shower"+post_id);
        shower.innerHTML="";
        querySnapshot.forEach(function(doc) {
            var iDiv = document.createElement('div');                        
            iDiv.innerHTML = give_reply_ui(doc.data());
            shower.append(iDiv);
                
        });
        //console.log("Current cities in CA: ", cities.join(", "));
    });


    /*var docRef = db.collection("replies").doc(firebaseUser["uid"]);    
    docRef.get().then(function(doc) {
        if (doc.exists) {
            firebaseUserData = doc.data();   
            console.log(firebaseUserData); 
            fetch_posts();        
        } else {              
            document.getElementById('askFordisplayName').style.cssText="display:block !important;";         
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); */

}

function send_reply(post_id){
    var anonymous = document.getElementById('send_anonoymous'+post_id).checked;
    var reply_content = document.getElementById("replier"+post_id).value;
    var toAdd = {
        reply:reply_content,
        fullname:firebaseUserData["fullname"],
        email:firebaseUserData["email"],
        for_post:post_id,
        timestamp:new Date().toLocaleString(),
    }
    if(anonymous){
        toAdd["fullname"] = "Anonymous";
        toAdd["email"] = " ";
    }    
    db.collection("replies").add(toAdd)
    .then(function() {
        console.log("Reply added");
        document.getElementById("all-reply-btns").value = "";
    })
    .catch(function(error) {
        document.getElementById("post_length").innerHTML = "Please try again";
    });
}


function buildpost(data, post_id){
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
    if(!data["upvotes"].includes(firebaseUser.uid)){
        return '<br><div class="card"><div class="card-body"><div style="float:left;width:50px;height:50px;border-radius:100%;background:#eee;font-size:20pt;padding-left:15px;padding-top:5px;">'+data.name[0]+'</div><div style="float:left;margin-left:20px;"><b>'+data.name+'</b><br>'+data.email+'</div><div style="float:right;border-radius:15px;padding:5px 15px;background:#'+color+';color:#fff;">'+data.tag+'</div><br><br><hr>'+data.content+'<br><br><div style="text-align:right;">'+data.timestamp+'</div><hr><div style="text-align:left;float:left;"> <button onclick="upvote_post(\''+post_id+'\', 1);" class="btn btn-default btn-sm"><i class="fa fa-arrow-up"></i> Upvote  </button>&nbsp;&nbsp;<button onclick="load_replies(\''+post_id+'\');" type="button" data-toggle="collapse" data-target="#collapseExample'+post_id+'" aria-expanded="false" aria-controls="collapseExample"  class="btn btn-default btn-sm"><i class="fa fa-share"></i> Reply  </button></div><div style="text-align:right;"> <b>'+data.upvotes.length+' </b> Upvotes</div><div class="collapse" id="collapseExample'+post_id+'"><hr><div id="replies_shower'+post_id+'"></div> <div><input type="text" style="float:left;width:80%;" class="form-control" id="replier'+post_id+'" placeholder="Write a reply..."><button id="all-reply-btns" class="btn btn-default all-reply-btns" style="float:right;width:20%;color:#28A745;" onclick="send_reply(\''+post_id+'\')"><i class="fa fa-send"></i> Send</button><br> <input type="checkbox" id="send_anonoymous'+post_id+'" name="post_anonymous" value="1">   Send Anonymously</div></div></div></div>';       
    }    
    else {
        return '<br><div class="card"><div class="card-body"><div style="float:left;width:50px;height:50px;border-radius:100%;background:#eee;font-size:20pt;padding-left:15px;padding-top:5px;">'+data.name[0]+'</div><div style="float:left;margin-left:20px;"><b>'+data.name+'</b><br>'+data.email+'</div><div style="float:right;border-radius:15px;padding:5px 15px;background:#'+color+';color:#fff;">'+data.tag+'</div><br><br><hr>'+data.content+'<br><br><div style="text-align:right;">'+data.timestamp+'</div><hr><div style="text-align:left;float:left;"><button onclick="upvote_post(\''+post_id+'\', 0);" class="btn btn-default btn-sm"><i class="fa fa-arrow-down"></i> Downvote  </button>&nbsp;&nbsp;<button  onclick="load_replies(\''+post_id+'\');" type="button" data-toggle="collapse" data-target="#collapseExample'+post_id+'" aria-expanded="false" aria-controls="collapseExample"  class="btn btn-default btn-sm"><i class="fa fa-share"></i> Reply  </button></div><div style="text-align:right;"> <b>'+data.upvotes.length+' </b> Upvotes</div><div class="collapse" id="collapseExample'+post_id+'"><hr><div id="replies_shower'+post_id+'"></div> <div><input type="text" style="float:left;width:80%;" class="form-control" id="replier'+post_id+'" placeholder="Write a reply..."><button  id="all-reply-btns" class="btn btn-default all-reply-btns" style="float:right;width:20%;color:#28A745;" onclick="send_reply(\''+post_id+'\')"><i class="fa fa-send"></i> Send</button><br><input type="checkbox" id="send_anonoymous'+post_id+'" name="post_anonymous" value="1"> Send Anonymously</div></div></div></div>';    
    }
}
function fetch_posts(category){    
    document.getElementById("post_display_load").innerHTML="<br><br>Loading...";    
    var exp3;
    if(category==1){
        exp3 = "General";
    }  else if(category==2){
        exp3 = "Academic Doubt";
    } else if(category==3){
        exp3 = "Problem";
    } else if(category==4){
        exp3 = "New Idea";
    } else if(category==5){
        exp3 = "General Query";
    } 
    
        db.collection("posts").orderBy("timestamp2", "desc")
        .onSnapshot(function(querySnapshot) {     
            document.getElementById("post_display").innerHTML="";        
            console.log(firebaseUserData);                 
            querySnapshot.forEach(function(doc) {
                document.getElementById("post_display_load").innerHTML="";   
                //posts.push(doc.data());   
                if(exp3 == null){
                    var iDiv = document.createElement('div');                        
                    iDiv.innerHTML = buildpost(doc.data(), doc.id);
                    document.getElementById("post_display").append(iDiv);
                } else if(exp3==doc.data()["tag"]){ 
                    var iDiv = document.createElement('div');                        
                    iDiv.innerHTML = buildpost(doc.data(), doc.id);
                    document.getElementById("post_display").append(iDiv);
                }                                
            });
            //console.log("Current cities in CA: ", cities.join(", "));
        });
    
    

}

function check_(){    
    if(document.getElementById("post_tag").value=="Project"){
            document.getElementById("project_input").style.cssText="display:block !important;";   
    } else {
        document.getElementById("project_input").style.cssText="display:none !important;";   
    }
}