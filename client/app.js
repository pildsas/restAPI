import { AppController } from "./src/AppController.js";
import { EditEntry } from "./src/modals/_edit_entry.js";
import { EditItem } from "./src/modals/_edit_item.js";
import { Login } from "./src/Auth.js";

new Login({
    cb: () => {
        new AppController({
            modalEntry: (target) => {
                new EditEntry({
                    id: "box__modal",
                    target: target,
                    style_class: "style-class__entry-edit",
                    onsubmit: async (res) => {},
                });
            },
            modalItem: (target) => {
                new EditItem({
                    id: "box__modal",
                    target: target,
                    style_class: "style-class__entry-item",
                    onsubmit: async (res) => {},
                });
            },
        });
    },
});
