# ModalBox
Easy to integrate jQuery responsive Modal box / Popup window

[The plugin Modal Box](https://webgadgets.net/plugins/modal-box) helps you to create a window that pops up in front of other elements on your page. It can be used for advertisements, subscription form, uploading forms, login/register forms or for displaying a simple message to the visitor.

## Quick start

### 1. Load jQuery and include Modal box plugin files 
```html
<link rel="stylesheet" type="text/css" href="dist/modal-box.min.css" />
<script src="jquery.js" type="text/javascript"></script>
<script src="dist/modal-box.min.js" type="text/javascript"></script>
```

 ### 2. Set up your HTML 
```html
<div id="my-modal">modal box - content</div>
<button type="button" id="open-modal">Open modal</button>
```

### 3. Call the plugin 
```js
$(document).ready(function() {
    $("#my-modal").wgModal({
        triggerElement: '#open-modal',
    });
});
```

## Documentation
For the whole functionality of Modal box, see [documentation](https://webgadgets.net/plugins/modal-box/doc).
