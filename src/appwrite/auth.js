import { Client, Account, ID } from "appwrite";
import conf from "../config/conf";

class authApp {
    client = new Client()
    account;

    constructor() {
        this.client.setEndpoint(conf.APPWRITE_PROJECT_URL).setProject(conf.APPWRITE_PROJECT_ID);
        this.account = new Account(this.client);
    }

    async createAccount(email, password, name) {
        try {
            const userAcc = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if (userAcc) {
                return await this.login(email, password);
            } else {
                return userAcc;
            }
        }
        catch(error) {
            console.error("Error creating user:", error.message);
            throw error;
        }
    }

    async login(email, password) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        }
        catch(error) {
            console.error("Error login user:", error.message);
            throw error;
        }
    }

    async getCurrentAccount() {
        try {
            return await this.account.get();
        } catch (error) {
            // Handle the case where user is not authenticated (401 error)
            // This is normal behavior when no user is logged in
            if (error.code === 401 || error.type === 'general_unauthorized_scope') {
                console.log("No authenticated user found");
                return null; // Return null instead of throwing error
            }
            
            // For other errors, still throw them
            console.error("Error checking auth login:", error.message);
            throw error;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.error("Error deleting sessions:", error.message);
            throw error;
        }
    }
}

const AuthApp = new authApp();

export default AuthApp;