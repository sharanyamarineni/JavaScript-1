/**
 * 
 */
let galleryObject;

$(function() {
    if (!galleryObject && !localStorage.getItem("galleryInfo")) {
        $.getJSON("info.json", function(data) {
            galleryObject = data;
            localStorage.setItem("galleryInfo", JSON.stringify(data));
        });
    } else {
        galleryObject = JSON.parse(localStorage.getItem("galleryInfo"));        
    }
    galleryObject = galleryObject && galleryObject.galleryInfo ? galleryObject.galleryInfo : null;
    createGallery();

});


function getDivWithClass(className) {
    let div = document.createElement("div");
    div.className = className;
    return div;
}

function createGallery() {
    const gallery_holder = document.getElementById("images_placeholder");
    if (!galleryObject || galleryObject.length == 0) {
        gallery_holder.innerHTML = `<h5 class="no-images">No Images in Gallery to Edit</h5>`;
        return;
    }

    let rowElement = getDivWithClass("row");
    let len = document.createElement("h3");
	len.textContent=`Total ${galleryObject.length} results`
	rowElement.appendChild(len);
    galleryObject.forEach(element => {
        let columnElement = getDivWithClass("col-md-4");
        let cardMain = getDivWithClass("card");
        cardMain.id = element.id;
        let cardImage = document.createElement("img");
        cardImage.id = "images";
        cardImage.src = element.url;
        cardImage.className = "card-img-top";
        cardImage.alt = element.name;
        cardMain.appendChild(cardImage);
        let cardBody = getDivWithClass("card-body");
        let cardBodyText = document.createElement("p");
        cardBodyText.className = "card-text";
        cardBodyText.textContent = element.information;
        cardBody.appendChild(cardBodyText);
        cardMain.appendChild(cardBody);
        columnElement.appendChild(cardMain);
        rowElement.appendChild(columnElement);
    });
    gallery_holder.appendChild(rowElement);
}
/*function enlarge(){
	document.getElementById('images').style.height="100%";
 document.getElementById('images').style.width="100%";
 document.getElementById('images').style.position='absolute';
}
function reset(){
	
 document.getElementById('images').style.height=200px;
 document.getElementById('images').style.width="80%";
 document.getElementById('images').style.position='absolute';
}*/





