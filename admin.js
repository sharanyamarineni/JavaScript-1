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

function getButton(name, attributes) {
    let button = document.createElement("button");
    for (const [key, value] of Object.entries(attributes)) {
        button.setAttribute(key, value);
    }
    button.textContent = name;
    return button;
}

function createGallery() {
    const gallery_holder = document.getElementById("images_placeholder");
    if (!galleryObject || galleryObject.length == 0) {
        gallery_holder.innerHTML = `<h1 class="no-images">No Images in Gallery to Edit</h1>`;
        return;
    }

    let rowElement = getDivWithClass("row");
    galleryObject.forEach(element => {
        let columnElement = getDivWithClass("col-md-4");
        let cardMain = getDivWithClass("card");
        cardMain.id = element.id;
        let cardImage = document.createElement("img");
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
        let cardFooter = getDivWithClass("card-footer");
        cardFooter.appendChild(getButton("EDIT", {
            "class": "btn btn-primary",
            "data-toggle": "modal",
            "data-target": "#editModal",
            "data-id": element.id,
            "data-type": "edit"
        }))
        cardFooter.appendChild(getButton("DELETE", {
            "class": "btn btn-danger float-right",
            "data-toggle": "modal",
            "data-target": "#deleteModal",
            "data-id": element.id
        }))
        cardMain.appendChild(cardFooter);
        columnElement.appendChild(cardMain);
        rowElement.appendChild(columnElement);
    });
    gallery_holder.appendChild(rowElement);
}


let date = document.getElementById("image-date");

date.addEventListener("input", function(event) {
    if (!date || (new Date(date.value)).getTime() > (new Date()).getTime()) {
        date.setCustomValidity("Please do not enter the future date");
    } else {
        date.setCustomValidity("");
    }
});

let imageSource = document.getElementById("image-url");

imageSource.addEventListener("input", function(event) {
    console.log(imageSource.validity);
    if (imageSource.validity.patternMismatch) {
        imageSource.setCustomValidity("Please provide a valid URL.");
    } else {
        imageSource.setCustomValidity("");
    }
});

function deleteObject(id) {
    id = parseInt(id);
    galleryObject = galleryObject.filter(obj => obj.id != id);
    localStorage.setItem("galleryInfo", JSON.stringify({ galleryInfo: galleryObject }));
    location.reload();
}

$('#deleteModal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget)
    var id = parseInt(button.data('id'))
    var modal = $(this)
    console.log(galleryObject, id)
    console.log(galleryObject.find(obj => obj.id == id))
    modal.find('#deleteImagePlaceholder').attr('src', galleryObject.find(obj => obj.id == id).url);
    modal.find("#deleteSubmit").attr("onclick", `deleteObject(${id})`);
})

$('#editModal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget)
    var object = galleryObject.find(obj => obj.id == parseInt(button.data('id')))
    var modal = $(this)
    if (object) {
        var date = new Date(object.date);
        console.log(date);
        modal.find("#image-id").val(object.id);
        modal.find("#image-name").val(object.name)
        modal.find("#image-url").val(object.url)
        modal.find("#image-date").val(object.date)
        modal.find("#image-information").text(object.information)
    } else {
        modal.find("#image-id").val(null);
        modal.find("#image-name").val(null)
        modal.find("#image-url").val(null)
        modal.find("#image-date").val(null)
        modal.find("#image-information").text(null)

    }

})

$("#editForm").submit(function(event) {
    const id = parseInt($("#image-id").val())
    const name = $("#image-name").val();
    const information = $("#image-information").val();
    const date = $("#image-date").val();
    const url = $("#image-url").val();
    galleryObject.map(obj => {
        if (obj.id == id) {
            obj.name = name;
            obj.information = information;
            obj.date = (new Date(date)).getTime();
            obj.url = url;
        }
    })
    if (!id) {
        galleryObject.push({
                id: (new Date()).getTime(),
                name,
                information,
                url,
                date: (new Date(date)).getTime()
            })

    }
    localStorage.setItem("galleryInfo", JSON.stringify({ galleryInfo: galleryObject }))
    event.preventDefault();
    location.reload();
})