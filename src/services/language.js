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
            chooseContact: 'Escolha um contato para iniciar uma conversa',
            contacts: 'Contatos',
            searchContacts: 'Buscar contatos',
            name: 'Nome',
            phone: 'Telefone',
            participants: 'Membros',
            groups: 'Grupos',
            searchGroup: 'Procurar grupos...',
            inviteParticipants: 'Convidar membros',
            inviteParticipantsText: 'Convide membros para seus grupos rapidamente',
            pleaseWait: 'Por favor, aguarde...',
            allGroups: 'Grupos',
            allGroupsText: 'Gerencie todos os seus grupos.',
            createGroup: 'Criar grupo',
            createGroupText: 'Crie grupos do whatsapp de uma forma rápida.',
        }
    }
    if(lang == 'en-US'){
        return {
            chooseContact: 'Choose a contact to start a conversation',
            contacts: 'Contacts',
            searchContacts: 'Search contacts',
            name: 'Name',
            phone: 'Phone',
            participants: 'Partcipants',
            groups: 'Groups',
            searchGroup: 'Search groups...',
            inviteParticipants: 'Invite partcipants',
            inviteParticipantsText: 'Invite participants to your groups quickly.',
            pleaseWait: 'Please, wait...',
            allGroups: 'All Groups',
            allGroupsText: 'Manage all your groups.',
            createGroup: 'Create Group',
            createGroupText: 'Create a WhatsApp group in an automated way.',
        }
    }
}