arrow_function_parens: {
    input: {
        something && (() => {});
    }
    expect_exact: "something&&(()=>{});"
}

arrow_function_parens_2: {
    input: {
        (() => null)();
    }
    expect_exact: "(()=>null)();"
}

typeof_arrow_functions: {
    options = {
        evaluate: true,
        typeofs: true,
    }
    input: {
        var foo = typeof (x => null);
        console.log(foo);
    }
    expect_exact: "var foo=\"function\";console.log(foo);"
    expect_stdout: "function"
}

classes: {
    input: {
        class SomeClass {
            constructor() {
            };
            foo() {};
        };
        class NoSemi {
            constructor(...args) {
            }
            foo() {}
        };
        class ChildClass extends SomeClass {};
        var asExpression = class AsExpression {};
        var nameless = class {};
    }
    expect_exact: "class SomeClass{constructor(){}foo(){}}class NoSemi{constructor(...args){}foo(){}}class ChildClass extends SomeClass{}var asExpression=class AsExpression{};var nameless=class{};"
}

class_statics: {
    input: {
        x = class {
            static staticMethod() {}
            static get foo() {}
            static set bar() {}
            static() { /* "static" can be a method name! */ }
            get() { /* "get" can be a method name! */ }
            set() { /* "set" can be a method name! */ }
        }
    }
    expect_exact: "x=class{static staticMethod(){}static get foo(){}static set bar(){}static(){}get(){}set(){}};"
}

class_name_can_be_mangled: {
    mangle = { };
    input: {
        function x() {
            class Foo {
            }
            var class1 = Foo;
            var class2 = class Bar {};
        }
    }
    expect: {
        function x() {
            class a { }
            var s = a;
            var c = class a {};
        }
    }
}

class_name_can_be_preserved: {
    mangle = {
        keep_classnames: true
    }
    input: {
        function x() {
            (class Baz { });
            class Foo {};
        }
    }
    expect: {
        function x() {
            (class Baz { });
            class Foo {};
        }
    }
}

classes_can_have_generators: {
    input: {
        class Foo {
            *bar() {}
            static *baz() {}
        }
    }
    expect: {
        class Foo {
            *bar() {}
            static *baz() {}
        }
    }
}

classes_can_have_computed_generators: {
    input: {
        class C4 {
            *['constructor']() {}
        }
    }
    expect: {
        class C4 {
            *['constructor']() {}
        }
    }
}

classes_can_have_computed_static: {
    input: {
        class C4 {
            static ['constructor']() {}
        }
    }
    expect: {
        class C4 {
            static ['constructor']() {}
        }
    }
}

class_methods_and_getters_with_keep_quoted_props_enabled: {
    beautify = {
        quote_style: 3,
        keep_quoted_props: true,
    }
    input: {
        class clss {
            a() {}
            "b"() {}
            get c() { return "c"}
            get "d"() { return "d"}
            set e(a) { doSomething(a); }
            set 'f'(a) { doSomething(b); }
            static g() {}
            static "h"() {}
        }
    }
    expect_exact: 'class clss{a(){}"b"(){}get c(){return"c"}get"d"(){return"d"}set e(a){doSomething(a)}set\'f\'(a){doSomething(b)}static g(){}static"h"(){}}'
}

classes_with_expression_as_expand: {
    input: {
        class D extends (calls++, C) {}
    }
    expect_exact: "class D extends(calls++,C){}"
}

classes_extending_classes_out_of_pure_iifes: {
    options = {
        toplevel: true,
        unused: true,
        side_effects: true,
    }
    input: {
        let Base = /*@__PURE__*/ (() => {
            class A {}
            A.sub = Sub
            return A;
        })();

        class Sub extends Base { }
    }
    expect: { }
}

new_target: {
    input: {
        new.target;
        new.target.name;
    }
    expect_exact: "new.target;new.target.name;"
}

number_literals: {
    input: {
        0b1001;
        0B1001;
        0o11;
        0O11;
    }

    expect: {
        9;
        9;
        9;
        9;
    }
}

import_statement: {
    input: {
        import "mod-name";
        import Foo from "bar";
        import { Bar, Baz } from 'lel';
        import Bar, { Foo } from 'lel';
        import { Bar as kex, Baz as food } from 'lel';
    }
    expect_exact: 'import"mod-name";import Foo from"bar";import{Bar,Baz}from"lel";import Bar,{Foo}from"lel";import{Bar as kex,Baz as food}from"lel";'
}

import_all_statement: {
    input: {
        import * as Lel from 'lel';
    }
    expect_exact: 'import*as Lel from"lel";'
}

import_meta: {
    input: {
        import.meta;
        import.meta.url;
    }
    expect_exact: 'import.meta;import.meta.url;'
}

export_statement: {
    options = {
        evaluate: true,
    }
    input: {
        export default 1 + 2;
        export var a = 4;
        export let b = 6;
        export const c = 6;
        export function d() {};
        export class e {};
    }
    expect_exact: "export default 3;export var a=4;export let b=6;export const c=6;export function d(){}export class e{}"
}

export_default_object_expression: {
    options = {
        evaluate: true,
    }
    input: {
        export default {
            foo: 1 + 2,
            bar() { return 4; },
            get baz() { return this.foo; },
        };
    }
    expect_exact: "export default{foo:3,bar(){return 4},get baz(){return this.foo}};"
}

export_default_array: {
    options = {
        evaluate: true,
    }
    input: {
        export default [ 1 + 2, foo ];
    }
    expect_exact: "export default[3,foo];"
}

export_default_anon_function: {
    options = {
        evaluate: true,
    }
    input: {
        export default function(){
            console.log(1 + 2);
        }
    }
    expect_exact: "export default function(){console.log(3)}"
}

export_default_anon_class: {
    options = {
        evaluate: true,
    }
    input: {
        export default class {
            foo() { console.log(1 + 2); }
        }
    }
    expect_exact: "export default class{foo(){console.log(3)}}"
}

export_from_statement: {
    input: {
        export * from "a.js";
        export {A} from "a.js";
        export {A, B} from "a.js";
        export {C};
    }
    expect_exact: 'export*from"a.js";export{A}from"a.js";export{A,B}from"a.js";export{C};'
}

import_attributes: {
    input: {
        import "hello" with { key: 'value' };
    }
    expect_exact: 'import"hello"with{key:"value"};'
}

import_attributes_with_spaces_in_obj: {
    input: {
        import "hello" with { 'k e y': 'value' };
    }
    expect_exact: 'import"hello"with{"k e y":"value"};'
}

import_attributes_import_expr: {
    input: {
        import("hello", { key: "value" })
    }
    expect_exact: 'import("hello",{key:"value"});'
}

export_from_attributes: {
    input: {
        export * from "hello" with { key: 'value' };
    }
    expect_exact: 'export*from"hello"with{key:"value"};'
}

export_named_from_attributes: {
    input: {
        export { x } from "hello" with { key: 'value' };
    }
    expect_exact: 'export{x}from"hello"with{key:"value"};'
}

import_attributes_legacy_syntax: {
    input: {
        import "hello" assert { key: 'value' };
    }
    expect_exact: 'import"hello"with{key:"value"};'
}

import_statement_mangling: {
    mangle = { toplevel: true };
    input: {
        import Foo from "foo";
        import Bar, {Food} from "lel";
        import {What as Whatever} from "lel";
        Foo();
        Bar();
        Food();
        Whatever();
    }
    expect: {
        import o from "foo";
        import m, {Food as r} from "lel";
        import {What as f} from "lel";
        o();
        m();
        r();
        f();
    }
}

export_statement_mangling: {
    mangle = { };
    input: {
        export var foo = 6;
        export function bar() { }
        export class Baz { }
        bar(foo, Baz)
    }
    expect: {
        export var foo = 6;
        export function bar() { }
        export class Baz { }
        bar(foo, Baz)
    }
}

// https://github.com/mishoo/UglifyJS2/issues/1021
regression_for_of_const: {
    input: {
        for (const x of y) {}
        for (const x in y) {}
    }
    expect: {
        for (const x of y);for (const x in y);
    }
}

// Fabio: My patches accidentally caused a crash whenever
// there's an extraneous set of parens around an object.
regression_cannot_destructure: {
    input: {
        var x = ({ x : 3 });
        x(({ x: 3 }));
    }
    expect_exact: "var x={x:3};x({x:3});";
}

regression_cannot_use_of: {
    input: {
        function of() {
        }
        var of = "is a valid variable name";
        of = { of: "is ok" };
        x.of;
        of: foo()
    }
    expect: {
        function of(){}
        var of="is a valid variable name";
        of={of:"is ok"};
        x.of;
        foo();  /* Label statement missing? No prob. */
    }
}

fat_arrow_as_param: {
    input: {
        foo(x => x);
        foo(x => x, y => y);

        foo(x => (x, x));
        foo(x => (x, x), y => (y, y));
    }
    expect_exact: "foo(x=>x);foo(x=>x,y=>y);foo(x=>(x,x));foo(x=>(x,x),y=>(y,y));"
}

default_assign: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        function f(a, b = 3) {
            console.log(a);
        }

        g = ([[] = 123]) => {};
        h = ([[x, y, z] = [4, 5, 6]] = []) => {};

        function i([[x, y, z] = [4, 5, 6]] = []) {
            console.log(b);
        };
    }
    expect: {
        function f(a) {
            console.log(a);
        }

        g = ([[] = 123]) => {};
        h = ([[x, y, z] = [4, 5, 6]] = []) => {};

        function i([[x, y, z] = [4, 5, 6]] = []) {
            console.log(b);
        };
    }
}

expansion: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        function f(a, ...b) {
            console.log(a);
        }
    }
    expect: {
        function f(a) {
            console.log(a);
        }
    }
}

issue_1613: {
  mangle = { toplevel: true };
  input: {
    const name = 1;
    const foo = {
      name
    };
  }
  expect_exact: "const n=1;const c={name:n};"
}

format_methods: {
    beautify = {
        beautify: true,
    }
    input: {
        class A extends B {constructor(a){x()} static s(b,c){y()} run(d,e,f){z()}}
    }
    expect_exact: [
        "class A extends B {",
        "    constructor(a) {",
        "        x();",
        "    }",
        "    static s(b, c) {",
        "        y();",
        "    }",
        "    run(d, e, f) {",
        "        z();",
        "    }",
        "}",
    ]
}

issue_1898: {
    options = {
    }
    mangle = {
    }
    input: {
        class Foo {
            bar() {
                for (const x of [ 6, 5 ]) {
                    for (let y of [ 4, 3 ]) {
                        for (var z of [ 2, 1 ]) {
                            console.log(x, y, z);
                        }
                    }
                }
            }
        }
        new Foo().bar();
    }
    expect: {
        class Foo {
            bar() {
                for (const f of [ 6, 5 ])
                    for (let r of [ 4, 3 ])
                        for (var o of [ 2, 1 ])
                            console.log(f, r, o);
            }
        }
        new Foo().bar();
    }
}

issue_1753: {
    mangle = { safari10: true };
    input: {
        class SomeClass {
            constructor(props) {
                let pickedSets = [];
                for (let i = 0; i < 6; i++) {
                    pickedSets.push({
                        mainDrawNumbers: [],
                        extraDrawNumbers: []
                    });
                }
            }
        }
    }
    expect: {
        class SomeClass {
            constructor(r) {
                let s = [];
                for (let a = 0; a < 6; a++)
                    s.push({
                        mainDrawNumbers: [],
                        extraDrawNumbers: []
                    });
            }
        }
    }
}

issue_1753_disable: {
    mangle = { safari10: false }
    input: {
        class SomeClass {
            constructor(props) {
                let pickedSets = [];
                for (let i = 0; i < 6; i++) {
                    pickedSets.push({
                        mainDrawNumbers: [],
                        extraDrawNumbers: []
                    });
                }
            }
        }
    }
    expect: {
        class SomeClass {
            constructor(r) {
                let s = [];
                for (let r = 0; r < 6; r++)
                    s.push({
                        mainDrawNumbers: [],
                        extraDrawNumbers: []
                    });
            }
        }
    }
}

class_extends: {
    options = {
        evaluate: true,
    }
    input: {
        function f() {
            class foo extends bar {}
            class pro extends some.prop {}
            class arr extends stuff[1 - 1] {}
            class bin extends (a || b) {}
            class seq extends (a, b) {}
            class ter extends (a ? b : c) {}
            class uni extends (!0) {}
        }
    }
    expect_exact: "function f(){class foo extends bar{}class pro extends some.prop{}class arr extends stuff[0]{}class bin extends(a||b){}class seq extends(a,b){}class ter extends(a?b:c){}class uni extends(!0){}}"
}

class_extends_class: {
    options = {
    }
    input: {
        class anon extends class {} {}
        class named extends class base {} {}
    }
    expect_exact: "class anon extends class{}{}class named extends class base{}{}"
}

class_extends_function: {
    options = {
    }
    input: {
        class anon extends function(){} {}
        class named extends function base(){} {}
    }
    expect_exact: "class anon extends function(){}{}class named extends function base(){}{}"
}

class_extends_regex: {
    options = {
    }
    input: {
        function f() {
            class rx1 extends (/rx/) {}
            // class rx2 extends /rx/ {}  // FIXME - parse error
        }
    }
    expect_exact: "function f(){class rx1 extends(/rx/){}}"
}

issue_2028: {
    options = {
        side_effects: true,
    }
    input: {
        var a = {};
        (function(x) {
            x.X = function() {
                return X;
            };
            class X {
                static hello() {
                    console.log("hello");
                }
            }
        }(a));
        a.X().hello();
    }
    expect: {
        var a = {};
        (function(x) {
            x.X = function() {
                return X;
            };
            class X {
                static hello() {
                    console.log("hello");
                }
            }
        }(a));
        a.X().hello();
    }
    expect_stdout: "hello"
}

class_expression_statement: {
    options = {
        toplevel: false,
        side_effects: false,
        unused: false,
    }
    input: {
        (class {});
        (class NamedClassExpr {});
        let expr = (class AnotherClassExpr {});
        class C {}
    }
    expect_exact: "(class{});(class NamedClassExpr{});let expr=class AnotherClassExpr{};class C{}"
}

class_expression_statement_unused: {
    options = {
        toplevel: false,
        side_effects: true,
        unused: true,
    }
    input: {
        (class {});
        (class NamedClassExpr {});
        let expr = (class AnotherClassExpr {});
        class C {}
    }
    expect_exact: "let expr=class{};class C{}"
}

class_expression_statement_unused_toplevel: {
    options = {
        toplevel: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (class {});
        (class NamedClassExpr {});
        let expr = (class AnotherClassExpr {});
        class C {}
    }
    expect_exact: ""
}

export_default_function_decl: {
    options = {
        toplevel: true,
        passes: 3,
        unused: true,
    }
    input: {
        // do not drop "unused" exports
        export default function Foo() {};
        export function Far() {};
    }
    expect_exact: "export default function Foo(){}export function Far(){}"
}

export_default_class_decl: {
    options = {
        toplevel: true,
        passes: 3,
        unused: true,
    }
    input: {
        // do not drop "unused" exports
        export default class Car {};
        export class Cab {};
    }
    expect_exact: "export default class Car{}export class Cab{}"
}

object_rest_spread: {
    mangle = {
        toplevel: true,
    }
    input: {
        var   { w: w1, ...V } = { w: 7, x: 1, y: 2 }; console.log(w1, V);
        let   { w: w2, ...L } = { w: 8, x: 3, y: 4 }; console.log(w2, L);
        const { w: w3, ...C } = { w: 9, x: 5, y: 6 }; console.log(w3, C);

        let b;
        ({ b, ...V } = { a: 1, b: 2, c: 3 }); console.log(V);
        ({ b, ...L } = { a: 4, b: 5, c: 6 }); console.log(L);

        (function({ y, ...p }){ console.log(p); })({ x: 1, y: 2, z: 3 });
        (({ y, ...p }) =>     { console.log(p); })({ x: 4, y: 5, z: 6 });

        const T = { a: 1, b: 2 }; console.log({ ...T, w: 0, ...{}, ...L, ...{K: 9} });
    }
    expect: {
        var   { w: o, ...l } = { w: 7, x: 1, y: 2 }; console.log(o, l);
        let   { w: c, ...n } = { w: 8, x: 3, y: 4 }; console.log(c, n);
        const { w: e, ...s } = { w: 9, x: 5, y: 6 }; console.log(e, s);

        let g;
        ({ b: g, ...l } = { a: 1, b: 2, c: 3 }); console.log(l);
        ({ b: g, ...n } = { a: 4, b: 5, c: 6 }); console.log(n);

        (function({ y: o, ...l }) { console.log(l); })({ x: 1, y: 2, z: 3 });
        (({ y: o, ...l }) =>      { console.log(l); })({ x: 4, y: 5, z: 6 });

        const w = { a: 1, b: 2 }; console.log({ ...w, w: 0, ...n, K: 9 });
    }
}

object_spread_unsafe: {
    options = {
        collapse_vars: true,
        evaluate: true,
        join_vars: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        var o1 = { x: 1, y: 2 };
        var o2 = { x: 3, z: 4 };
        var cloned = { ...o1 };
        var merged = { ...o1, ...o2 };
        console.log(cloned, merged);
    }
    expect: {
        var o = { x: 1, y: 2 }, l = { ...o }, x = { ...o, x: 3, z: 4 };
        console.log(l, x);
    }
}

array_spread_of_sequence: {
    mangle = {
        toplevel: true,
    }
    input: {
        var a = [1];
        console.log([...(a, a)]);
        console.log([...a, a]);
        console.log([...(a || a)]);
        console.log([...a || a]);
    }
    expect: {
        var o = [1];
        console.log([...(o, o)]);
        console.log([...o, o]);
        console.log([...o || o]);
        console.log([...o || o]);
    }
    expect_stdout: [
        "[ 1 ]",
        "[ 1, [ 1 ] ]",
        "[ 1 ]",
        "[ 1 ]",
    ]
}

object_spread_of_sequence: {
    mangle = {
        toplevel: true,
    }
    input: {
        var a = {x: 1};
        console.log({ ...(a, a) });
        console.log({ ...a, a });
        console.log({ ...(a || a) });
        console.log({ ...a || a });
    }
    expect: {
        var o = { x: 1 };
        console.log({ ...(o, o) });
        console.log({ ...o, a: o });
        console.log({ ...o || o });
        console.log({ ...o || o });
    }
}

// issue 2316
class_name_can_be_preserved_with_reserved: {
    mangle = {
        reserved: [ "Foo" ],
    }
    input: {
        function x() {
            class Foo {}
            Foo.bar;
            class Bar {}
            Bar.foo;
        }
        function y() {
            var Foo = class Foo {};
            Foo.bar;
            var Bar = class Bar {};
            Bar.bar;
        }
    }
    expect: {
        function x() {
            class Foo {}
            Foo.bar;
            class a {}
            a.foo;
        }
        function y() {
            var Foo = class Foo {};
            Foo.bar;
            var a = class a {};
            a.bar;
        }
    }
}

issue_2345: {
    options = {
        evaluate: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
        console.log([...[3, 2, 1]].join("-"));
        var a = [3, 2, 1];
        console.log([...a].join("-"));
    }
    expect: {
        console.log("3-2-1");
        var a = [3, 2, 1];
        console.log([...a].join("-"));
    }
    expect_stdout: [
        "3-2-1",
        "3-2-1",
    ]
}

issue_2349: {
    mangle = {}
    input: {
        function foo(boo, key) {
            const value = boo.get();
            return value.map(({[key]: bar}) => bar);
        }
        console.log(foo({
            get: () => [ {
                blah: 42
            } ]
        }, "blah"));
    }
    expect: {
        function foo(o, n) {
            const t = o.get();
            return t.map(({[n]: o}) => o);
        }
        console.log(foo({
            get: () => [ {
                blah: 42
            } ]
        }, "blah"));
    }
    expect_stdout: [
        "[ 42 ]",
    ]
    node_version: ">=7"
}

issue_2349b: {
    options = {
        arrows: true,
        collapse_vars: true,
        ecma: 2015,
        evaluate: true,
        inline: true,
        passes: 3,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        side_effects: true,
        unsafe_arrows: true,
        unused: true,
    }
    mangle = {
        toplevel: true,
    }
    input: {
        function foo(boo, key) {
            const value = boo.get();
            return value.map(function({[key]: bar}){ return bar; });
        }
        console.log(foo({
            get: function() {
                return  [ {
                    blah: 42
                } ];
            }
        }, "blah"));
    }
    expect: {
        console.log((
            a = "blah",
            [{ blah: 42 }].map(({[a]: l}) => l)
        ));
        var a;
    }
    expect_stdout: [
        "[ 42 ]",
    ]
    node_version: ">=7"
}

shorthand_keywords: {
    beautify = {
        ecma: 2015,
    }
    input: {
        var foo = 0,
            async = 1,
            await = 2,
            implements = 3,
            package = 4,
            private = 5,
            protected = 6,
            static = 7,
            yield = 8;
        console.log({
            foo: foo,
            0: 0,
            NaN: NaN,
            async: async,
            await: await,
            false: false,
            implements: implements,
            null: null,
            package: package,
            private: private,
            protected: protected,
            static: static,
            this: this,
            true: true,
            undefined: undefined,
            yield: yield,
        });
    }
    expect_exact: "var foo=0,async=1,await=2,implements=3,package=4,private=5,protected=6,static=7,yield=8;console.log({foo,0:0,NaN:NaN,async,await,false:false,implements:implements,null:null,package:package,private:private,protected:protected,static:static,this:this,true:true,undefined:void 0,yield});"
    expect_stdout: true
}

shorthand_safari: {
    beautify = {
        ecma: 2015,
        safari10: true,
    }
    input: {
        var ä = "PASS";
        console.log({ ä });
    }
    expect_exact: 'var ä="PASS";console.log({"ä":ä});'
    expect_stdout: true
}

array_literal_with_spread_1: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        var f = (x) => [...x][0];
        console.log(f(["PASS"]));
    }
    expect: {
        var f = x => [ ...x ][0];
        console.log(f([ "PASS" ]));
    }
    expect_stdout: "PASS"
}

array_literal_with_spread_2a: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        console.log([10, ...[], 20, ...[30, 40], 50]["length"]);
        console.log([10, ...[], 20, ...[30, 40], 50][0]);
        console.log([10, ...[], 20, ...[30, 40], 50][1]);
        console.log([10, ...[], 20, ...[30, 40], 50][2]);
        console.log([10, ...[], 20, ...[30, 40], 50][3]);
        console.log([10, ...[], 20, ...[30, 40], 50][4]);
        console.log([10, ...[], 20, ...[30, 40], 50][5]);
    }
    expect: {
        console.log([ 10, 20, 30, 40, 50 ]["length"]);
        console.log(10);
        console.log(20);
        console.log(30);
        console.log(40);
        console.log(50);
        console.log([ 10, 20, 30, 40, 50 ][5]);
    }
    expect_stdout: [
        "5",
        "10",
        "20",
        "30",
        "40",
        "50",
        "undefined",
    ]
}

array_literal_with_spread_2b: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        var x = [30, 40];
        console.log([10, ...[], 20, ...x, 50]["length"]);
        console.log([10, ...[], 20, ...x, 50][0]);
        console.log([10, ...[], 20, ...x, 50][1]);
        console.log([10, ...[], 20, ...x, 50][2]);
        console.log([10, ...[], 20, ...x, 50][3]);
        console.log([10, ...[], 20, ...x, 50][4]);
        console.log([10, ...[], 20, ...x, 50][5]);
    }
    expect: {
        var x = [30, 40];
        console.log([ 10, 20, ...x, 50 ]["length"]);
        console.log(10);
        console.log(20);
        console.log([ 10, 20, ...x, 50 ][2]);
        console.log([ 10, 20, ...x, 50 ][3]);
        console.log([ 10, 20, ...x, 50 ][4]);
        console.log([ 10, 20, ...x, 50 ][5]);
    }
    expect_stdout: [
        "5",
        "10",
        "20",
        "30",
        "40",
        "50",
        "undefined",
    ]
}

array_literal_with_spread_3a: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        console.log([10, 20][0]);
        console.log([10, 20][1]);
        console.log([10, 20][2]);

        console.log([...[], 10, 20][0]);
        console.log([...[], 10, 20][1]);
        console.log([...[], 10, 20][2]);

        console.log([10, ...[], 20][0]);
        console.log([10, ...[], 20][1]);
        console.log([10, ...[], 20][2]);

        console.log([10, 20, ...[]][0]);
        console.log([10, 20, ...[]][1]);
        console.log([10, 20, ...[]][2]);
    }
    expect: {
        console.log(10);
        console.log(20);
        console.log([ 10, 20 ][2]);

        console.log(10);
        console.log(20);
        console.log([10, 20][2]);

        console.log(10);
        console.log(20);
        console.log([10, 20][2]);

        console.log(10);
        console.log(20);
        console.log([10, 20][2]);
    }
    expect_stdout: [
        "10",
        "20",
        "undefined",
        "10",
        "20",
        "undefined",
        "10",
        "20",
        "undefined",
        "10",
        "20",
        "undefined",
    ]
}

array_literal_with_spread_3b: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        var nothing = [];
        console.log([10, 20][0]);
        console.log([10, 20][1]);
        console.log([10, 20][2]);

        console.log([...nothing, 10, 20][0]);
        console.log([...nothing, 10, 20][1]);
        console.log([...nothing, 10, 20][2]);

        console.log([10, ...nothing, 20][0]);
        console.log([10, ...nothing, 20][1]);
        console.log([10, ...nothing, 20][2]);

        console.log([10, 20, ...nothing][0]);
        console.log([10, 20, ...nothing][1]);
        console.log([10, 20, ...nothing][2]);
    }
    expect: {
        var nothing = [];
        console.log(10);
        console.log(20);
        console.log([ 10, 20 ][2]);

        console.log([...nothing, 10, 20][0]);
        console.log([...nothing, 10, 20][1]);
        console.log([...nothing, 10, 20][2]);

        console.log(10);
        console.log([10, ...nothing, 20][1]);
        console.log([10, ...nothing, 20][2]);

        console.log(10);
        console.log(20);
        console.log([10, 20, ...nothing][2]);
    }
    expect_stdout: [
        "10",
        "20",
        "undefined",
        "10",
        "20",
        "undefined",
        "10",
        "20",
        "undefined",
        "10",
        "20",
        "undefined",
    ]
}

array_literal_with_spread_4a: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        function t(x) {
            console.log("(" + x + ")");
            return 10 * x;
        }

        console.log([t(1), t(2)][0]);
        console.log([t(1), t(2)][1]);
        console.log([t(1), t(2)][2]);

        console.log([...[], t(1), t(2)][0]);
        console.log([...[], t(1), t(2)][1]);
        console.log([...[], t(1), t(2)][2]);

        console.log([t(1), ...[], t(2)][0]);
        console.log([t(1), ...[], t(2)][1]);
        console.log([t(1), ...[], t(2)][2]);

        console.log([t(1), t(2), ...[]][0]);
        console.log([t(1), t(2), ...[]][1]);
        console.log([t(1), t(2), ...[]][2]);
    }
    expect: {
        function t(x) {
            console.log("(" + x + ")");
            return 10 * x;
        }

        console.log([ t(1), t(2) ][0]);
        console.log((t(1), t(2)));
        console.log([ t(1), t(2) ][2]);

        console.log([ t(1), t(2) ][0]);
        console.log((t(1), t(2)));
        console.log([ t(1), t(2) ][2]);

        console.log([ t(1), t(2) ][0]);
        console.log((t(1), t(2)));
        console.log([ t(1), t(2) ][2]);

        console.log([ t(1), t(2) ][0]);
        console.log((t(1), t(2)));
        console.log([ t(1), t(2) ][2]);
    }
    expect_stdout: [
        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",

        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",

        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",

        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",
    ]
}

array_literal_with_spread_4b: {
    options = {
        properties: true,
        side_effects: true,
    }
    input: {
        var nothing = [];
        function t(x) {
            console.log("(" + x + ")");
            return 10 * x;
        }

        console.log([t(1), t(2)][0]);
        console.log([t(1), t(2)][1]);
        console.log([t(1), t(2)][2]);

        console.log([...nothing, t(1), t(2)][0]);
        console.log([...nothing, t(1), t(2)][1]);
        console.log([...nothing, t(1), t(2)][2]);

        console.log([t(1), ...nothing, t(2)][0]);
        console.log([t(1), ...nothing, t(2)][1]);
        console.log([t(1), ...nothing, t(2)][2]);

        console.log([t(1), t(2), ...nothing][0]);
        console.log([t(1), t(2), ...nothing][1]);
        console.log([t(1), t(2), ...nothing][2]);
    }
    expect: {
        var nothing = [];
        function t(x) {
            console.log("(" + x + ")");
            return 10 * x;
        }

        console.log([ t(1), t(2) ][0]);
        console.log((t(1), t(2)));
        console.log([ t(1), t(2) ][2]);

        console.log([ ...nothing, t(1), t(2) ][0]);
        console.log([ ...nothing, t(1), t(2) ][1]);
        console.log([ ...nothing, t(1), t(2) ][2]);

        console.log([ t(1), t(2) ][0]);
        console.log([ t(1), ...nothing, t(2) ][1]);
        console.log([ t(1), ...nothing, t(2) ][2]);

        console.log([ t(1), t(2) ][0]);
        console.log((t(1), t(2)));
        console.log([ t(1), t(2), ...nothing ][2]);
    }
    expect_stdout: [
        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",

        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",

        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",

        "(1)", "(2)", "10",
        "(1)", "(2)", "20",
        "(1)", "(2)", "undefined",
    ]
}

object_literal_method_using_arguments: {
    options = {
        arrows: true,
    }
    input: {
        console.log(({
            m() {
                return arguments[0];
            }
        }).m("PASS"));
    }
    expect: {
        console.log(({
            m() {
                return arguments[0];
            }
        }).m("PASS"));
    }
    expect_stdout: "PASS"
}

class_method_using_arguments: {
    options = {
        arrows: true,
    }
    input: {
        console.log(new class {
            m() {
                return arguments[0];
            }
        }().m("PASS"));
    }
    expect: {
        console.log(new class {
            m() {
                return arguments[0];
            }
        }().m("PASS"));
    }
    expect_stdout: "PASS"
}

issue_2676: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        class A {}
        A.a = 42;
    }
    expect: {
        (class {}).a = 42;
    }
}

issue_2762: {
    mangle = {}
    input: {
        var bar = 1, T = true;
        (function() {
            if (T) {
                const a = function() {
                    var foo = bar;
                    console.log(foo, a.prop, b.prop);
                };
                a.prop = 2;
                const b = { prop: 3 };
                a();
            }
        })();
    }
    expect: {
        var bar = 1, T = true;
        (function() {
            if (T) {
                const o = function() {
                    var p = bar;
                    console.log(p, o.prop, r.prop);
                };
                o.prop = 2;
                const r = { prop: 3 };
                o();
            }
        })();
    }
    expect_stdout: "1 2 3"
}

issue_2794_1: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 1,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        side_effects: true,
        unused: true,
    }
    input: {
        function foo() {
            for (const a of func(value)) {
                console.log(a);
            }
            function func(va) {
                return doSomething(va);
            }
        }
        function doSomething(x) {
            return [ x, 2 * x, 3 * x ];
        }
        const value = 10;
        foo();
    }
    expect: {
        function foo() {
            for (const a of doSomething(value)) console.log(a);
        }
        function doSomething(x) {
            return [ x, 2 * x, 3 * x ];
        }
        const value = 10;
        foo();
    }
    expect_stdout: [
        "10",
        "20",
        "30",
    ]
}

issue_2794_2: {
    mangle = {
        toplevel: false,
    }
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 1,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        side_effects: true,
        unused: true,
    }
    input: {
        function foo() {
            for (const a of func(value)) {
                console.log(a);
            }
            function func(va) {
                return doSomething(va);
            }
        }
        function doSomething(x) {
            return [ x, 2 * x, 3 * x ];
        }
        const value = 10;
        foo();
    }
    expect: {
        function foo() {
            for (const o of doSomething(value)) console.log(o);
        }
        function doSomething(o) {
            return [ o, 2 * o, 3 * o ];
        }
        const value = 10;
        foo();
    }
    expect_stdout: [
        "10",
        "20",
        "30",
    ]
}

issue_2794_3: {
    mangle = {
        toplevel: true,
    }
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        passes: 3,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function foo() {
            for (const a of func(value)) {
                console.log(a);
            }
            function func(va) {
                return doSomething(va);
            }
        }
        function doSomething(x) {
            return [ x, 2 * x, 3 * x ];
        }
        const value = 10;
        foo();
    }
    expect: {
        (function() {
            for (const o of [ 10, 20, 30 ]) console.log(o);
        })();
    }
    expect_stdout: [
        "10",
        "20",
        "30",
    ]
}

issue_2794_4: {
    options = {}
    input: {
        for (var x of ([1, 2], [3, 4])) {
            console.log(x);
        }
    }
    expect_exact: "for(var x of([1,2],[3,4]))console.log(x);"
    expect_stdout: [
        "3",
        "4",
    ]
}

issue_2794_5: {
    mangle = {}
    options = {
        evaluate: true,
        passes: 1,
        side_effects: true,
        unused: true,
    }
    input: {
        for (var x of ([1, 2], [3, 4])) {
            console.log(x);
        }
    }
    expect_exact: "for(var x of[3,4])console.log(x);"
    expect_stdout: [
        "3",
        "4",
    ]
}

issue_2794_6: {
    options = {
    }
    input: {
        // TODO (or not): have parser flag invalid for-of expression.
        // Consider it an uglify extension in the meantime.
        for (let e of [1,2], [3,4,5]) {
            console.log(e);
        }
    }
    expect_exact: "for(let e of([1,2],[3,4,5]))console.log(e);"
    expect_stdout: [
        "3",
        "4",
        "5",
    ]
}

inline_arrow_using_arguments: {
    options = {
        evaluate: true,
        inline: 1,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(){
            ((x) => {
                console.log.apply(console, arguments),
                console.log(x);
            })(4);
        })(3, 2, 1);
    }
    expect: {
        (function(){
            console.log.apply(console, arguments),
            console.log(4);
        })(3, 2, 1);
    }
    expect_stdout: [
        "3 2 1",
        "4",
    ]
}

issue_2874_1: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            function foo() {
                let letters = ["A", "B", "C"];
                let result = [2, 1, 0].map(key => bar(letters[key] + key));
                return result;
            }
            function bar(value) {
                return () => console.log(value);
            }
            foo().map(fn => fn());
        })();
    }
    expect: {
        (function () {
            let letters = ["A", "B", "C"];
            return [2, 1, 0].map(key => {
                return value = letters[key] + key, () => console.log(value);
                var value;
            });
        })().map(fn => fn());
    }
    expect_stdout: [
        "C2",
        "B1",
        "A0",
    ]
}

issue_2874_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            let keys = [];
            function foo() {
                var result = [2, 1, 0].map(value => {
                    keys.push(value);
                    return bar();
                });
                return result;
            }
            function bar() {
                var letters = ["A", "B", "C"], key = keys.shift();
                return () => console.log(letters[key] + key);
            }
            foo().map(fn => fn());
        })();
    }
    expect: {
        (function() {
            let keys = [];
            [ 2, 1, 0 ].map(value => {
                return keys.push(value), letters = [ "A", "B", "C" ], key = keys.shift(), () => console.log(letters[key] + key);
                var letters, key;
            }).map(fn => fn());
        })();
    }
    expect_stdout: [
        "C2",
        "B1",
        "A0",
    ]
}

issue_2874_3: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        reduce_funcs: false,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            return x + y;
        }
        let x, y;
        let a = (z) => {
            x = "A";
            y = z;
            console.log(f());
        }
        a(1);
        a(2);
    }
    expect: {
        let x, y;
        let a = z => {
            x = "A",
            y = z,
            console.log(x + y);
        };
        a(1),
        a(2);
    }
    expect_stdout: [
        "A1",
        "A2",
    ]
}

issue_3061: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: 3,
        reduce_funcs: false,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        console.log(new class extends(function(base) {
            return class extends base {};
        }(Error)){}() instanceof Error);
    }
    expect: {
        console.log(new class extends(function(base) {
            return class extends base {};
        }(Error)){}() instanceof Error);
    }
    expect_stdout: "true"
}

module_enables_strict_mode: {
    options = {
        module: true,
    }
    input: {
        if (1) {
            function xyz() {}
        }
    }
    expect: {
        if (1) {
            function xyz() {}
        }
    }
}

module_mangle_scope: {
    mangle = {
        module: true
    }
    input: {
        let a = 10;
    }
    expect: {
        let e = 10;
    }
}

module_enabled: {
    options = {
        module: true,
        reduce_vars: true,
        unused: true,
    }
    mangle = {
        module: true,
    }
    input: {
        let apple = 10, b = 20;
        console.log(apple++, b, apple++);
        export { apple };
    }
    expect: {
        let o = 10;
        console.log(o++, 20, o++);
        export { o as apple };
    }
}

issue_3028: {
    options = {
        collapse_vars: true,
        evaluate: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function a(array) {
            var shifted = array.splice(0, 2);
            return [ ...array, ...shifted ];
        }
        console.log(a([ 1, 2, 3 ]).join(" "));
    }
    expect: {
        function a(array) {
            var shifted = array.splice(0, 2);
            return [ ...array, ...shifted ];
        }
        console.log(a([ 1, 2, 3 ]).join(" "));
    }
    expect_stdout: "3 1 2"
}

issue_t80: {
    options = {
        unused: true,
    }
    input: {
        function foo(data = []) {
            var u, v = "unused";
            if (arguments.length == 1) {
                data = [data];
            }
            return data;
        }
        console.log(JSON.stringify([foo(), foo(null), foo(5, 6)]));
    }
    expect: {
        function foo(data = []) {
            if (arguments.length == 1)
                data = [data];
            return data;
        }
        console.log(JSON.stringify([foo(), foo(null), foo(5, 6)]));
    }
    expect_stdout: "[[],[null],5]"
}
