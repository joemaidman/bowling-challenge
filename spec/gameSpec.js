'use strict';

describe('Game', function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  describe('~constructor', function() {

    it('has a #frames array with 1 item', function(){
      expect(game.frames.length).toEqual(1);
    });

  });

  describe('.newFrame',function(){

    it('starts a new frame', function(){
      game._createFrame();
      game._createFrame();
      expect(game.frames.length).toEqual(3);
    });

  });

  describe('.bowl',function(){

    it('responds', function (){
      spyOn(game,'bowl');
      game.bowl();
      expect(game.bowl).toHaveBeenCalled();
    });

    it('calls ._checkFrame', function (){
      spyOn(game,'_checkFrame');
      game.bowl();
      expect(game._checkFrame).toHaveBeenCalled();
    });


    it('raises an error if the game is over', function(){
      bowlGame(game, [10,10,10,10,10,10,10,10,10,10,10,10]);
      expect(function(){game.bowl()}).toThrow('You cannot bowl again! The game is finished.');
    });

  });

  describe('.getScore',function(){

    it('returns the correct score for a perfect game (all strikes)', function(){
      bowlGame(game, [10,10,10,10,10,10,10,10,10,10,10,10]);
      expect(game.getScore()).toEqual(300);
    });

    it('returns the correct score for a gutter game (no score)', function(){
      bowlGame(game, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expect(game.getScore()).toEqual(0);
    });

    it('returns the correct score for a game with no strikes or spares', function(){
      bowlGame(game, [0,5,5,0,1,4,2,3,7,0,8,0,4,4,4,0,5,0,6,1]);
      expect(game.getScore()).toEqual(59);
    });

    it('returns the correct score for a game with only spares', function(){
      bowlGame(game, [0,10,0,10,0,10,0,10,0,10,0,10,0,10,0,10,0,10,0,10,0]);
      expect(game.getScore()).toEqual(100);
    });

    it('returns the correct score for a mixed game (A)', function(){
      bowlGame(game, [0,10,1,9,2,0,5,5,1,1,2,5,4,1,0,10,6,3,0,10,0]);
      expect(game.getScore()).toEqual(85);
    });

    it('returns the correct score for a mixed game (B)', function(){
      bowlGame(game, [10,0,1,9,1,0,10,5,1,1,3,2,4,10,10,10,10,10]);
      expect(game.getScore()).toEqual(143);
    });

  });

  describe("fuzzing a game", function(){

    it('can bowl many game without violating the rules', function(){
      //Warning, bowls 1,000 games, may take several seconds to load results page
      for(var i = 0; i < 1000;i++){
        game = new Game();
        fuzzGame(game);
        expect(game.gameComplete()).toBe(true);
        expect(game.frames.length).toEqual(10);
        expect(game.getScore()).toBeLessThan(301);
        game.frames.forEach(function(frame){
          expect(frame.balls.length).toBeLessThan(4);
          expect(frame.getFrameScore()).toBeLessThan(31);
          expect(frame.isComplete()).toBe(true);
        });
      }

    });

  });

  describe('.wasPerfect',function(){

    it('returns true if the player scored 300', function(){
      expect(game.wasPerfect(300)).toBe(true);
    });

    it('returns false if the player scored less than 300', function(){
      expect(game.wasPerfect(100)).toBe(false);
    });

  });

  describe('.wasGutterGame',function(){

    it('returns true if the player scored 0', function(){
      expect(game.wasGutterGame(0)).toBe(true);
    });

    it('returns false if the player scored more than 0', function(){
      expect(game.wasGutterGame(100)).toBe(false);
    });

  });

});
