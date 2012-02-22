/********
* Multi Function JS Image Gallery
* Created by: Chien-Hung Chen
* Start Date: 11/15/2011
* Last Edit: 2/8/2012
********/

var SOURCEID, TAGNAME, IMGSRC, IMGTITLE, IMGDESCRIPTION, COLUMN_NUM;
var IMAGEPATH_ARR, TITLES_ARR, DESCRIPTIONS_ARR = []; 
var FULL_GALL = false;
var INDEX_GLOB = 0;

//shorten getElementById
function getElById(ID) { return document.getElementById(ID); }

//shorten createElement
function creEl(type) { return document.createElement(type); }

//Parse Gallery information from HTML
function getGalleryInfoFromHTML(id, tagName, field)
{
    var arr = []; var u, i;
    u = $("#"+id).find(tagName);
    for( i = 0; i < u.length; i++)
		arr.push($(u.get(i)).attr(field));
    return arr;
}

//Instantiation function for a Slider 
function createSliderGallery(divID, dataType, dataSource, isThumbnailBar, isAnimated)
{
    if(isThumbnailBar)
    {
        alert("thumbs");
    }
    if(isAnimated)
    {
        alert("animate");
    }
}

//function initializeTiledGallery(divID, numberOfColumns, dataType, dataSource)
function initializeTiledGallery(params)
{
    "use strict";
    var div, tempDiv1, tempDiv2, tempImg;
    SOURCEID = params.sourceID; TAGNAME = params.tagName; IMGSRC = params.imageSourceField;
	IMGTITLE = params.imageTitleField; IMGDESCRIPTION = params.imageDescriptionField; COLUMN_NUM = params.numberOfColumns;
    div = creEl("div");
    div.id = "popupGalleryHolder";
    if(params.dataType == "xml") //User is using XML
    {
        var xmlhttp;
        (window.XMLHttpRequest) ? (xmlhttp=new XMLHttpRequest()) : (xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"));
        xmlhttp.open("GET",dataSource,false);
        xmlhttp.send();
        var xmlResponse = xmlhttp.responseXML;
    }
    else if(params.dataType = "html") //user is using HTML
    {
        IMAGEPATH_ARR = getGalleryInfoFromHTML(SOURCEID, TAGNAME, IMGSRC);
        TITLES_ARR = getGalleryInfoFromHTML(SOURCEID, TAGNAME, IMGTITLE);
        DESCRIPTIONS_ARR = getGalleryInfoFromHTML(SOURCEID, TAGNAME, IMGDESCRIPTION);
        createTiledGallery(div, IMAGEPATH_ARR, TITLES_ARR, DESCRIPTIONS_ARR);
    }
    else //undefined
        alert("Check your createTiledGallery function call. Your dataType field is wrong.");
	
    getElById(params.destDivID).appendChild(div);
    tempDiv1 = creEl("div");
    tempDiv1.id = "pageWrap";
    tempDiv1.onclick = function() {rmFullView();};
    getElById(params.destDivID).appendChild(tempDiv1);
    tempDiv1 = creEl("div");
    tempDiv1.id = "fullSizeGallery";
    tempDiv2 = creEl("div");
    tempDiv2.id = "xBtn";
    tempDiv2.onclick = function() {rmFullView();};
    tempDiv1.appendChild(tempDiv2);
    tempImg = creEl("img");
    tempImg.id = "fullSizeImg";
    tempDiv1.appendChild(tempImg);
    tempDiv2 = creEl("div");
    tempDiv2.id = "backBtn";
    tempDiv1.appendChild(tempDiv2);
    tempDiv2 = creEl("div");
    tempDiv2.id = "fwdBtn";
    tempDiv1.appendChild(tempDiv2);
    tempDiv2 = creEl("div");
    tempDiv2.id = "imgTitle";
    tempDiv1.appendChild(tempDiv2);
    tempDiv2 = creEl("div");
    tempDiv2.id = "description";
    tempDiv1.appendChild(tempDiv2);
    getElById(params.destDivID).appendChild(tempDiv1);
}

//Creating the tiled part of the popup gallery
function createTiledGallery(destDiv, images, name, descriptions)
{
    "use strict";
    var i, t, tempDiv, tempSpan, tempImg, tempP, tempBr;
    for( i = 0; i < images.length; i++)
    {
        t = images[i];
        tempDiv = creEl("div");
        tempDiv.onclick = (function(imgURL, index){
            return function(){showFullImage(imgURL, index);}
        })(t, i);
        tempSpan = creEl("span");
        tempImg = creEl("img");
        tempImg.src = t;
        tempP = creEl("p");
        tempP.innerHTML = name[i];
        tempSpan.appendChild(tempImg);
        tempDiv.appendChild(tempSpan);
        tempDiv.appendChild(tempP);
        destDiv.appendChild(tempDiv);
    }
    tempBr = creEl("br");
    tempBr.clear = "all";
    destDiv.appendChild(tempBr);
}

//function to set the fullscreen gallery fields
function showFullImage(imageURL, index)
{
	FULL_GALL = true;
	INDEX_GLOB = index;
	var nextImgURL, prevImgURL;
	(index+1 < IMAGEPATH_ARR.length)?(nextImgURL = IMAGEPATH_ARR[(index+1)]):(nextImgURL = IMAGEPATH_ARR[(index)]);
	(index-1 >= 0)?(prevImgURL = IMAGEPATH_ARR[(index-1)]):(prevImgURL = IMAGEPATH_ARR[(index)]);
	var fullImg = getElById("fullSizeImg");
	fullImg.src =imageURL;
	fullImg.onclick = function(){
		if(index+1 < IMAGEPATH_ARR.length)
			showFullImage(nextImgURL, (index+1));
		else
			showFullImage(nextImgURL, (index));
	};
	var fwdImg = getElById("fwdBtn");
	fwdImg.onclick = function(){
		if(index+1 < IMAGEPATH_ARR.length)
			showFullImage(nextImgURL, (index+1));
		else
			showFullImage(nextImgURL, (index));
	};
	var bkImg = getElById("backBtn");
	bkImg.onclick = function(){
		if(index-1 >= 0)
			showFullImage(prevImgURL, (index-1));
		else
			showFullImage(prevImgURL, (index));
	};
	var ti = getElById("imgTitle");
	ti.innerHTML = TITLES_ARR[index];
	var d = getElById("description");
	d.innerHTML = DESCRIPTIONS_ARR[index];
	$("#fullSizeGallery").css({"display":"block"});
	$("#pageWrap").css({"height":($(document).height() + "px"), "display":"block"});
}

function rmFullView()
{
	FULL_GALL = false;
	$("#fullSizeGallery, #pageWrap").css({"display":"none"});
}

//Key press detection
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) //esc key
        rmFullView();
	else if (evt.keyCode == 37 && FULL_GALL) //left key
	{
		var prevImgURL;
		var images = getGalleryInfoFromHTML(SOURCEID, TAGNAME, IMGSRC);
		(INDEX_GLOB-1 >= 0)?(prevImgURL = images[(INDEX_GLOB-1)].replace(" ", "%20")):(prevImgURL = images[(INDEX_GLOB)].replace(" ","%20"));
        if(INDEX_GLOB-1 >= 0)
			showFullImage(prevImgURL, (INDEX_GLOB-1));
		else
			showFullImage(prevImgURL, (INDEX_GLOB));
    }
	else if (evt.keyCode == 39 && FULL_GALL) //right
	{
		var nextImgURL;
		var images = getGalleryInfoFromHTML(SOURCEID, TAGNAME, IMGSRC);
		(INDEX_GLOB+1 < images.length)?(nextImgURL = images[(INDEX_GLOB+1)].replace(" ", "%20")):(nextImgURL = images[(INDEX_GLOB)].replace(" ","%20"));
        if(INDEX_GLOB+1 < images.length)
			showFullImage(nextImgURL, (INDEX_GLOB+1));
		else
			showFullImage(nextImgURL, (INDEX_GLOB));
    }
};

window.onload = function(){
    var titles = $("#popupGalleryHolder").find("p");
	var divs = $("#popupGalleryHolder").find("div");
	var imgs = $("#popupGalleryHolder").find("span");
    var extended = false, i;
	for(i = 0; i < divs.length; i++)
	{
		if(i%COLUMN_NUM == 0)
			extended = false;
		if(titles[i].offsetHeight + imgs[i].offsetHeight > divs[i].offsetHeight && extended == false)
		{
			extended = true;
			x = i - i%COLUMN_NUM;
			for(j = x; j < (x + COLUMN_NUM); j++)
				$(divs[j]).css("height", (titles[i].offsetHeight + imgs[i].offsetHeight));
		}
	}
}

document.onclick = function(){
	var fullSizeImgHeight = $("#fullSizeGallery").height() - $("#imgTitle").height() - $("#description").height() -55;
	//alert($("#description").height());
	$("#fullSizeImg").css({"height":(fullSizeImgHeight + "px")});
}