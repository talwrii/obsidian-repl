function evalInScope (s, context) {
    var result;
    context["_s"] = s
    with (makeScope(context)) {
        if (/^ *\{/.test(_s)) {
            // object literal
            result = eval("(" + _s + ")")
        } else {
            result = eval(_s)
        }
        return result
    }
}

function makeScope (target) {
    return new Proxy(target, {
        has(target, prop) { return true; },
        get(target, prop) { return (prop in target ? target : window)[prop]; }
    });
}

exports["evalInScope"] = evalInScope
exports["makeScope"] = makeScope
