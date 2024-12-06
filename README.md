# Obsidian REPL plugin
This plugin adds an emacs-like read evaluate print loop (REPL) to obsidian.
This lets you execute javascript in a document *and* importantly interact with editor objects as though you were writing a plugin.
This can be useful when developing plugins, or for "light-weight" scripting without having to develop a plugin.

# Using
Install the plugin. I would advise binding CTRL-J to the commamd (Execute the current line or selection).

You can then write javascript expressions and then run commands to execute these expressions, return the result.
A "dir" method is provided to allow you to inspect objects. And various useful objects are available.

* `repl` is the plugin object for repl.
* `editor` is the editor object. You can use this to write to current-file
* `app` is the application object.

You might like to [refer to the plugin documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) at the same time.

## Convenience functions provided
Various convenience functions are provided:

* dir(o:Object) - List the property in an object
* message(s:string) - Print a message
* command(s:string) - Run a command
* lineNumber - return the line number of the current line
* plugin(s:string) - Get the object for a plugin
* bufferString() - Return a string containing the entire text of the buffer
* insert(s:string) - Insert a string into the buffer
* pointMin() - Return the minimum cursor in the buffer
* pointMax() - Return the maximun cursor in the buffer
* forwardChar(count?) - Move count (or one) character forward


## Importing modules
I experimented with the [obsidian modules](https://github.com/polyipseity/obsidian-modules) plugin but had issues importing full modules.

The approach I have used to getting access to modules when hacking on a new plugin is to create a new plugin and half that plugin set `self.MODULE = MODULE` on load. You can then access this self open from the repl.

# Installation
In your obsidian vault there should be a `.obsidian/plugins` directory. You can clone this repo into that
directory and then run the following to build the plugin:

```
npm install
npm run dev
```

You should then be able to enable the plugin in the "Community Plugins" section of settings.

# About me
I make productivity tools and AI tools related to reading and research.
If that sounds interesting you can follow me on <a href="https://x.com/readwithai">twitter</a> or <a href="https://bsky.app/profile/readwithai.bsky.social">bluesky</a>.

I write about these topics on <a href="https://readwithai.substack.com/readwithai">substack</a>.

If you find *this* piece of software useful. Maybe give me money (like $2 dollars?) on my <a href="ko-fi.com/readwithai">kofi</a>.
