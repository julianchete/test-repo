//----------------------------------------------------------------------------
//    Basic functions, used in others
//----------------------------------------------------------------------------
    function addClassName(elm, strClassName) {
      var strCurrentClass = elm.className;
      elm.className = strCurrentClass + ((strCurrentClass.length > 0)? " " : "") + strClassName;
      return elm.className;
    }
//----------------------------------------------------------------------------
    function removeClassName(elm, strClassName) {
      var classToRemove = new RegExp(("(^|\\s)" + strClassName + "(\\s|$)"), "i");
      elm.className = elm.className.replace(classToRemove, "").replace(/^\s+|\s+$/g, "");
      return elm.className;
    }
//----------------------------------------------------------------------------
    function show(layerName) {
      document.getElementById(layerName).style.display = 'block';
    }
//----------------------------------------------------------------------------
    function hide(layerName) {
      document.getElementById(layerName).style.display = 'none';
    }
//----------------------------------------------------------------------------
    function toggle(layerName) {
      var e = document.getElementById(layerName);
      if (e.style.display == 'block') {
        hide(layerName);
      }
      else {
        show(layerName);
      }
    }
//----------------------------------------------------------------------------
    function getFirstChild(elm) {
      pseudoFirstChild = elm.firstChild;
      while (pseudoFirstChild.nodeType != 1) {
        pseudoFirstChild = pseudoFirstChild.nextSibling;
      }
      return pseudoFirstChild;
    }
//----------------------------------------------------------------------------
    var getElementsByClassName = function (className, tag, elm) {
//    getElementsByClassName(className)
//    for IE that does not support native getElementsByClassName
//    Developed by Robert Nyman, http://www.robertnyman.com
//    Code/licensing: http://code.google.com/p/getelementsbyclassname/
//----------------------------------------------------------------------------
      if (document.getElementsByClassName) {
        getElementsByClassName = function (className, tag, elm) {
          elm = elm || document;
          var elements = elm.getElementsByClassName(className),
            nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
            returnElements = [],
            current;
          for(var i=0, il=elements.length; i<il; i+=1){
            current = elements[i];
            if(!nodeName || nodeName.test(current.nodeName)) {
              returnElements.push(current);
            }
          }
          return returnElements;
        };
      }
      else if (document.evaluate) {
        getElementsByClassName = function (className, tag, elm) {
          tag = tag || "*";
          elm = elm || document;
          var classes = className.split(" "),
            classesToCheck = "",
            xhtmlNamespace = "http://www.w3.org/1999/xhtml",
            namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
            returnElements = [],
            elements,
            node;
          for(var j=0, jl=classes.length; j<jl; j+=1){
            classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
          }
          try {
            elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
          }
          catch (e) {
            elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
          }
          while ((node = elements.iterateNext())) {
            returnElements.push(node);
          }
          return returnElements;
        };
      }
      else {
        getElementsByClassName = function (className, tag, elm) {
          tag = tag || "*";
          elm = elm || document;
          var classes = className.split(" "),
            classesToCheck = [],
            elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
            current,
            returnElements = [],
            match;
          for(var k=0, kl=classes.length; k<kl; k+=1){
            classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
          }
          for(var l=0, ll=elements.length; l<ll; l+=1){
            current = elements[l];
            match = false;
            for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
              match = classesToCheck[m].test(current.className);
              if (!match) {
                break;
              }
            }
            if (match) {
              returnElements.push(current);
            }
          }
          return returnElements;
        };
      }
      return getElementsByClassName(className, tag, elm);
    };
//----------------------------------------------------------------------------
    function sendPageHeight() {
//    measures current page height and sends it back to framework (top frame)
//----------------------------------------------------------------------------
      pageHeight = document.getElementById('wrapper').offsetHeight;
      try {
        top.setPageHeight(pageHeight);
      }
      catch(err) { };
    }
//----------------------------------------------------------------------------
    function showRestrictedLinks() {
//    in public pages (called using ~sapidp), all links that will let the
//    visitor run into a logon prompt are indicated
//----------------------------------------------------------------------------
      if (document.URL.toLowerCase().indexOf('~sapidp') != -1) {
        var contentArea = document.getElementById('wrapper');
        var allLinks    = contentArea.getElementsByTagName('a');
        for (i=0; i< allLinks.length; i++) {
          if (
            allLinks[i].href != '' &&
            allLinks[i].href.toLowerCase().indexOf('~sapidp') == -1 &&
            allLinks[i].href.toLowerCase().indexOf('~form/ehandler') == -1 &&
            allLinks[i].href.toLowerCase().indexOf('mailto:') == -1 &&
            allLinks[i].href.toLowerCase().indexOf('http:') == -1 &&
            allLinks[i].href.toLowerCase().indexOf('/public/') == -1 &&
            allLinks[i].href.toLowerCase().indexOf('javascript:') == -1 &&
            allLinks[i].href.charAt(0) != '#'
          ) {
            currentLinkClass      = allLinks[i].className;
            allLinks[i].className = currentLinkClass + " restricted";
            allLinks[i].title     = "Log in required";
          }
        }
      }
    }
//----------------------------------------------------------------------------
    function amendPublicLinks() {
//    remove /public/ from quicklinks once the user has signed in
//    (to avoid sending him back to the public SMP)
//----------------------------------------------------------------------------
      if (document.URL.toLowerCase().indexOf('~sapidp') == -1) {
        var allLinks = document.getElementsByTagName('a');
        for (i=0; i< allLinks.length; i++) {
          if (allLinks[i].href != '' && allLinks[i].href.toLowerCase().indexOf('/sap/support/') == -1) {
            if (allLinks[i].href.toLowerCase().indexOf('/public/') != -1) allLinks[i].href = allLinks[i].href.replace(/\/public\//i,'/');
            if (allLinks[i].href.toLowerCase().indexOf('~sapidp') != -1) allLinks[i].href = allLinks[i].href.replace(/~sapidp/i,'~sapidb');
            if (allLinks[i].href.toLowerCase().indexOf('~form/ehandler') != -1) allLinks[i].href = allLinks[i].href.replace(/~form\/ehandler/i,'~form/handler');
          }
        }
      }
    }
//----------------------------------------------------------------------------
    function alternateTable() {
//    coloring in our tables
//----------------------------------------------------------------------------
    var odd_class  = ' oddrow';
    var even_class = ' evenrow';
    var table_list = document.getElementsByTagName('table');
    for(var idx=0; idx<table_list.length; idx++) {
      var tbl_obj = table_list[idx];
      var tr_list = tbl_obj.getElementsByTagName('tr');
      for( var cnt=1; cnt<tr_list.length; cnt++ ) {
        tr_list[cnt].className += (cnt % 2) ? odd_class : even_class;
      }
    }
  }
//----------------------------------------------------------------------------
    function tableRuler() {
//    highlighting the table row which the mouse is hovering over
//    function is opitonal and started by using onload in BODY tag
//----------------------------------------------------------------------------
      if (document.getElementById && document.createTextNode) {
        var tables=document.getElementsByTagName('table');
        for (var i=0;i<tables.length;i++) {
          var trs=tables[i].getElementsByTagName('tr');
          for(var j=0;j<trs.length;j++) {
            if(trs[j].parentNode.nodeName=='TBODY' || trs[j].parentNode.nodeName=='TFOOT') {
              trs[j].onmouseover = function() {addClassName(this, 'overruled');}
              trs[j].onmouseout  = function() {removeClassName(this, 'overruled');}
            }
          }
        }
      }
      alternateTable();
    }
//----------------------------------------------------------------------------
    function showSelectedDetail(pageElement) {
//    For tab strips:
//    The tabs shall have the IDs tab1, tab2, ... ,
//    while the DIVs they open shall have IDs tab1_data, tab2_data, ...
//    (and CSS class "tabcontent").
//
//    For image rotator:
//    The thumbnail images shall have the IDs image1, image2, ... ,
//    while the DIVs they open shall have IDs image1_data, image2_data, ...
//    (and CSS class "details").
//----------------------------------------------------------------------------
      var tabStrips = getElementsByClassName(pageElement);
      for(var i=0; i<tabStrips.length; i++) {
        var tabs = getFirstChild(tabStrips[i]).getElementsByTagName('li');
        for(var j=0; j<tabs.length; j++) {
          tabs[j].onclick = function() {
            var thisSibblings = getFirstChild(this.parentNode.parentNode).childNodes;
            for(var k=0; k<thisSibblings.length; k++) {
              if (thisSibblings[k].nodeType == 1) removeClassName(thisSibblings[k], 'current');
            }
            addClassName(this, 'current');
            var thisTabsContents = this.parentNode.parentNode.childNodes;
            for(var k=1; k<thisTabsContents.length; k++) {
              if(thisTabsContents[k].tagName == 'DIV') hide(thisTabsContents[k].id);
            }
            show(this.id + '_data');
            sendPageHeight();
            return false;
          }
        }
      }
    }
//----------------------------------------------------------------------------
    function expandAccordion() {
//    For accordion effect, especially on FAQ pages
//----------------------------------------------------------------------------
      var topicList = getElementsByClassName('accordion');
      for(var i=0; i<topicList.length; i++) {
        var topics = topicList[i].childNodes;
        for(var j=0; j<topics.length; j++) {
          if (topics[j].nodeType == 1) topics[j].getElementsByTagName('a')[0].onclick = function() {
            if (this.parentNode.className == 'teaser') {
              this.parentNode.className = 'teaser selected';
            }
            else {
              this.parentNode.className = 'teaser';
            }
            sendPageHeight();
          }
        }
      }
    }
//----------------------------------------------------------------------------
    function expandReadMore() {
//----------------------------------------------------------------------------
      var expandLinks = getElementsByClassName('readmorelink');
      for(var i=0; i<expandLinks.length; i++) {
        expandLinks[i].getElementsByTagName('a')[0].onclick = function() {
          if (this.parentNode.parentNode.className == 'readmore') {
            this.parentNode.parentNode.className = 'readmore selected';
          }
          else {
            this.parentNode.parentNode.className = 'readmore';
          }
          sendPageHeight();
          return false;
        }
      }
    }
//----------------------------------------------------------------------------
    function collapseReadMore() {
//----------------------------------------------------------------------------
      var collapseLinks = getElementsByClassName('readlesslink');
      for(var i=0; i<collapseLinks.length; i++) {
        collapseLinks[i].getElementsByTagName('a')[0].onclick = function() {
          if (this.parentNode.parentNode.className == 'readmore') {
            this.parentNode.parentNode.className = 'readmore selected';
          }
          else {
            this.parentNode.parentNode.className = 'readmore';
          }
          sendPageHeight();
          return false;
        }
      }
    }
//----------------------------------------------------------------------------
    function expandAll() {
//----------------------------------------------------------------------------
      var topics = getElementsByClassName('teaser');
      for(var i=0; i<topics.length; i++) {
        topics[i].className = 'teaser selected';
      }
      sendPageHeight();
    }
//----------------------------------------------------------------------------
    function collapseAll() {
//----------------------------------------------------------------------------
      var topicList = getElementsByClassName('accordion');
      for(var i=0; i<topicList.length; i++) {
        var topics = topicList[i].getElementsByTagName('li');
        for(var j=0; j<topics.length; j++) {
          if (topics[j].className == 'teaser selected') {
            topics[j].className = 'teaser';
          }
        }
      }
      sendPageHeight();
    }
//----------------------------------------------------------------------------
    function accessKeyTopic() {
//    For drop-downs allowing visitors to access sub-sections ("Key topics")
//----------------------------------------------------------------------------
      sectionIndex = document.quicknav.topiclist.selectedIndex
      if (document.quicknav.topiclist.options[sectionIndex].value == '') {
        alert('Please make a selection.');
        document.quicknav.topiclist.focus();
      }
      else {
        top.location.href = document.quicknav.topiclist.options[sectionIndex].value;
      }
      return false;
    }
//----------------------------------------------------------------------------
    function jumpToOption(targetWin,selObj) {
//----------------------------------------------------------------------------
      eval(targetWin + ".location='" + selObj.options[selObj.selectedIndex].value + "'");
    }
//----------------------------------------------------------------------------
    function init() {
//----------------------------------------------------------------------------
      amendPublicLinks();
      alternateTable();
      expandAccordion();
      expandReadMore();
      collapseReadMore();
      showSelectedDetail('tabstrip');
      showSelectedDetail('rotator');
    }
    window.onload = init;