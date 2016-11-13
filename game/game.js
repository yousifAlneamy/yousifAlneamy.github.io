/**
* This code is a change of a code posted by mozilla of a sample game called "2D breakout game using pure JavaScript".
* this game is responsive now and the more smarter than the sample code
**/

window.onload = function reload(){

    var canvas = document.getElementById("myCanvas");    
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var ctx = canvas.getContext("2d");
    var rightPressed = false;
    var leftPressed = false;
    var responsiveSpeed = 10 * ((320 * 480) / (canvas.height * canvas.width));
    var stratX = getRandom( canvas.width / 4, 3 * canvas.width / 4);
    var score = 0;
    var gameOver = false;


    var brickBlock = function(canvas, width, height, padding, offSetTop, offSetLeft, rowCount, columnCount){
        var obj = {
                bricks : [],
                width : width || 75,
                height : height || 20,
                padding : padding || 10,
                offSetTop : offSetTop || 30,
                offSetLeft : offSetLeft || 30,
                resetCount : 1
        };
        obj.rowCount = rowCount || Math.floor( (canvas.height - obj.offSetTop) / (obj.height + obj.padding) / 3 );
        obj. columnCount = columnCount || Math.floor( (canvas.width - obj.offSetLeft) / (obj.width + obj.padding) );   
        obj.offSetLeft = (canvas.width - ((obj.columnCount * (obj.width + obj.padding)))) / 2; // to get best offset so that the bricks be in the center
        obj.resetBricks = function(){
            for ( c = 0; c < obj.bricks.length; c++ ){
                for ( r = 0; r < obj.bricks[c].length; r++ ){
                    obj.bricks[c][r].status = 1;
                }
            }
        }
        return obj;
    }(canvas);

    console.log(responsiveSpeed);
    var ball = function(canvas, stratX, dx, dy, radius){
      return {
          x : stratX,
          y : canvas.height - 30,
          dx : dx || 2,
          dy : dy || -2,
          radius : radius || 10
      };
    }(canvas, stratX);

    var paddle = function(canvas, stratX){ // creating a paddle object
        var obj = {};
        obj.width = canvas.width / 10 > 75 ? Math.round (canvas.width / 10) : 75;
        obj.height = Math.round( 0.1333333333 * obj.width );
        obj.x = stratX;
        return obj;
    }(canvas, stratX);


    //brickOffsetLeft = (canvas.width - ((brickColumnCount * (brickWidth + brickPadding)))) / 2;
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function getRandomColor() {
        return getRandom(0, 255);
    }
    function getRandom(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
    }

    for(c = 0; c < brickBlock.columnCount; c++) { // initialization of the bricks
        brickBlock.bricks[c] = [];
        for(r = 0; r < brickBlock.rowCount; r++) { // **
            var brickX = ( c * (brickBlock.width + brickBlock.padding) )  + brickBlock.offSetLeft;
            var brickY = ( r * (brickBlock.height + brickBlock.padding) ) + brickBlock.offSetTop;

            brickBlock.bricks[c][r] = {};
            brickBlock.bricks[c][r].x = brickX;
            brickBlock.bricks[c][r].y = brickY;
            brickBlock.bricks[c][r].status = 1; // status property used to indicate whether a brick has been hit by the ball or not. Default is 1 (not hit)
            brickBlock.bricks[c][r].color = "rgb(" + getRandomColor() + ", " + getRandomColor() + ", " + getRandomColor() + ")"; // ** random color **
        }
    }
        //console.log("rgb(" + Math.round(Math.random() * 100) + ", " + Math.round(Math.random() * 100) + ", " + Math.round(Math.random() * 100) + ")");

    function keyDownHandler(e){
        if(e.keyCode == 39){
            rightPressed = true;
        }
        else if(e.keyCode == 37){
                leftPressed = true;
            }
    }

    function keyUpHandler(e){

        if(e.keyCode == 39){
            rightPressed = false;
        }
        else if(e.keyCode == 37){
                  leftPressed = false;
            }
        }

    function drawBall(){
        ctx.beginPath();
        ctx.fillStyle = "#0033FF";
        ctx.fillStroke = "#0033FF";
        ctx.Stroke = "10";
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
        }

    function drawPaddle(){
        ctx.beginPath();
        ctx.fillStyle = "#0033FF"; // paddle color
        ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height); // drawing the paddle for the ball will bounce on
        ctx.fill();
        ctx.closePath();
        }

    function drawBricks() {
        for(c = 0; c < brickBlock.columnCount; c++) {
            for(r = 0; r < brickBlock.rowCount; r++) {
                if(brickBlock.bricks[c][r].status == 1) {            
                    ctx.beginPath();
                    ctx.fillStyle = brickBlock.bricks[c][r].color;
                    ctx.rect(brickBlock.bricks[c][r].x, brickBlock.bricks[c][r].y, brickBlock.width, brickBlock.height);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() { // ** smarter collision detection
        for(c = 0; c < brickBlock.columnCount; c++) {
            for(r=0; r < brickBlock.rowCount; r++) {
                var brick = brickBlock.bricks[c][r];
                if(brick.status == 1) {
                    if(ball.x > brick.x && ball.x < brick.x + brickBlock.width && ball.y > brick.y && ball.y < brick.y + brickBlock.height) {
                        if(ball.y > brick.y + Math.abs(ball.dy) && ball.y < brick.y + brickBlock.height - Math.abs(ball.dy)){
                            ball.dx = - ball.dx;
                        } else{
                            ball.dy = - ball.dy;
                        }
                        brick.status = 0;
                        score++;

                        if(score >= brickBlock.rowCount * brickBlock.columnCount * brickBlock.resetCount) {
                            brickBlock.resetCount++;
                            brickBlock.resetBricks();// rset the bricks stats property
                            responsiveSpeed = responsiveSpeed * 0.9;
                        }

                    }
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }


    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing the whole canvas to make it ready for the next drawings
        ballMovementHandler();
        paddleMovementHandler();
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();
    }

    function ballMovementHandler(){
        
        ball.x += ball.dx;
        ball.y += ball.dy;
        if(ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = - ball.dx;
        }
        if(ball.y + ball.dy < ball.radius) {
            ball.dy = - ball.dy;
        }
        else if(ball.y + ball.dy > canvas.height - ball.radius) {
            if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                 if(ball.y = ball.y - paddle.height) {
                    ball.dy = - ball.dy;
                 }
            }
            else {
                if ( ! gameOver ){
                    gameOver = true;
                    reload();
                }
            }
        }
    }
    function paddleMovementHandler(){
        if(rightPressed && paddle.x < canvas.width - paddle.width){
            paddle.x += 7;
        } 
        // removing else so that pressing both right and left give no movement as -7 + +7 = 0
      if(leftPressed && paddle.x > 0 ){
              paddle.x -= 7;
      }
    }


    var timer = function speedTimer(){
        draw();
        if ( ! gameOver ){
            setTimeout(speedTimer, responsiveSpeed);
        }
    }
    function start(){
        setTimeout(timer, responsiveSpeed);
    }
    start();
}
