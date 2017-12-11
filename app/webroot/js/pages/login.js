

function Login() {


    var self = this;

    //--------------------------------------------------------------------------
    //---> Initialize controls
    //--------------------------------------------------------------------------
    this.init = function() {

        $('#id_login').on('click', function(event) {

            event.preventDefault();
            self.login();

        });

        $('#header').hide();
        $('#spinner').hide();
    }

    //--------------------------------------------------------------------------
    //Login method
    //--------------------------------------------------------------------------    
    this.login = function()
    {
        return self.validation_credential_fields();
    }

    //--------------------------------------------------------------------------
    //---> Login validation errors (missing fields)
    //--------------------------------------------------------------------------
    this.validation_credential_fields = function() {

        var user = $('#id_user').val();
        var password = $('#id_password').val();
        var count_fields = 0;

        var final_message = '';

        if (user == "") {
            final_message += 'Login';
            count_fields++;
        }
        if (password == "") {
            final_message += (final_message != '') ? ", password" : "Password";
            count_fields++;
        }
        if (final_message != '') {
            if (count_fields > 1) {
                self.active_message(final_message + " are required", "Login Error");
            }
            else {
                self.active_message(final_message + " is required", "Login Error");
            }
            return false;
        }

        else {
            self.do_login();
            return true;
        }

    }
    //--------------------------------------------------------------------------
    //---> Validate an user (login method by ajax)
    //--------------------------------------------------------------------------
    this.do_login = function() {

        var user = $('#id_user').val();
        var password = $('#id_password').val();
        var Data = {user: user, password: password};
        $('#spinner').show();
        $('#id_login').attr('disabled', true);
        $.ajax({
            url: serverurl + "pages/dologin",
            timeout: 15000,
            type: "POST",
            data: Data,
            dataType: 'json',
            success: function(response) {                
                if (response.is_logged == 1) {
                    $('#spinner').hide();
                    $('#container_fluid').load(serverurl + 'pages/games');
                    $('#id_login').attr('disabled', false);
                    $('#header').show();
                }
                else {
                    $('#spinner').hide();
                    $('#id_login').attr('disabled', false);
                    self.active_message('Invalid user or password', 'Authentication failed...');
                }
            },
            error: function(x, t, h) {
                if (t === "timeout") {
                    self.active_message('Server error', 'Authentication failed...');
                    $('#spinner').hide();
                    $('#id_login').attr('disabled', false);
                }
            }
        });
    }

    //--------------------------------------------------------------------------
    //---> Pop-up messages
    //--------------------------------------------------------------------------
    this.active_message = function(message, popup_title) {

        $('#message').text(message);
        $('#title').text(popup_title);
        $('#message_container').modal();
        $('#message_container').modal({keyboard: false}),
                $('#message_container').show('show');
    }
}


