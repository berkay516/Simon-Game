function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var lis = ["#green", "#red", "#yellow", "#blue"];
var gamelis = [];
var upbound = 3;
var gameon = false;
var level = 1;

// Oyun başlangıcı için herhangi bir tuşa basıldığında
$(document).one("keydown", function() {
  startGame();
});

function startGame() {
  $("#level-title").text("Level " + level);
  gameon = true;
  game();
}

async function game() {
  gamelis = []; // yeni tur için sıfırla
  let k = 0;

  while (gameon && k < upbound) {
    const colorselector = Math.floor(Math.random() * 4);
    $(lis[colorselector]).fadeOut("fast").fadeIn("fast");
    gamelis.push(lis[colorselector]);

    //select substring of selected id with starting fitsr index, so id is only color to play audio
    var audio = new Audio("sounds/" + lis[colorselector].substring(1) + ".mp3");
    audio.play();

    k++;
    await sleep(1000);
  }

  // check user click
  $(".btn").off("click").on("click", function() {
    var clicked = "#" + $(this).attr("id");
    var user_audio = new Audio("sounds/" + clicked.substring(1) + ".mp3");
    user_audio.play();

    // User buton blinking
    $(clicked).fadeOut(100).fadeIn(100);

    var expected = gamelis.shift();

    if (clicked !== expected) {
      // Wrong choice and configuring background logic
      $("body").addClass("game-over");
      setTimeout(() => { $("body").removeClass("game-over"); }, 200);
      $("#level-title").text("Game Over, Press Any Key to Restart");
      gameon = false;
      restartGame();
      return;
    }

    // New start level logic
    if (gamelis.length === 0) {
      upbound++;
      level++;
      $("#level-title").text("Level " + level);
      setTimeout(game, 1000);
    }
  });
}

function restartGame() {
  gamelis = [];
  upbound = 3;
  level = 1;
  $(document).one("keydown", function() {
    startGame();
  });
}
