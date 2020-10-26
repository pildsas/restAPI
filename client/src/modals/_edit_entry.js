import * as helpers from "../helpers.js";
import { baseURL } from "../config.js";

export function EditEntry(options) {
   const self = this;

   self.renderModal = async () => {
      self.data = await self.getData();

      self.container = document.getElementById(options.id);
      self.container.innerHTML = self.html();
      self.container.style = null;
      self.container.style.display = "block";
      self.container.style.opacity = 1;

      /**
       * MAIN OVERLAY
       */
      if (options.secondary_overlay == undefined) {
         self.overlay = self.container.querySelector(".overlay");
         self.overlay.style.display = "block";
      }

      /**
       * MODAL OVERLAY
       */
      if (options.secondary_overlay !== undefined) {
         self.secondary_overlay = document.querySelector(options.secondary_overlay);
         self.secondary_overlay.style.display = "block";
         self.secondary_overlay.style.background = options.secondary_overlay_bg;
      }

      /**
       * ITEM OVERLAY
       */
      if (options.item_overlay !== undefined) {
         self.item_overlay = helpers.getFirstElementByClassName(options.target, options.item_overlay);
         self.item_overlay.style.display = "block";
         self.item_overlay.style.background = options.item_overlay_bg;
         // self.item_overlay.style.zIndex = "999";
      }
   };

   self.previewImage = () => {
      self.img_attached = false;

      self.inpFile = self.container.querySelector(".input__entry-img");
      self.previewImage = self.container.querySelector(".preview__img");
      self.previewText = self.container.querySelector(".preview__text");
      self.btnClear = self.container.querySelector(".img-attached__btn-clear");

      self.inpFile.addEventListener("change", function () {
         self.remove_img = false;
         self.file = this.files[0];
         if (self.file) {
            self.reader = new FileReader();
            self.previewText.style.display = "none";
            self.previewImage.style.display = "block";
            self.reader.addEventListener("load", function () {
               self.previewImage.setAttribute("src", this.result);
            });

            self.reader.readAsDataURL(self.file);
            self.img_attached = true;
         } else {
            self.previewText.style.display = null;
            self.previewImage.style.display = null;
            self.img_attached = false;
         }
      });

      self.btnClear.addEventListener("click", () => {
         self.inpFile.value = null;
         self.previewText.style.display = null;
         self.previewImage.style.display = null;
         self.img_attached = false;
         self.remove_img = true;
      });
   };

   self.addEv = () => {
      let btn_submit = self.container.querySelector(".btn__modal-submit");
      btn_submit.addEventListener("click", async (e) => {
         e.preventDefault();

         self.prepareFetch();
         self.response = await self.fetchData();
         self.responseImg = await self.postImage();

         if (self.responseImg) {
            self.updateDOM(self.responseImg);
         } else {
            self.updateDOM(self.response);
         }

         if (options.onsubmit) options.onsubmit(self.response);
         self.hideModal();
      });

      let btn_cancel = self.container.querySelector(".btn__modal-cancel");
      btn_cancel.addEventListener("click", (e) => {
         self.hideModal();
      });

      let btn_close = self.container.querySelector(".btn__modal-close");
      btn_close.addEventListener("click", self.hideModal);
   };

   self.getData = async () => {
      self.id = helpers.getFirstElementByClassName(options.target, "box__entry").getAttribute("entry");
      // self.fetch_body = new FormData();
      // self.fetch_body.append("id", self.id);
      self.url = baseURL + `/api/entries/${self.id}`;

      return fetch(self.url, {
         method: "GET",
         headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt_token"),
         },
      })
         .then((res) => {
            return res.json();
         })
         .then((res) => {
            return res;
         });
   };

   self.addValues = () => {
      self.container.querySelector(".input__text").value = self.data.text.trim();

      if (self.data.imgPath) {
         self.previewImage.setAttribute("src", baseURL + "/uploads/images/entries/" + self.data.imgPath);
         self.previewText.style.display = "none";
         self.previewImage.style.display = "block";
      }
   };

   self.prepareFetch = () => {
      self.id = helpers.getFirstElementByClassName(options.target, "box__entry").getAttribute("entry");
      self.url = baseURL + `/api/entries/${self.id}`;

      self.text = self.container.querySelector("#input__text").value.trim();
      self.image = self.container.querySelector(".input__entry-img").files[0];

      self.fetch_body = {
         text: self.text,
      };
   };

   self.fetchData = async () => {
      self.promise = fetch(self.url, {
         method: "PUT",
         body: JSON.stringify(self.fetch_body),
         headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            "Content-Type": "application/json",
         },
      })
         .then((res) => {
            return res.json();
         })
         .then((res) => {
            return res;
         });
      return self.promise;
   };

   self.postImage = () => {
      if (typeof self.image == "undefined" && !self.remove_img) return false;

      let data = new FormData();
      data.append("entry_id", self.id);
      if (self.image) data.append("imageFile", self.image, self.image.name);
      if (self.remove_img) data.append("remove_img", self.remove_img);

      return fetch(baseURL + `/api/upload`, {
         method: "POST",
         body: data,
         headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt_token"),
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

   self.updateDOM = (res) => {
      let entry = document.querySelector(`[entry = "${res.id}"]`);

      let imgPath = res.imgPath ? baseURL + "/uploads/images/entries/" + res.imgPath : "";
      let box_img = entry.querySelector(".entry__img");
      if (imgPath == "") {
         box_img.style.display = "none";
      } else {
         entry.querySelector(".img__img").setAttribute("src", imgPath);
         entry.querySelector(".item__text").innerHTML = res.text;
         box_img.style.display = null;
      }
   };

   self.hideModal = () => {
      let overlay = document.querySelector(".overlay");
      if (overlay !== null || typeof overlay == "undefined") {
         self.container.innerHTML = "";
         self.container.style.display = "none";
      }
      if (self.secondary_overlay) self.secondary_overlay.style.display = null;
      if (self.item_overlay) self.item_overlay.style.display = null;
   };

   self.html = () => {
      let html = `
      <div class='overlay'></div>
         <div class='modal__window ${options.style_class}'>
            <div class="modal__header">
               <h5 class="text__modal-header">Edit entry</h5>
               <i class="fas fa-times btn__modal-close"></i>
            </div>
            <div class="modal__body">
               <div class="form__edit-entry">
   
                  <div class="input-group">
                     <textarea name="" cols="30" rows="10" class="input-group__input input__text" id="input__text" placeholder="Entry Text"></textarea>
                  </div>
   
                  <div class="input-group__img-attached">
                     <label for="input__entry-img" class="img-attached__btn-upload">
                        <i class="fas fa-image"></i>
                     </label>
                     <div class="img-attached__btn-clear">
                        <i class="fas fa-times"></i>
                     </div>
                     <div class="img-attached__preview">
                        <img src="" alt="Cover Preview" class="preview__img">
                        <span class="preview__text">Preview Image</span>
                     </div>
                     <input type="file" class="input-group__input input__entry-img" id="input__entry-img">
               </div>
               </div>
            </div>
            <div class="modal__footer">     
               <button class="btn__modal-submit">
               <i class="fas fa-check"></i>
               </button>
               <button class="btn__modal-cancel">
               <i class="fas fa-times"></i>
               </button>
            </div>
      </div>
      </div>`;
      return html;
   };

   self.init = async () => {
      await self.renderModal();
      self.addEv();
      self.previewImage();
      self.addValues();
   };

   self.init();
   return self;
}
