import { Knex } from 'knex';
import { selectArrayRandomItems, randomNumber } from '../../utils';

const locations = [
    {
        name: 'Recicle Mais',
        image: 'fake-image.png',
        email: 'reciclemais@gmail.com',
        whatsapp: '061998877665',
        latitude: -23.0000234,
        longitude: 12.0230214,
        city: 'Distrito Federal',
        uf: 'DF'
    },
    {
        name: 'Auto Reciclo',
        image: 'fake-image2.png',
        email: 'auto_reciclo@gmail.com',
        whatsapp: '061988776651',
        latitude: -73.0085534,
        longitude: 56.1430333,
        city: 'Distrito Federal',
        uf: 'DF'
    }
]

export async function seed(knex: Knex) {
    const transaction = await knex.transaction();

    const items = await transaction('items').select('*')

    for(const location of locations) {
        const locationId = await transaction('locations').insert(location)

        const qtdItems = items.length > 10 ? 7 : items.length

        if(qtdItems<1) break

        const randomItems = selectArrayRandomItems(items, randomNumber(qtdItems))
        for(const randomItem of randomItems) {
            await transaction('location_items').insert({
                item_id: Number(randomItem.id),
                location_id: Number(locationId)
            })
        }
    }

    return await transaction.commit();
}