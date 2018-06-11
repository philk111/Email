//JS FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------------------------
//Password match------------------------------------------------------------------------------------------------------------------------------------------------------------
function passwordMatch(password, password2) {
    if (password != password2) {
        return true;
    }
}

var currentId = 0;

//SELECT EMAIL------------------------------------------------------------------------------------------------------------------------------------------------------------    
function selectEmail(emailId) {
    var email = $("#logInPane input[name=email]").val();
    var password = $("#logInPane input[name=password]").val();

    $.ajax({url: "/api/v1/emails/" + emailId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 200:
                    break;
                default:
                    alert("Server API error with code " + xhr.status);
            }
        },
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        var hasAttachment = data.attachmentMimeType;
        if (hasAttachment != "") {
            currentId = data.id;
            $(".date").text(data.dateSent);
            $(".from").text(data.from);
            $(".subject").text(data.subject);
            $(".body").text(data.body);
            $("select").val(data.folder);
            $(".fileAttachment").text(data.attachmentFileName);
            $(".emailViewer").show();
            $('#inboxMoveToFolder').attr('emailId', data.ID);
            $('#importantMoveToFolder').attr('emailId', data.ID);
            $('#socialMoveToFolder').attr('emailId', data.ID);
            $('#spamMoveToFolder').attr('emailId', data.ID);
            $('.hasAttachment').show();
            $('.fileAttachment').show();
        } else {
            currentId = data.id;
            $(".date").text(data.dateSent);
            $(".from").text(data.from);
            $(".subject").text(data.subject);
            $(".body").text(data.body);
            $("select").val(data.folder);
            $(".emailViewer").show();
            $('#inboxMoveToFolder').attr('emailId', data.ID);
            $('#importantMoveToFolder').attr('emailId', data.ID);
            $('#socialMoveToFolder').attr('emailId', data.ID);
            $('#spamMoveToFolder').attr('emailId', data.ID);
            $('.hasAttachment').hide();
            $('.fileAttachment').hide();

        }



    });
}

//INBOX MOVE TO FOLDER------------------------------------------------------------------------------------------------------------------------------------------------------------    
function inboxMoveToFolder() {
    var emailId = $("#inboxMoveToFolder").attr("emailid");
    if (!emailId) {
        return;
    }
    var email = $("#logInPane input[name=email]").val();
    var newfolder = $("#inboxMoveToFolder").find(":selected").text();
    var password = $("#logInPane input[name=password]").val();

    var dataToSend = JSON.stringify(newfolder);
    $.ajax({url: "/api/v1/emails/" + emailId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 201:
                    alert("Emailed moved successfully");
                    break;
            }
        },
        type: "PUT",
        dataType: "json",
        data: dataToSend,
    }).done(function (data) {
        refreshInboxList();
        $('.emailViewer').hide();
    });
}

//IMPORTANT MOVE TO FOLDER------------------------------------------------------------------------------------------------------------------------------------------------------------    
function importantMoveToFolder() {
    var emailId = $("#importantMoveToFolder").attr("emailid");
    if (!emailId) {
        return;
    }
    var email = $("#logInPane input[name=email]").val();
    var newfolder = $("#importantMoveToFolder").find(":selected").text();
    var password = $("#logInPane input[name=password]").val();

    var dataToSend = JSON.stringify(newfolder);
    $.ajax({url: "/api/v1/emails/" + emailId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 201:
                    alert("Emailed moved successfully");
                    break;
            }
        },
        type: "PUT",
        dataType: "json",
        data: dataToSend,
    }).done(function (data) {
        refreshImportantList();
        $('.emailViewer').hide();
    });
}

//SOCIAL MOVE TO FOLDER------------------------------------------------------------------------------------------------------------------------------------------------------------    
function socialMoveToFolder() {
    var emailId = $("#socialMoveToFolder").attr("emailid");
    if (!emailId) {
        return;
    }
    var email = $("#logInPane input[name=email]").val();
    var newfolder = $("#socialMoveToFolder").find(":selected").text();
    var password = $("#logInPane input[name=password]").val();

    var dataToSend = JSON.stringify(newfolder);
    $.ajax({url: "/api/v1/emails/" + emailId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 201:
                    alert("Emailed moved successfully");
                    break;
            }
        },
        type: "PUT",
        dataType: "json",
        data: dataToSend,
    }).done(function (data) {
        refreshSocialList();
        $('.emailViewer').hide();
    });
}

//SPAM MOVE TO FOLDER------------------------------------------------------------------------------------------------------------------------------------------------------------    
function spamMoveToFolder() {
    var emailId = $("#spamMoveToFolder").attr("emailid");
    if (!emailId) {
        return;
    }
    var email = $("#logInPane input[name=email]").val();
    var newfolder = $("#spamMoveToFolder").find(":selected").text();
    var password = $("#logInPane input[name=password]").val();

    var dataToSend = JSON.stringify(newfolder);
    $.ajax({url: "/api/v1/emails/" + emailId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 201:
                    alert("Emailed moved successfully");
                    break;
            }
        },
        type: "PUT",
        dataType: "json",
        data: dataToSend,
    }).done(function (data) {
        refreshSpamList();
        $('.emailViewer').hide();
    });
}

//REFRESH INBOX LIST------------------------------------------------------------------------------------------------------------------------------------------------------------    
function refreshInboxList() {
    var email = $("#logInPane input[name=email]").val();
    var password = $("#logInPane input[name=password]").val();

    $.ajax({url: "/api/v1/emails/inbox",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 200:
                    break;
                default:
                    alert("Server API error with code " + xhr.status);
            }
        },
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        var output = "<table border=3>\n";
        output += "<tr><th>From:</th><th>Subject:</th></tr>\n";
        for (var i = 0; i < data.length; i++) {
            var inboxEmails = data[i];
            output += '<tr onclick="selectEmail(' + inboxEmails.ID + ')">'
            output += "<td>" + inboxEmails.from + "</td>";
            output += "<td>" + inboxEmails.subject + "</td>";
            output += "</tr>";
        }
        output += "</table>\n";
        $(".emailList").html(output);
    });
}

//REFRESH IMPORTANT LIST------------------------------------------------------------------------------------------------------------------------------------------------------------    
function refreshImportantList() {
    var email = $("#logInPane input[name=email]").val();
    var password = $("#logInPane input[name=password]").val();

    $.ajax({url: "/api/v1/emails/important",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 200:
                    break;
                default:
                    alert("Server API error with code " + xhr.status);
            }
        },
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        $(".emailList").empty('');
        var output = "<table border=3>\n";
        output += "<tr><th>From:</th><th>Subject:</th></tr>\n";
        for (var i = 0; i < data.length; i++) {
            var importantEmails = data[i];
            output += '<tr onclick="selectEmail(' + importantEmails.ID + ')">'
            output += "<td>" + importantEmails.from + "</td>";
            output += "<td>" + importantEmails.subject + "</td>";
            output += "</tr>";
        }
        output += "</table>\n";
        $(".emailList").html(output);
    });
}

//REFRESH SOCIAL LIST------------------------------------------------------------------------------------------------------------------------------------------------------------    
function refreshSocialList() {
    var email = $("#logInPane input[name=email]").val();
    var password = $("#logInPane input[name=password]").val();

    $.ajax({url: "/api/v1/emails/social",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 200:
                    break;
                default:
                    alert("Server API error with code " + xhr.status);
            }
        },
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        var output = "<table border=3>\n";
        output += "<tr><th>From:</th><th>Subject:</th></tr>\n";
        for (var i = 0; i < data.length; i++) {
            var socialEmails = data[i];
            output += '<tr onclick="selectEmail(' + socialEmails.ID + ')">'
            output += "<td>" + socialEmails.from + "</td>";
            output += "<td>" + socialEmails.subject + "</td>";
            output += "</tr>";
        }
        output += "</table>\n";
        $(".emailList").html(output);
    });
}

//REFRESH SPAM LIST------------------------------------------------------------------------------------------------------------------------------------------------------------    
function refreshSpamList() {
    var email = $("#logInPane input[name=email]").val();
    var password = $("#logInPane input[name=password]").val();

    $.ajax({url: "/api/v1/emails/spam",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 200:
                    break;
                default:
                    alert("Server API error with code " + xhr.status);
            }
        },
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        var output = "<table border=3>\n";
        output += "<tr><th>From:</th><th>Subject:</th></tr>\n";
        for (var i = 0; i < data.length; i++) {
            var spamEmails = data[i];
            output += '<tr onclick="selectEmail(' + spamEmails.ID + ')">'
            output += "<td>" + spamEmails.from + "</td>";
            output += "<td>" + spamEmails.subject + "</td>";
            output += "</tr>";
        }
        output += "</table>\n";
        $(".emailList").html(output);
    });
}

//REFRESH SPAM LIST------------------------------------------------------------------------------------------------------------------------------------------------------------    
function refreshOutboxList() {
    var email = $("#logInPane input[name=email]").val();
    var password = $("#logInPane input[name=password]").val();

    $.ajax({url: "/api/v1/emails/outbox",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization",
                    "Basic " + btoa(email + ":" + password));
        },
        complete: function (xhr, text) {
            switch (xhr.status) {
                case 401:
                    alert("Login failed. Check username and password");
                    break;
                case 403:
                    alert("ERROR 403 - UNAUTHORIZED");
                    break;
                case 200:
                    break;
                default:
                    alert("Server API error with code " + xhr.status);
            }
        },
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        var output = "<table border=3>\n";
        output += "<tr><th>From:</th><th>Subject:</th></tr>\n";
        for (var i = 0; i < data.length; i++) {
            var outboxEmails = data[i];
            output += '<tr onclick="selectEmail(' + outboxEmails.ID + ')">'
            output += "<td>" + outboxEmails.from + "</td>";
            output += "<td>" + outboxEmails.subject + "</td>";
            output += "</tr>";
        }
        output += "</table>\n";
        $(".emailList").html(output);
    });
}


//DOCUMENT READY------------------------------------------------------------------------------------------------------------------------------------------------------------    
$(document).ready(function () {
    $("#mainWrapper").hide();
    $("#outboxTab").hide();
    $("#spamTab").hide();
    $("#socialTab").hide();
    $("#importantTab").hide();
    $("#inboxTab").hide();
    $("#logout").hide();
    $('.hasAttachment').hide();
    $('.fileAttachment').hide();

//REGISTER CLICK------------------------------------------------------------------------------------------------------------------------------------------------------------    
    $("#register").click(function () {
        var fullName = $("#registerForm input[name=fullName]").val();
        var email = $("#registerForm input[name=email]").val();
        var password = $("#registerForm input[name=password]").val();
        var password2 = $("#registerForm input[name=password2]").val();
        var x = passwordMatch(password, password2);

        if (fullName == null || fullName == "", email == null || email == "", password == null || password == "", password2 == null || password2 == "")
        {
            $("#mainRegister #passNoMatchError4").show();
            return;
        } else {
            $("#mainRegister #passNoMatchError4").hide();
        }


        if (x) {
            $("#mainRegister #passNoMatchError1").show();
            return;
        } else {
            $("#mainRegister #passNoMatchError1").hide();
            var y = {fullName: fullName, email: email, password: password};
            var userInfo = JSON.stringify(y);

            $.ajax({url: "/api/v1/users",
                statusCode: {
                    400: function (xhr) {
                        var errorMessage = xhr.responseText;
                        $("#errors").text(errorMessage);
                    },
                    500: function (xhr) {
                        $("#errors").text("-- ERROR 500: Unique Index. Email already exists. --");
                    }
                },
                type: "POST",
                dataType: "json", //WRITE THIS??
                data: userInfo,
            }).done(function (data) {
                $("#errors").text("");
                console.log("New user registered");
                alert("Thank you for registering.");
                $("#registerForm input[name=fullName]").val("");
                $("#registerForm input[name=email]").val("");
                $("#registerForm input[name=password]").val("");
                $("#registerForm input[name=password2]").val("");
            });
        }
    });

//UPDATE CLICK------------------------------------------------------------------------------------------------------------------------------------------------------------    
    $("#update").click(function () {
        var newPass1 = $("#updatePassForm input[name=newPass1]").val();
        var newPass2 = $("#updatePassForm input[name=newPass2]").val();
        var email = $("#updatePassForm input[name=email]").val();
        var password = $("#updatePassForm input[name=password]").val();
        var x = passwordMatch(newPass1, newPass2);

        if (newPass1 == null || newPass1 == "", newPass2 == null || newPass2 == "", email == null || email == "", password == null || password == "")
        {
            $("#mainRegister #passNoMatchError3").show();
            return;
        } else {
            $("#mainRegister #passNoMatchError3").hide();
        }

        if (x) {
            $("#mainRegister #passNoMatchError2").show();
            return;
        } else {
            $("#mainRegister #passNoMatchError2").hide();

            var y = {email: email, password: newPass1, oldPass: password};
            var passChangeInfo = JSON.stringify(y);


            $.ajax({url: "/api/v1/users/" + email,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization",
                            "Basic " + btoa(email + ":" + password));
                },
                complete: function (xhr, text) {
                    switch (xhr.status) {
                        case 401:
                            alert("Login failed. Check username and password");
                            break;
                        case 400:
                            var errorMessage = xhr.responseText;
                            $("#errors").text(errorMessage);
                            break;
                        case 201:
                            break;
                        default:
                            alert("Server API error with code " + xhr.status);
                    }
                },
                type: "PUT",
                dataType: "json",
                data: passChangeInfo,
            }).done(function () {
                $("#errors").text("");
                console.log("Password updated successfully");
                alert("password updated!");
                $("#updatePassForm input[name=newPass1]").val("");
                $("#updatePassForm input[name=newPass2]").val("");
                $("#updatePassForm input[name=email]").val("");
                $("#updatePassForm input[name=password]").val("");
            });
        }

    });

//LOGIN CLICK------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $("#loginButton").click(function () {
        var email = $("#logInPane input[name=email]").val();
        var password = $("#logInPane input[name=password]").val();

        $.ajax({url: "/api/v1/users/" + email,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization",
                        "Basic " + btoa(email + ":" + password));
            },
            complete: function (xhr, text) {
                switch (xhr.status) {
                    case 401:
                        alert("Login failed. Please enter valid username and password.");
                        break;
                    case 404:
                        alert("Login failed. Please enter valid username and password.");
                        break;
                    case 200:
                        break;
                    default:
                        alert("Server API error with code " + xhr.status);
                }
            },
            type: "GET",
            dataType: "json"
        }).done(function () {
            $("#errorsMail").text("");
            console.log("login successful");
            $("#mainWrapper").show();
            $("#logInPane").hide();
            $("#logout").show();
            $("#back").hide();
        });

    });

//LOGOUT CLICK------------------------------------------------------------------------------------------------------------------------------------------------------------    
    $("#logout").click(function () {
        $("#logInPane input[name=email]").val("");
        $("#logInPane input[name=password]").val("");
        $("#logout").hide();
        $("#mainWrapper").hide();
        $("#logInPane").show();
        $("#back").show();
    });


//NEW EMAIL------------------------------------------------------------------------------------------------------------------------------------------------------------    
    $("#sendEmail").click(function () {
        var email = $("#logInPane input[name=email]").val();
        var password = $("#logInPane input[name=password]").val();
        var to = $("#newEmailTab input[name=to]").val();
        var subject = $("#newEmailTab input[name=subject]").val();
        var body = $("#newEmailTab textarea[name=body]").val();
        var fileInput1 = document.getElementById('fileUploaded').files[0];
        var newEmail;

        if (fileInput1) {
            var fileInput = document.getElementById('fileUploaded');
            var files = fileInput.files;
            var file;
            var fileName;
            var fileType;
            var hasFile = true;

            for (var i = 0; i < files.length; i++) {
                file = files[i];
                fileName = file.name;
                fileType = file.type;

            }
            var encodedFile = window.btoa(fileInput1);
            var y = {to: to, subject: subject, body: body, file: encodedFile, fileName: fileName, fileType: fileType, hasFile: hasFile, email: email, password: password};
            newEmail = JSON.stringify(y);

        } else {
            var x = {to: to, subject: subject, body: body, email: email, password: password};
            newEmail = JSON.stringify(x);
        }

        $.ajax({url: "/api/v1/emails",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization",
                        "Basic " + btoa(email + ":" + password));
            },
            complete: function (xhr, text) {
                switch (xhr.status) {
                    case 401:
                        alert("Login failed. Check username and password");
                        break;
                    case 400:
                        var errorMessage = xhr.responseText;
                        $("#errorsMail").text(errorMessage);
                        break;
                    case 403:
                        alert("ERROR 403 - UNAUTHORIZED");
                        break;
                    case 201:
                        break;
                }
            },
            statusCode: {
                500: function (xhr) {
                    var errorMessage = xhr.responseText;
                    $("#errorsMail").text(errorMessage);
                }
            },
            type: "POST",
            dataType: "json",
            data: newEmail,
        }).done(function (data) {
            $("#errorsMail").text("");
            console.log("Email sent successfully.");
            alert("Email sent!");
            $("#newEmailTab input[name=to]").val('');
            $("#newEmailTab input[name=subject]").val('');
            $("#newEmailTab textarea[name=body]").val('');
            $("#fileUploaded").val('');
        });

    });


//new email------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $("#newEmail").click(function () {
        $("#outboxTab").hide();
        $("#spamTab").hide();
        $("#socialTab").hide();
        $("#importantTab").hide();
        $("#inboxTab").hide();
        $("#newEmailTab").show();
    });

//inbox------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $("#inbox").click(function () {
        $("#outboxTab").hide();
        $("#spamTab").hide();
        $("#socialTab").hide();
        $("#importantTab").hide();
        $("#inboxTab").show();
        $("#newEmailTab").hide();
        $(".emailViewer").hide();
        refreshInboxList();
    });

//important------------------------------------------------------------------------------------------------------------------------------------------------------------       
$("#important").click(function () {
    $("#outboxTab").hide();
    $("#spamTab").hide();
    $("#socialTab").hide();
    $("#importantTab").show();
    $("#inboxTab").hide();
    $("#newEmailTab").hide();
    $(".emailViewer").hide();
    refreshImportantList();
});

//social------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $("#social").click(function () {
        $("#outboxTab").hide();
        $("#spamTab").hide();
        $("#socialTab").show();
        $("#importantTab").hide();
        $("#inboxTab").hide();
        $("#newEmailTab").hide();
        $(".emailViewer").hide();
        refreshSocialList();
    });

//spam------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $("#spam").click(function () {
        $("#outboxTab").hide();
        $("#spamTab").show();
        $("#socialTab").hide();
        $("#importantTab").hide();
        $("#inboxTab").hide();
        $("#newEmailTab").hide();
        $(".emailViewer").hide();
        refreshSpamList();
    });

//outbox------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $("#outbox").click(function () {
        $("#outboxTab").show();
        $("#spamTab").hide();
        $("#socialTab").hide();
        $("#importantTab").hide();
        $("#inboxTab").hide();
        $("#newEmailTab").hide();
        $(".emailViewer").hide();
        refreshOutboxList();
    });

    //MENUITEMS CLICK------------------------------------------------------------------------------------------------------------------------------------------------------------       
    $(".menuItems span").click(function () {
        $(this).css("background-color", "#90C1FF");
        $(".menuItems span").not(this).css("background-color", "#3C4AFF");
    });





}); // DOCUMENT.READY CLOSE


































        