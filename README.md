# Dungeon as Advertised
The final project in React series on freeCodeCamp.

**User Stories:**
1. I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.
1. All the items and enemies on the map are arranged at random.
1. I can move throughout a map, discovering items.
1. I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.
1. Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.
1. When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.
1. When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.
1. When I find and beat the boss, I win.
1. The game should be challenging, but theoretically winnable.

**Some notes:**
* The map is generated with [BSP Tree technique](http://roguecentral.org/doryen/articles/bsp-dungeon-generation/).
* The map generation is done with functional programming techniques and Immutable.js library. The result is not very performant and placed in a webworker to prevent UI freezing.
* Only a small amount of code is covered by tests, but these are the most difficult parts.
* Performance of the app is highly dependent on amount of cells on the grid.
* To speed up rendering when player moves, only certain rows of the grid are rendered.
