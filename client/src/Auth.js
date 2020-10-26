import { baseURL } from "./config.js";
import * as helpers from "./helpers.js";

export function Login(options) {
   this.getJWTToken = (email, password) => {
      let params = {
         email: email,
         password: password,
      };

      return fetch(baseURL + "/authentication_token", {
         method: "POST",
         body: JSON.stringify(params),
         headers: {
            "Content-Type": "application/json",
         },
      })
         .then((res) => {
            return res.json();
         })
         .then((res) => {
            localStorage.setItem("jwt_token", res.token);
            localStorage.setItem("user_id", res.id);
            return res;
         })
         .catch((error) => {});
   };

   this.checkLogin = () => {
      return fetch(baseURL + `/api/status`, {
         method: "GET",
         headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt_token"),
         },
      })
         .then((res) => {
            return res.json();
         })
         .then((res) => {
            if (res.code == 200) {
               return res;
            } else if (res.code == 401) {
               return false;
            }
         })
         .catch((error) => {});
   };

   this.loginPanel = () => {
      let col = document.querySelector("#col__auth");

      let html = `
      <div class="box__auth">
      <div class="auth__row">
         <input type="text" required id="input__email" value="admin@admin.com" />
         <span class="fas fa-user"></span>
         <label>Email</label>
      </div>
      <div class="auth__row">
         <input type="password" required id="input__password" value="123456" />
         <span class="fas fa-lock"></span>
         <label>Password</label>
      </div>
      <div class="auth__row">
         <button id="btn__auth">Sign in</button>
      </div>
      </div>
      `;

      col.innerHTML = "";
      col.innerHTML = html;

      return true;
   };

   this.logoutPanel = () => {
      let col = document.querySelector("#col__auth");
      let html = `
      <div class="box__auth-login">
      <div class="auth__item">logged in as <span class="auth__item-highligt">${this.response.email}</span></div>
      <div class="auth__item">
         <a class="auth__link" id="link__logout">
            <i class="fas fa-sign-out-alt" id="icon__logout"></i>
         </a>
      </div>
      </div>
      `;

      col.innerHTML = "";
      col.innerHTML = html;
   };

   this.notLogged = () => {
      let entries = document.querySelector("#entry__items");
      let items = document.querySelector("#item__items");

      let html = `
      <div class="no-content">No user logged in</div>
      `;
      entries.innerHTML = html;
      items.innerHTML = html;

      let input_item = document.querySelector(" #input__add-item");
      let input_entry = document.querySelector("#input__add-entry");
      let input_entry_img = document.querySelector("#input__entry-image");

      input_item.setAttribute("disabled", "disabled");
      input_entry.setAttribute("disabled", "disabled");
      input_entry_img.setAttribute("disabled", "disabled");
   };

   this.addEv = () => {
      let btn = document.querySelector("#btn__auth");

      btn.addEventListener(
         "click",
         helpers.debounce(async (e) => {
            e.preventDefault();
            let email = document.querySelector("#input__email").value;
            let password = document.querySelector("#input__password").value;

            this.response = await this.getJWTToken(email, password);
            if (this.response.token) {
               this.logoutPanel();
               this.addEvLogout();
               options.cb();
            }
         }, 300)
      );
   };

   this.addEvLogout = () => {
      let icon_logout = document.querySelector("#icon__logout");
      icon_logout.addEventListener(
         "click",
         helpers.debounce((e) => {
            return new Promise((resolve) => {
               localStorage.removeItem("jwt_token");
               localStorage.removeItem("user_id");
               resolve();
               location.reload();
            });
         }, 300)
      );
   };

   this.init = async () => {
      this.response = await this.checkLogin();
      if (!this.response) {
         this.loginPanel();
         this.addEv();
         this.notLogged();
      } else {
         this.logoutPanel();
         this.addEvLogout();
         options.cb();
      }
   };

   this.init();
}
