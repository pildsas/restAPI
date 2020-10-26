import * as helpers from "../helpers.js";
import { baseURL } from "../config.js";

export function EditItem(options) {
   this.renderModal = async () => {
      this.data = await this.getData();

      this.container = document.getElementById(options.id);
      this.container.innerHTML = this.body();

      this.input = this.container.querySelector("#input__folder-name");

      this.container.style = null;
      this.container.style.opacity = 1;
      this.container.style.display = "block";

      /**
       * MAIN OVERLAY
       */
      if (options.secondary_overlay == undefined) {
         this.overlay = this.container.querySelector(".overlay");
         this.overlay.style.display = "block";
      }

      /**
       * MODAL OVERLAY
       */
      if (options.secondary_overlay !== undefined) {
         this.secondary_overlay = document.querySelector(options.secondary_overlay);
         this.secondary_overlay.style.display = "block";
         this.secondary_overlay.style.background = options.secondary_overlay_bg;
      }

      /**
       * ITEM OVERLAY
       */
      if (options.item_overlay !== undefined) {
         this.item_overlay = helpers.getFirstElementByClassName(options.target, options.item_overlay);
         this.item_overlay.style.display = "block";
         this.item_overlay.style.background = options.item_overlay_bg;
      }
   };

   this.hideModal = () => {
      let overlay = document.querySelector(".overlay");
      if (overlay !== null || typeof overlay == "undefined") {
         this.container.style.display = "none";
         this.container.innerHTML = "";
      }
      if (this.secondary_overlay) this.secondary_overlay.style.display = null;
      if (this.item_overlay) this.item_overlay.style.display = null;
   };

   this.addEv = () => {
      this.btn_submit = this.container.querySelector(".btn__modal-submit");
      this.btn_submit.addEventListener("click", async (e) => {
         this.target = e.target;
         this.response = await this.renameItem();
         this.updateDOM();

         if (this.response) {
            if (options.cb) options.cb();
            this.hideModal();
         } else {
            // this.displayError();
         }
      });

      this.btn_cancel = this.container.querySelector(".btn__modal-cancel");
      this.btn_cancel.addEventListener("click", this.hideModal);

      this.btn_close = this.container.querySelector(".btn__modal-close");
      this.btn_close.addEventListener("click", this.hideModal);
   };

   this.getData = async () => {
      let id = helpers.getFirstElementByClassName(options.target, "box__item").getAttribute("item");
      self.url = baseURL + `/api/list_items/${id}`;

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

   this.renameItem = async () => {
      this.item = helpers.getFirstElementByClassName(options.target, "box__item");
      let id = this.item.getAttribute("item");
      let title = document.querySelector("#input__item-title").value;

      this.url = baseURL + `/api/list_items/${id}`;

      this.data = {
         title: title,
      };

      return fetch(this.url, {
         method: "PATCH",
         body: JSON.stringify(this.data),
         headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            "Content-Type": "application/merge-patch+json",
         },
      })
         .then((res) => {
            return res.json();
         })
         .then((res) => {
            return res;
         });
   };

   this.addValues = () => {
      document.querySelector("#input__item-title").value = this.data.title;
   };

   this.displayError = () => {
      this.error = this.container.querySelector(".text__error-message");
      this.error.innerHTML = "";
      this.response.errors.forEach((error) => {
         this.error.innerHTML += error.message;
      });

      this.error.style.display = "block";
   };

   this.updateDOM = () => {
      this.item.querySelector(".item__title").innerHTML = this.response.title;
      if (this.item.classList.contains("item__active")) {
         document.querySelector(".text__entry-header").innerHTML = this.response.title;
      }
   };

   this.body = () => {
      let html = `
      <div class='overlay'></div>
         <div class='modal__window ${options.style_class}'>
            <div class="modal__header">
               <h5 class="text__modal-header">Rename Item</h5>
               <i class="fas fa-times btn__modal-close"></i>
            </div>
            <div class="modal__body">

            <form action="" name="item_rename" method="POST" class="form__rename-item">
               <input type="text" id="input__item-title" placeholder="Item Name" name="item_rename[name]" autocomplete="off">
               <div class="text__error-message"></div>
            </form>

            </div>
               <div class="modal__footer">     
               <button class="btn__modal-submit">
               <i class="fas fa-check"></i>
               </button>
               <button class="btn__modal-cancel">
               <i class="fas fa-times"></i>
               </button>
            </div>
      </div>`;
      return html;
   };

   this.init = async () => {
      await this.renderModal();
      this.addValues();
      this.addEv();
   };

   this.init();
   return this;
}
