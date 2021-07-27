class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('GameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      GameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('PlayerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage(car1Img);

    car2 = createSprite(300,200);
    car2.addImage(car2Img);

    car3 = createSprite(500,200);
    car3.addImage(car3Img);

    car4 = createSprite(700,200);
    car4.addImage(car4Img);
    
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo(); //allPlayers
    player.getCarsatEnd();

    if(allPlayers !== undefined){
      background("white");
      image(trackImg,0,-4*displayHeight,displayWidth,5*displayHeight);
      //index of the array
      var index = 0;
      
      //x and y position of the cars
      var x = 175;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 250;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        //Identifying currently active player
        if (index === player.index){
          fill('red');
          ellipse(x,y,60,60);
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance> 4110){
       gameState = 2;
       player.rank = player.rank+1;
       Player.updateCarsatEnd(player.rank);
    }

    drawSprites();
  }

  end(){
    //console.log("game has ended");
    //console.log(player.rank);

 if(alertrank){   
    swal({
      title : "game Over",
      text : "Your rank is "+ player.rank,
      icon : "success",
      button : "Done!"
    })
    alertrank = 0;
  }
  }
}
