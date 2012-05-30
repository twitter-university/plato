# dirparse
Parses projects from the root directory. Emits a Json representation of the project.

usage:
    node dirparse.js ./project

Creates a file called cd-files.json in the project root. This file will be used to display the availible files in the browser. Currently `node_modules` and any files that start with `.` are ignored.
