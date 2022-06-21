import config from '../config'

export const language = () => {
    return getLanguage(config.LANGUAGE)
}
/**
 * Função que busca todas as traduções disponiveis e retorna
 * @param {pt-BR ou en-US} lang 
 * @returns 
 */
export function getLanguage(lang){
    if(lang == 'pt-BR'){
        return {
            //ChatPage
            chooseContact: 'Escolha um contato para iniciar uma conversa',

            //ContactPage
            contacts: 'Contatos',
            searchContacts: 'Buscar contatos',
            name: 'Nome',
            phone: 'Telefone',
        }
    }
    if(lang == 'en-US'){
        return {
            //ChatPage
            chooseContact: 'Choose a contact to start a conversation',

            //ContactPage
            contacts: 'Contacts',
            searchContacts: 'Search contacts',
            name: 'Name',
            phone: 'Phone',
        }
    }
}