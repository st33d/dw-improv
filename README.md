#Dungeon World Imrov

An SRD and generator for [Dungeon World](http://www.dungeon-world.com/)

Hosted at [http://robotacid.com/games/dw-improv/](http://robotacid.com/games/dw-improv/)

By Aaron Steed.

Contains text from:

* [Dungeon World SRD](http://www.dungeonworldsrd.com/)
* [Tricks, Empty Rooms, and Basic Trap Design](http://angband.oook.cz/steamband/Tricks.pdf) by Courtney C. Campbell
* [The Big List of RPG Plots</a> by S. John Ross](http://www222.pair.com/sjohn/blueroom/plots.htm)

##TODO

**Issues**

* CSS still being worked on
* Slightly worried about wholesale reproducing text so I'm wary of crossing the line (may have with Knacks and Instincts generator based on Appendix 4).

**To Add**

* Some of the generators could be expanded upon - the Markov algorithm I'm using isn't great. More Things?
* Want to add a page for me so I don't go mad copy and pasting? The output for each option takes a text file and turns every newline on it into a list element. [This is the file for the Effects](http://robotacid.com/games/dw-improv/data/Effects.txt). You can add html in there as well, any newline will be turned into a new entry. Headers can be done by dropping a h3 tag in. For the generators I run the file through a function such as "Pick 10 at random".