import { baseURL } from "./config.js";
import * as helpers from "./helpers.js";

export function AppController(options) {
    var self = this;

    this.getItems = () => {
        let user_id = localStorage.getItem("user_id");
        if (user_id == null) return;

        return fetch(baseURL + `/api/users/${user_id}/list_items`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                res["hydra:member"].forEach((item) => {
                    this.addDOMItem(item.title, item.id, item.entries.length);
                });
            })
            .catch((error) => {});
    };

    this.getEntries = (id) => {
        fetch(baseURL + `/api/list_items/${id}/entries`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                let box_items = document.querySelector("#entry__items");
                box_items.innerHTML = "";
                this.noEntries("no entries");
                res["hydra:member"].forEach((entry) => {
                    this.addDOMEntry(entry);
                });
            })
            .catch((error) => {});
    };

    this.postItem = () => {
        let user_id = localStorage.getItem("user_id");
        if (user_id == null) return;

        let data = {
            title: this.input_item_value,
        };

        return fetch(baseURL + `/api/list_items`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.addDOMItem(res.title, res.id, res.entries.length);
            })
            .catch((error) => {});
    };

    this.postEntry = (id) => {
        // let imageFile = this.files ? [this.files[0], this.files[0].name] : null;
        let data = {
            text: this.input_entry_value,
            listItem: `/api/list_items/${id}`,
        };

        return fetch(baseURL + `/api/entries`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.updateEntriesCounter(id, res.listItem.entriesCount);
                return res;
            })
            .catch((error) => {});
    };

    this.postImage = (id) => {
        if (typeof self.files == "undefined") return false;

        let data = new FormData();
        data.append("imageFile", this.files[0], this.files[0].name);
        data.append("entry_id", id);

        return fetch(baseURL + `/api/upload`, {
            method: "POST",
            body: data,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
                // "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.files = null;
                return res;
            })
            .catch((error) => {});
    };

    this.deleteItem = (id) => {
        return fetch(baseURL + `/api/list_items/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {})
            .catch((error) => {});
    };

    this.deleteEntry = (id) => {
        return fetch(baseURL + `/api/entries/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {})
            .catch((error) => {});
    };

    this.addDOMItem = (value, id, entries = 0) => {
        let box_items = document.querySelector("#item__items");

        let no_content = box_items.querySelector(".no-content");
        if (no_content) box_items.removeChild(no_content);

        let box_item = document.createElement("div");
        box_item.setAttribute("item", id);
        box_item.classList.add("box__item");

        let html = `
      <div class="item__col">
         <div class="item__title">${value}</div>
         <div class="item__entries">
            <div class="entries__text">Entries</div>
            <div class="entries__counter">${entries}</div>
         </div>
      </div>

      <div class="item__col">
         <i class="far fa-edit item__icon" id="icon__edit"></i>
         <i class="fas fa-trash item__icon" id="icon__delete"></i>
      </div>
      `;
        box_item.innerHTML = html;

        let icon = box_item.querySelector("#icon__delete");
        icon.addEventListener(
            "click",
            helpers.debounce((e) => {
                let item = helpers.getFirstElementByClassName(e.target, "box__item");
                let item_id = item.getAttribute("item");
                this.deleteItem(item_id).then(() => {
                    this.removeDOMItem(item_id);
                    this.noItems("no items");
                });
            }, 300)
        );

        let icon_edit = box_item.querySelector("#icon__edit");
        icon_edit.addEventListener(
            "click",
            helpers.debounce((e) => {
                options.modalItem(e.target);
            }, 300)
        );

        let col = box_item.querySelector(".item__col");
        col.addEventListener(
            "click",
            helpers.debounce((e) => {
                let item = helpers.getFirstElementByClassName(e.target, "box__item");
                let id = item.getAttribute("item");
                let name = item.querySelector(".item__title").innerHTML;

                if (item.classList.contains("item__active")) {
                    this.editHeader(id, "Entries");
                    document.querySelector("#entry__items").innerHTML = "";
                    this.noEntries("no item selected");
                } else {
                    this.editHeader(id, name);
                    this.getEntries(id);
                    this.enableInput();
                }
                this.removeClass(e.target);
                this.addClass(e.target);
            }, 300)
        );

        box_items.prepend(box_item);
    };

    this.addDOMEntry = (entry) => {
        let box_entries = document.querySelector("#entry__items");

        let no_content = box_entries.querySelector(".no-content");
        if (no_content) box_entries.removeChild(no_content);

        let box__entry = document.createElement("div");
        box__entry.classList.add("box__entry");
        box__entry.setAttribute("entry", entry.id);

        let imgPath = entry.imgPath ? baseURL + "/uploads/images/entries/" + entry.imgPath : "";

        let html = `
      <div class="item__body">
         <div class="item__text">${entry.text}</div>
         <div class="entry__img">
            <img class="img__img" src=${imgPath}>
         </div>
         <div class="item__datetime">${helpers.timeAgo(entry.createdAt)}</div>
      </div>
      <div class="item__icons">
         <i class="far fa-edit item__icon" id="icon__entry-edit"></i>
         <i class="fas fa-trash item__icon" id="icon__entry-delete"></i>
      </div>
      `;
        box__entry.innerHTML = html;

        if (imgPath == "") {
            let box_img = box__entry.querySelector(".entry__img");
            box_img.style.display = "none";
        }

        let icon_delete = box__entry.querySelector("#icon__entry-delete");
        icon_delete.addEventListener(
            "click",
            helpers.debounce((e) => {
                let entry = helpers.getFirstElementByClassName(e.target, "box__entry");
                let entry_id = entry.getAttribute("entry");
                this.deleteEntry(entry_id).then(() => {
                    this.removeDOMEntry(entry_id);
                    this.noEntries("no entries");
                });
            }, 300)
        );

        let icon_edit = box__entry.querySelector("#icon__entry-edit");
        icon_edit.addEventListener(
            "click",
            helpers.debounce((e) => {
                options.modalEntry(e.target);
            }, 300)
        );

        box_entries.prepend(box__entry);
    };

    this.removeDOMItem = (id) => {
        let box_items = document.querySelector(".box__items");
        let box_item = document.querySelector(`[item="${id}"]`);
        box_items.removeChild(box_item);

        let opened_id = document.querySelector("#entries__header").getAttribute("item");

        if (opened_id == id) {
            document.querySelector(".text__entry-header").innerHTML = "Entries";
            document.querySelector("#entry__items").innerHTML = "";
            this.noEntries("no item selected");
        }
    };

    this.removeDOMEntry = (id) => {
        let box_items = document.querySelector("#entry__items");
        let box_item = document.querySelector(`[entry="${id}"]`);
        box_items.removeChild(box_item);
    };

    this.getItemIdForEntry = () => {
        let elem = document.querySelector("#entries__header");
        let id = elem.getAttribute("item");

        return id;
    };

    this.addEv = () => {
        this.input_item = document.querySelector(".input__footer");
        this.icon_item = document.querySelector("#icon__add");

        this.icon_item.addEventListener(
            "click",
            helpers.debounce(async (e) => {
                if (this.input_item.value.trim().length > 0) {
                    this.input_item_value = this.input_item.value;
                    this.input_item.value = "";
                    this.postItem();
                }
            }, 300)
        );

        this.input_item.addEventListener(
            "keyup",
            helpers.debounce(async (e) => {
                if (e.key == "Enter") {
                    if (e.target.value.trim().length > 0) {
                        this.input_item_value = this.input_item.value;
                        this.input_item.value = "";
                        this.postItem();
                    }
                }
            }, 300)
        );

        self.input_entry = document.querySelector("#input__add-entry");
        self.icon_item = document.querySelector("#icon__add-entry");

        self.icon_item.addEventListener(
            "click",
            helpers.debounce(async (e) => {
                if (self.input_entry.value.trim().length > 0) {
                    self.input_entry_value = self.input_entry.value;
                    self.input_entry.value = "";
                    let icon = document.querySelector("#icon__add-img");
                    icon.classList.remove("icon__active");
                    self.postEntry(self.getItemIdForEntry()).then((res) => {
                        if (self.files) {
                            self.postImage(res.id).then((res) => {
                                this.addDOMEntry(res);
                            });
                        } else {
                            this.addDOMEntry(res);
                        }
                    });
                }
            }, 300)
        );

        self.input_entry.addEventListener(
            "keydown",
            helpers.debounce(async (e) => {
                if (e.key == "Enter") {
                    e.preventDefault();
                    if (self.input_entry.value.trim().length > 0) {
                        self.input_entry_value = self.input_entry.value;
                        self.input_entry.value = "";
                        let icon = document.querySelector("#icon__add-img");
                        icon.classList.remove("icon__active");
                        self.postEntry(self.getItemIdForEntry()).then((res) => {
                            if (self.files) {
                                self.postImage(res.id).then((res) => {
                                    this.addDOMEntry(res);
                                });
                            } else {
                                this.addDOMEntry(res);
                            }
                        });
                    }
                }
            }, 300)
        );

        // self.input_entry.addEventListener("keyup", async (e) => {
        //    if (e.key == "Enter") {
        //       if (e.target.value.trim().length > 0) {
        //          self.input_entry_value = self.input_entry.value;
        //          self.input_entry.value = "";
        //          let icon = document.querySelector("#icon__add-img");
        //          icon.classList.remove("icon__active");

        //          self.postEntry(self.getItemIdForEntry()).then((res) => {
        //             if (self.files) {
        //                self.postImage(res.id).then((res) => {
        //                   this.addDOMEntry(res);
        //                });
        //             } else {
        //                this.addDOMEntry(res);
        //             }
        //          });
        //       }
        //    }
        // });

        self.upload = document.querySelector("#input__entry-image");
        self.upload.addEventListener("change", (e) => {
            let icon = document.querySelector("#icon__add-img");
            if (!e.target.files.length) {
                icon.classList.remove("icon__active");
            } else {
                icon.classList.add("icon__active");
                self.files = e.target.files || e.dataTransfer.files;
            }
        });
    };

    this.removeClass = (elem) => {
        let items = document.querySelectorAll(".box__item");
        items.forEach((item) => {
            if (item == helpers.getFirstElementByClassName(elem, "box__item")) return;
            else item.classList.remove("item__active");
        });
    };

    this.editHeader = (id, name) => {
        let header = document.querySelector("#entries__header");
        header.setAttribute("item", id);

        let header_text = document.querySelector(".text__entry-header");
        header_text.innerHTML = name;
    };

    this.addClass = (elem) => {
        helpers.getFirstElementByClassName(elem, "box__item").classList.toggle("item__active");
    };

    this.updateEntriesCounter = (id, count) => {
        let item = document.querySelector(`[item="${id}"]`);
        let counter = item.querySelector(".entries__counter");
        counter.innerHTML = count;
    };

    this.noEntries = (text) => {
        let entry_items = document.querySelector("#entry__items");
        let count = entry_items.querySelectorAll(".box__entry").length;

        if (count < 1) {
            let html = `
         <div class="no-content">${text}</div>
         `;
            entry_items.innerHTML = html;

            if (text == "no item selected") {
                this.disableInput();
            }

            return true;
        }

        return false;
    };

    this.noItems = (text) => {
        let item_items = document.querySelector("#item__items");
        let count = item_items.querySelectorAll(".box__item").length;

        if (count < 1) {
            let html = `
         <div class="no-content">${text}</div>
         `;
            item_items.innerHTML = html;

            return true;
        }

        return false;
    };

    this.disableInput = () => {
        let input_entry = document.querySelector("#input__add-entry");
        let input_entry_img = document.querySelector("#input__entry-image");

        input_entry.setAttribute("disabled", "disabled");
        input_entry_img.setAttribute("disabled", "disabled");
    };

    this.enableInput = () => {
        let input_entry = document.querySelector("#input__add-entry");
        let input_entry_img = document.querySelector("#input__entry-image");

        input_entry.removeAttribute("disabled");
        input_entry_img.removeAttribute("disabled");
    };

    this.unlockFields = () => {
        let input_item = document.querySelector(" #input__add-item");
        input_item.removeAttribute("disabled");
    };

    this.init = async () => {
        this.addEv();
        this.unlockFields();
        await this.getItems();
        this.noItems("no items");
        this.noEntries("no item selected");
    };

    this.init();
}
