// ==UserScript==
// @id          MaximumPC-Trolls-Interpreter
// @name        MaximumPC: Trolls Interpreter / Remover
// @namespace   V@no
// @author      V@no
// @description Translate troll's comments into blah sentences or simply hide them.
// @include     http://maximumpc.com/*
// @include     http://www.maximumpc.com/*
// @version     1.0
// @grant       none
// ==/UserScript==

var list = cookieGet("trolls", "RUSENSITIVESWEETNESS"),
		trollHide = Number(cookieGet("trollHide")) ? 1 : 0,
		trollSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M1cbXjNgAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMi8yOC8xMZSAjI8AAAA/UExURf///wAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCw0NDQ8PDxAQEBISEhMTExYWFvr6+v////L9RbYAAAABdFJOUwBA5thmAAAAZklEQVQYGY3BWw6CMABFwXtQKLZafJz9r1WaaPgycSb5wwys8KT1DFcPZIeHlgQBZ5jcbUnTByq4oDXpopMDd88JWlCZEEtSKUsHRCUJr1W8iVqTIBeWAirZ4Rdk6A6cWPMBHfLbGzqjB8v8i7F/AAAAAElFTkSuQmCC";

list = list.split("+");
if (list[0] === "")
	list.splice(0,1);

function cookieSet(cookieName, cookieValue, lifeTime)
{
	lifeTime = typeof(lifeTime) == "undefined" ? 31536000 : lifeTime;
	if (!cookieName)
		return;
	document.cookie = escape(cookieName) + "=" + escape(cookieValue) +
		";expires=" + (new Date((new Date()).getTime() + (1000 * lifeTime))).toGMTString() + ";path=/";
}

function cookieGet(cookieName, d)
{
	d = typeof(d) == "undefined" ? null : d;
	var cookieJar = document.cookie.split("; ");
	for (var x = 0; x < cookieJar.length; x++)
	{
		var oneCookie = cookieJar[x].split("=");
		if (oneCookie[0] == escape(cookieName))
			return unescape(oneCookie[1]);
	}
	return d;
}

function censor(a, b, c, d, e)
{
	var p = "blah",
			r = "",
			caps = true,
			t,
			i,
			isStr = isNaN(a.replace(/['`].*/, ''));

	if ((a.length < 2 && isStr) || (a.length < 5 && a.match(/['`]/) && isStr))
		return a;
//		return "";
	for(i = 0; i < a.length; i++)
		if (a[i] == a[i].toLowerCase())
		{
			caps = false;
			break;
		}

	for(i = 0; i < p.length; i++)
	{
		t = p[i];

		if (caps || (a.length > i && a[i] != a[i].toLowerCase()))
			t = t.toUpperCase();

		r += t;
	}
	return r;
}
function toggleTroll(comment, f)
{
	//f = 0: orig
	//f = 1: troll
	//f = 2: toggle
	f = typeof(f) == "undefined" ? 2 : f;
	if (f == 1 || (f == 2 && comment.innerHTML == comment.origHTML))
	{
		if (!("trollHTML" in comment))
			comment.trollHTML = getText(comment);

		if (trollHide)
			comment.innerHTML = '<img src="' + trollSrc + '" class="trollComment">';
		else
			comment.innerHTML = comment.trollHTML;
	}
	else
	{
		comment.innerHTML = comment.origHTML;
	}
}
function getText(obj)
{
	var c = obj.childNodes;
	for(var i = 0; i < c.length; i++)
	{
		if (c[i].nodeName == "#text")
			c[i].nodeValue = c[i].nodeValue.replace(/(\w+(['`]\w+)?)/g, censor);
		else if (c[i].childNodes.length)
			getText(c[i]);
	}
	return obj.innerHTML;
}

function checkbox(id, text, checked, callback, p)
{
	id = typeof(id) == "undefined" ? null : id;
	text = typeof(text) == "undefined" ? "" : text;
	checked = typeof(checked) == "undefined" ? false : checked;
	callback = typeof(callback) == "undefined" ? function(){} : callback;
	p = typeof(p) == "undefined" ? true : p;
	var input = document.createElement("input"),
			label = document.createElement("label"),
			span = document.createElement("div");
	input.type = "checkbox";
	input.id = id ? id : "c" + Date().getTime();
	input.checked = checked;
	label.htmlFor = input.id;
	label.appendChild(document.createTextNode(text));
	span.appendChild(input);
	span.appendChild(label);
	input.addEventListener("change", callback, p);
	return span;
}
var root = document.getElementById("site-menu").getElementsByTagName("ul")[0],
		style = document.createElement("style"),
		li = root.lastChild.cloneNode(true),
		a = li.getElementsByTagName("a")[0],
		div = li.getElementsByTagName("div")[0],
		divSettings = div.getElementsByTagName("div")[1];

style.innerHTML = '.trollComment{cursor:pointer;opacity: 0.4;transform:scaleX(-1)}a[troll="false"]+.troll{opacity: 0.1;transform: scaleX(-1);}.troll{cursor:pointer;margin-left:0.5em;}.trollMenuImg{vertical-align: top;}.trollBox{height: auto; line-height: 1.3em;}';
document.getElementsByTagName("head")[0].appendChild(style);

div.getElementsByTagName("div")[0].innerHTML = "";
divSettings.parentNode.className = "menu-pulldown nosubpage";
root.lastChild.className = root.lastChild.className.replace(" last", "");
a.href = "javascript:return void(0);";
a.innerHTML = '<img src="' + trollSrc + '" class="trollMenuImg">';
divSettings.innerHTML = "";
div.style.width = "auto";
root.appendChild(li);
divSettings.appendChild(checkbox("trollHide", "Hide troll's posts", (trollHide), function(e)
{
	trollHide = e.target.checked ? 1 : 0;
	cookieSet("trollHide", trollHide);
	init();
}, true));

//not finished
function makeList()
{
	return;
/*
	listBox.innerHTML = "";
	var a = document.createElement("a"),
			box = document.createElement("p");
	a.href = "#";
	var l = [],
			i;
	for(i = 0; i < list.length; i++)
		l[i] = list[i];
	l.sort(function(a, b)
	{
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	for(i = 0; i < l.length; i++)
	{
		a = a.cloneNode(true),
		box = box.cloneNode(false);
		a.innerHTML = l[i];
		box.appendChild(a);
		listBox.appendChild(box);
	}
*/
}
/*
		
		img = document.createElement("img");
		img.src = trollSrc;
		img.className = "troll trollmenu";
//		box.className = "trollmenu";
		box.appendChild(img);
		root.appendChild(box);
*/
function isScrolledIntoView(elem)
{
	var docViewTop = window.pageYOffset;
	var docViewBottom = docViewTop + window.innerHeight;
	
	var elemTop = elem.offsetTop;
	var elemBottom = elemTop + elem.offsetHeight;
	
	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
function init()
{
	var names = document.evaluate('.//a[@title="View user profile."]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for(var i = 0; i < names.snapshotLength; i++)
	{
		var name = names.snapshotItem(i),
				isTroll = list.indexOf(name.innerHTML) != -1;

		name.setAttribute("troll", isTroll);

		var xPathRes = document.evaluate('.//div[@class="content"]', name.parentNode.parentNode.parentNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var n = 0; n < xPathRes.snapshotLength; n++)
		{
			(function()
			{
				var comment = xPathRes.snapshotItem(n),
						_name = name;
				if (!("origHTML" in comment))
				{
					comment.origHTML = comment.innerHTML;
					comment.addEventListener("click", function(e)
					{
						if (comment.innerHTML != comment.origHTML)
							toggleTroll(comment);
					}, true);
					comment.addEventListener("dblclick", function(e)
					{
						if (_name.getAttribute("troll") == "true")
							toggleTroll(comment);
					}, true);
				}
				toggleTroll(comment, isTroll ? 1 : 0);
			})();
		}
		makeList();
		if (name.inited)
			continue;
	
		name.inited = true;
		var img = document.createElement("img");
		
		img.className = "troll";
		img.src = trollSrc;
		img.addEventListener("click", function(e)
		{
			var isTroll = list.indexOf(e.target.previousSibling.innerHTML);
			if (isTroll != -1)
				list.splice(isTroll, 1);
			else
				list[list.length] = e.target.previousSibling.innerHTML;
			cookieSet("trolls", list.join("+"));
			var o = e.target.offsetTop - window.scrollY;
			init();
			window.scrollTo(window.scrollX, e.target.offsetTop - (o));
		}, true);
		name.parentNode.appendChild(img);
	}
}
init();