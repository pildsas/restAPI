export const baseURL = "https://still-dust-8126.herokuapp.com";
// export const baseURL = "http://localhost";
export const email = "admin@admin.com";
export const password = "123456";

export class Header {
    setHeader() {
        return new Promise((resolve) => {
            axios.defaults.headers.common = {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            };
            resolve();
        });
    }
}
