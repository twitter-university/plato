plato
=====

## Projects

### Comments
Should be of the form: `<marker+lines>` where marker is a unique id and lines is the number of lines to highlight.

### .meta
Meta files should be in JSON format. The only necessary field is `"marker"` where the value is equal to `<marker>` 
`title` and `content` fields are also able to be included, but not necessary.
ex: 
    {
      "marker":"<1>"
    }

### dirparse

dirparse creates a JSON format object of the directory structure. `cd-files.json` Said file is placed in the root of the project.
