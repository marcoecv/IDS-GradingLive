<?php
echo $this->Html->css('historial');
echo $this->Html->script('historial/index');
?>
<div id="historial-div">
    <center>
        <textarea style="width: 90%"type="text" name="category" readonly id="category" rows="5">Wednesday - 10-29-2014 07:25:00 Atlanta Hawks regular Season wins 
        </textarea><br/><br/>
    </center>
    <label class="label-control">Wager Type</label><br/>
    <div style="margin-bottom: 100px">
        <div class="bordered-div" style="float: left;width: 68%">
            <center>
                <table id="RBtable">
                    <tr>
                        <td><label>Straight Bets</label></td>
                        <td><label>Parleys</label></td>
                        <td><label>If-Bets</label></td>
                        <td><label>Teasers</label></td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="bet" id="straight"/></td>
                        <td><input type="radio" name="bet" id="parleys"/></td>
                        <td><input type="radio" name="bet" id="idBets"/></td>
                        <td><input type="radio" name="bet" id="teasers"/></td>
                    </tr>
                </table>
            </center>
        </div>
        <div id="checkBDiv">
            <input type="checkbox" name="" id=""/>&nbsp;<label class="label-control">Apply Percent Book</label><br/>
            <input type="checkbox" name="" id=""/>&nbsp;<label class="label-control">Eliminate Lost Cancelled Wagers</label><br/>
            <input type="checkbox" name="" id=""/>&nbsp;<label class="label-control">Include RIF Wagers</label><br/>
        </div>
    </div>
    <br/>
    <label class="label-control">Accumulated Volume Amounts at Lines</label>
    <div class="volumeAmountTable">
        <table>
            <tr>
                <td>Dallas Cowboys</td>
                <td>Line</td>
                <td>Chicago Bears</td>
                <td>Line</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
        </table>
    </div>
    <br/>
    <input type="text" size="6" name="" id=""/>&nbsp;&nbsp;<-  Total  ->&nbsp;&nbsp;<input type="text" size="6"  name="" id=""/>

    <br/><br/>
    <div style="width: 100%">
        <label class="label-control">Individual Wagers</label>
        <button id="amPricesButton" style="float: right" name="amPricesButton" type="button" class="btn btn-default">
            American Prices
        </button>
    </div>
    <br/>
    <div class="volumeAmountTable">
        <table>
            <tr>
                <td>Posted</td>
                <td>Customer ID</td>
                <td>Choice</td>
                <td>Line</td>
                <td>Volume Amt</td>
                <td>Agent</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
            </tr>
        </table>
    </div>                

    <br/>
    <div>

        <label>Wager Count:&nbsp;</label><input type="text" size="4" name="wagerCount" id="wagerCount"/>
        <button id="cancelButtonML" style="float: right" disabled name="cancelButtonML" type="button" class="btn btn-default">
            Wager Details
        </button>
    </div>
    <br/>
</div>