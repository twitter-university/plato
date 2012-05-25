Command Line executable written in node.js. 
Takes a file and parses the comments for <*> markers.
Then it looks for filename.meta and adds the content to the parsed markers.

This code can run browser-side with a few modifications. (ie: dynamic loading of files/.meta )


## Use
needs node.js installed. Preferably the latest v0.6.x

./parsecode.js -f filename.java
