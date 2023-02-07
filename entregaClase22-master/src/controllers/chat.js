//import knexChat from './knexChat.js';

class Chat {
    constructor(knex, table) {
      this.knex = knex;
      this.table = table;
    }
      
    async getMessages() {
      try {
        const messages = await this.knex.from(this.table).select('*');
          
        return messages;
      } catch (error) {
        throw error;
      }
    }
  
    async saveMessages(obj) {
      try {
        const message = await this.knex(this.table).insert({email: obj.email, message: obj.message, date: obj.date});
        return message;
      } catch (error) {
        throw error;
      }
    }
  }
export default Chat; 