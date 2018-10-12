if (typeof String.prototype.trim !== 'function')
{
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	}
}

var ChamStats = {
    url: location.protocol + '//ca.chameleonpower.com'
    , contentLoaded: function contentLoaded(win, fn)
    {
	    var done = false, top = true, doc = win.document, root = doc.documentElement,
	    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	    pre = doc.addEventListener ? '' : 'on',

	    init = function (e) {
	        if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
	        (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
	        if (!done && (done = true)) fn.call(win, e.type || e);
	    },

	    poll = function () {
	        try { root.doScroll('left'); } catch (e) { setTimeout(poll, 50); return; }
	        init('poll');
	    };

        if (doc.readyState == 'complete')
        {
            fn.call(win, 'lazy');
        }
        else
        {
		    if (doc.createEventObject && root.doScroll) {
			    try { top = !win.frameElement; } catch (e) { }
			    if (top) poll();
		    }
		    doc[add](pre + 'DOMContentLoaded', init, false);
		    doc[add](pre + 'readystatechange', init, false);
		    win[add](pre + 'load', init, false);
	    }
    }
    , addEvent: function addEvent(obj, type, fn)
    {
        if (obj.attachEvent)
        {
    	    obj['e' + type + fn] = fn;
    	    obj[type + fn] = function () { obj['e' + type + fn](window.event); };
    	    obj.attachEvent('on' + type, obj[type + fn]);
        }
        else
    	    obj.addEventListener(type, fn, false);
    }
    , removeEvent: function removeEvent(obj, type, fn)
    {
        if (obj.detachEvent)
        {
    	    obj.detachEvent('on' + type, obj[type + fn]);
    	    obj[type + fn] = null;
        }
        else
    	    obj.removeEventListener(type, fn, false);
    }
    , sendData: function sendData(type, data)
    {
        if (!type) return;
        var img = new Image();
        var url = this.getUrl() + '/d.png?type=' + type + '&data=' + data + '&r=' + Math.floor(Math.random() * 11000);
        var c = this.getCookie('siteid');
        if (c == '') c = this.queryStr('siteid');
        if (c != '') url += '&siteid=' + c;
        c = this.getCookie('userid');
        if (c != '') url += '&uid=' + c;
        img.src = url;
    }
    , queryStr: function queryStr(name)
    {
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search.toLowerCase()) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }
    , getCookie: function getCookie(cname)
    {
	    var name = cname.toLowerCase() + "=";
	    var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++)
        {
		    var c = ca[i].trim();
		    if (c.toLowerCase().indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
    }
    , getUrl: function getUrl()
    {
        if (this.url) return this.url;
        var arr = window.location.href.split("/");
        return arr[0] + "//" + arr[2];
    }
    , hasClass: function hasClass(el, sel)
    {
        if(!el) return false;
        var c = el.getAttribute('className') || el.getAttribute('class');
        return ((" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + sel + " ") > -1);
    }
};

ChamStats.contentLoaded(window, function ()
{
	ChamStats.sendData('load', '&ref=' + encodeURIComponent(document.referrer));
	var body = document.getElementsByTagName('body')[0];
    ChamStats.addEvent(body, 'click', function (e)
    {
        //todo touch event
		//https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
		e = e || window.event; 
		var el = e.target || e.srcElement;
        while (el != null && !ChamStats.hasClass(el, 'ChamStats'))
        {
			if (el.tagName.toLowerCase() == 'body') return;
			el = el.parentNode;
		}
        if (ChamStats.hasClass(el, 'ChamStats'))
        {
            // TODO: capture mouse coordinates here for possibly heat map?
			ChamStats.sendData(el.getAttribute('data-csaction'),  encodeURIComponent(el.getAttribute('data-csdata') || ''));
		}
	});
});