import { Knex } from 'knex'

export async function seed(knex: Knex) {
    const transaction = await knex.transaction();
    await transaction('items').insert([
        { title: 'Papéis e Papelão', image: 'papel.svg' },
        { title: 'Vidros e Lâmpadas', image: 'vidro.svg' },
        { title: 'Óleo de Cozinha', image: 'oleo.svg' },
        { title: 'Resíduos Orgânicos', image: 'organico.svg' },
        { title: 'Baterias e Pilhas', image: 'bateria.svg' },
        { title: 'Eletrônicos', image: 'eletronico.svg' },
    ])
    return await transaction.commit();
}