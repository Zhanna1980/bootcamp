/**
 * Created by zhannalibman on 18/01/2017.
 */

(function () {
    //initialize variables
    var rows = 10;
    var cols = 10;



    var snake = {
        posX : 0,
        posY : 0,
        movementDirection : 0,
        movementInterval : null,
        moveRight : function(){
            this.posX += 1;
        },
        moveLeft : function(){
            this.posX -= 1;
        },
        moveDown : function () {
            this.posY += 1;
        },
        moveUp : function () {
            this.posY -= 1;
        },
        checkBounds : function () {
            if(this.posX > cols - 1){
                this.posX = 0;
            } else if(this.posX < 0){
                this.posX = cols - 1;
            }
            if(this.posY > rows - 1){
                this.posY = 0;
            } else if(this.posY < 0){
                this.posY = rows - 1;
            }
        },
        erazeSnakeFromPreviousPosition : function () {
            var black = $('.black').html('');
            black.removeClass('black');
        },
        drawSnakeOnNewPosition : function () {
            $($( ".col")[rows*this.posY + this.posX]).addClass("black");
        },
        moveToNewPosition : function (keyCodeDirection) {
            this.erazeSnakeFromPreviousPosition();
            switch (keyCodeDirection){
                        case 0:
                            return;
                        case 37:
                            this.moveLeft();
                            break;
                        case 38:
                            this.moveUp();
                            break;
                        case 39:
                            this.moveRight();
                            break;
                        case 40:
                            this.moveDown();
                            break;
                        default:
                            break;
            }
            this.checkBounds();
            this.drawSnakeOnNewPosition();
            this.movementDirection = keyCodeDirection;
        },
        continueMove : function () {
            this.movementInterval = setInterval(function () {
                this.moveToNewPosition(this.movementDirection);
            }.bind(this), 200);
        },
        stopMove : function () {
            clearInterval(this.movementInterval);
            this.movementDirection = 0;
        }
    };

    var matrix = initMatrix(rows,cols, snake);


    $(document).ready(function () {
        drawMatrix(rows, cols, matrix);
    });


    /**
     * handle key events
     * */
    $(window).on('keydown', function (e) {
        snake.stopMove();
        snake.moveToNewPosition(e.keyCode);
        snake.continueMove();

    });


    /**
     * function that builds matrix
     *
     * */
    function initMatrix(row, cols, snake) {
        var matrix = [];
        for (var r = 0; r < rows; r++){
            var row = [];
            for (var c = 0; c < cols; c++){
                row.push((r == snake.posY && c == snake.posX) ? true : false);
            }
            matrix.push(row);
        }
        return matrix;
    }


    /* function draws the matrix */
    function drawMatrix(rows, cols, matrix) {
        var stage = $('#stage').html('');
        for (var r = 0; r < rows; r += 1) {
            var row = $('<div class="row"></div>').appendTo(stage);
            for (var c = 0; c < cols; c += 1) {
                var col = $('<div class="col"></div>').appendTo(row);
                if (matrix[r][c] == true) {
                    col.addClass('black');
                }
            }
        }
    }





})();