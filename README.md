# js-mention
@ mention / tag input plugin using plain JavaScript

![example](https://github.com/sean-codes/js-mention/blob/master/js-mention.gif?raw=true)

Demo: [demo](https://sean-codes.github.io/js-mention/demo/reversed.html)


## Include:
```html
  <link rel="stylesheet" href="/mention.css">
  <script src="/mention.js">
```

## Basic:
> Each option only requires a name field

```js
  var myMention = new Mention({
      input: document.getElementById('myTextArea'),
      options: [
         { name: 'WideEye' },
         { name: 'LiquidLuck' },
         { name: 'PolyJuice' }
      ]
   })
```

## Get the mentions

```js
   var mentions = myMention.collect()
```

## Settings

### Watch for changes

When defining the mention object add update function
```js
  var myMention = new Mention({
    ...
    ,
    update: function() {
       console.log(this.collect())
    }
  })
```

### Option display template

When defining the mention object add template function.
```js
  var myMention = new Mention({
    ...
    ,
    template: function(option) {
       return '@' + option.name
    }
  })
```

### Match / Search function

When defining the mention object add match function.
```js
  var myMention = new Mention({
    ...
    ,
    match: function(word, option) {
       // Match not case sensitive
       return option.name.toLowerCase().startsWith(word.toLowerCase())
    }
  })
```
