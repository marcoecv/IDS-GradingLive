

/****************************************************************************************************
 * This class returns some helpers as confirmation dialogs, spinners or other alert types for users *
 **************************************************************************************************** 
 * @returns {ConfirmationHelpers}
 ****************************************************************************************************/

function ConfirmationHelpers() {

    var self = this;
    var blink = 0;
    var blink_times = 0;
    var execute_blink_delay = 0;
    var execute_blink_delay_error = 0;
    var container = "";


    /*******************************************************************************************
     * Displays or shows the confirmation response status
     *  
     * @param String icon_type The type of confirmation icon: 'ok' or 'error'
     * @param String cont The container of icon: (span container: id="[cont]" class="glyphicon glyphicon-ok ok-delay-status-hide ok-delay-status-icon-marg")
     * @param int interval (optional) The interval time of icon's blinks or null
     * @returns view -> icon with check status ok or icon with error status (X)
     ******************************************************************************************/
    this.confirmation_response_status = function(icon_type, cont, interval) {
        var interval_time = interval;
        container = cont;
        if (interval_time == null) {
            switch (icon_type) {
                case 'ok':
                    interval_time = 175;
                    execute_blink_delay = setInterval(reset_delay_status, interval_time);
                    break;
                case 'error':
                    interval_time = 500;
                    execute_blink_delay_error = setInterval(reset_delay_status_error, interval_time);
                    break;

            }
        }

        else {
            switch (icon_type) {
                case 'ok':                    
                    execute_blink_delay = setInterval(reset_delay_status, interval_time);
                    break;
                case 'error':                    
                    execute_blink_delay_error = setInterval(reset_delay_status_error, interval_time);
                    break;
            }
        }
    }


    /*******************************************************************************************
     * Shows the check's blink in ok mode  
     *******************************************************************************************/
    var reset_delay_status = function() {

        self.active_icon_ok();
        if (blink_times == 7) {
            blink = 0;
            blink_times = 0;
            $(container).removeClass('ok-delay-status');
            $(container).addClass('ok-delay-status-hide');
            clearInterval(execute_blink_delay);
        }
        else {
            var reset_delay_0 = function() {
                $(container).removeClass('ok-delay-status-hide');
                $(container).addClass('ok-delay-status');
            }
            var reset_delay_1 = function() {
                $(container).removeClass('ok-delay-status');
                $(container).addClass('ok-delay-status-hide');
            }

            switch (blink) {
                case 0:
                    reset_delay_0();
                    blink = 1;
                    break;
                case 1:
                    reset_delay_1();
                    blink = 0;
                    blink_times++;
                    break;
            }
        }
    }

    /*******************************************************************************************
     * Shows the check's blink in error mode 
     *******************************************************************************************/
    var reset_delay_status_error = function() {
        self.active_icon_error();
        if (blink_times == 4) {
            blink = 0;
            blink_times = 0;
            $(container).removeClass('ok-delay-status-error');
            $(container).addClass('ok-delay-status-hide');
            clearInterval(execute_blink_delay_error);
        }
        else {
            var reset_delay_0 = function() {
                $(container).removeClass('ok-delay-status-hide');
                $(container).addClass('ok-delay-status-error');
            }
            var reset_delay_1 = function() {
                $(container).removeClass('ok-delay-status-error');
                $(container).addClass('ok-delay-status-hide');
            }

            switch (blink) {
                case 0:
                    reset_delay_0();
                    blink = 1;
                    break;
                case 1:
                    reset_delay_1();
                    blink = 0;
                    blink_times++;
                    break;
            }
        }
    }

    /*******************************************************************************************
     * Actives icon error
     *******************************************************************************************/
    this.active_icon_error = function() {
        $(container).removeClass('ok-delay-status ok-delay-status-hide');
        $(container).removeClass('glyphicon-ok');
        $(container).addClass('glyphicon-remove ok-delay-status-error');
    }

    /*******************************************************************************************
     * Actives icon ok
     *******************************************************************************************/
    this.active_icon_ok = function() {
        $(container).removeClass('ok-delay-status-error ok-delay-status-hide');
        $(container).removeClass('glyphicon-remove');
        $(container).addClass('glyphicon-ok ok-delay-status');
    }

    /*******************************************************************************************
     * Stops the icon
     *******************************************************************************************/
    this.stop_status_icon = function() {
        $(container).addClass('ok-delay-status ok-delay-status-hide');
        clearInterval(execute_blink_delay_error);
        clearInterval(execute_blink_delay);
    }



}