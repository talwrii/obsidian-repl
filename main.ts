import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

import * as util from 'util'
import * as evalScope from "./evalScope"

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}


class Scope {
    // https://stackoverflow.com/questions/2051678/getting-all-variables-in-scope
    context: Object

    constructor() {
        this.context = {};
    }

    add(name: string, x: any) {
        this.context[name] = x
    }

    eval(s: string) {
        console.log("scope s:" + s)
        return evalScope.evalInScope(s, this.context)
    }
}

function dir(obj: any) {
    var p = [];
    for (; obj != null; obj = Object.getPrototypeOf(obj)) {
        var op = Object.getOwnPropertyNames(obj);
        for (var i = 0; i < op.length; i++)
            if (p.indexOf(op[i]) == -1)
                p.push(op[i]);
    }
    return p;
}

const formatObj = (x: any) => {
    console.log("formatting")
    if (x === undefined) {
        return "undefined";
    } else if (typeof x === "string") {
        return x.toString()
    } else if (typeof x === "boolean") {
        return x.toString()
    } else if (typeof x === "number") {
        return x.toString()
    } else if (x.constructor === undefined) {
        return util.inspect(x)
    } else if (x.constructor === Array) {
        return x.toString()
    } else if (x.constructor === Object) {
        return util.inspect(x)
    } else {
        console.log(x.constructor.name)
        return `[${x.constructor.name} object]`
    }
}

const makeEndOfLine = (editor: any) => {
    return () => {
        const cursor = editor.getCursor()
        const line = editor.getLine(cursor.line)
        editor.setCursor(cursor.line, line.length)
    }
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;
    scope: Scope

    async onload() {
        this.scope = new Scope()
        await this.loadSettings();

        this.addCommand({
            id: 'repl-execute',
            name: 'Execute the current line or selection',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const cursor = editor.getCursor()

                const region = editor.getSelection() || editor.getLine(cursor.line)

                let output: string = "";
                const endOfLine = makeEndOfLine(editor)

                this.scope.add("plugin", this)
                this.scope.add("app", this.app)
                this.scope.add("editor", editor)
                this.scope.add("view", view)
                this.scope.add("endOfLine", endOfLine)
                this.scope.add("dir", dir)
                try {
                    output = formatObj(this.scope.eval(region))
                } catch (e) {
                    new Notice(e.toString())
                    return;
                }
                editor.setCursor(cursor.line + 1, 0)
                editor.replaceRange(output + "\n", editor.getCursor())
                endOfLine()
            }
        });


        // This adds a settings tab so the user can configure various aspects of the plugin

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt);
        });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
